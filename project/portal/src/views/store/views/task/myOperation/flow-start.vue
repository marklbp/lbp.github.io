<template>
  <page-init
    :loading="pageInit"
    :message="message"
    :code="code"
    ref="page_init"
  >
    <!-- <div class="page-inner" v-loading="saveLoading"> -->
    <router-back
      :text="processModelAttribute.label"
      style="position: relative;"
    >
      <el-button
        size="small"
        class="btn-edit-template"
        :class="{ 'btn-edit-template-hover': showTemplateForm }"
        @click="toggleTemplateForm"
      >
        <i class="font-icon icon-edit"></i>
      </el-button>
      <div class="actions">
        <el-button size="small" @click="$router.go(-1)">取消</el-button>
        <!-- <el-button size="small">保存为草稿</el-button> -->
        <el-button size="small" type="primary" @click="clickPublishHandler"
          >确定并发布</el-button
        >
      </div>
    </router-back>
    <div class="location">
      当前位置：
      <a
        href="javascript:;"
        v-for="(item, i) in path"
        :key="i"
        @click="clickLocationHandler(i)"
      >
        <span style="color:#333" v-if="i !== 0">&gt;</span>
        {{ item.label }}
      </a>
    </div>
    <flow-display
      class="graph"
      ref="graphContainer"
      :xml="flowXml"
      :message="message"
      :persons="persons"
      @dblclick="dblclickTaskHandler"
      @click="clickTaskHandler"
    />
    <form-pane
      :is-active="showTemplateForm"
      type="0"
      keys="showTemplateForm,processModelAttribute"
      :persons="persons"
      :data="processModelAttribute"
      :form-items="$constant.FLOW_ITEMS.start.template"
      @cancel="cancleHandler"
      @confirm="handleOk"
      confirm-button-text="保存"
    />
    <form-pane
      :is-active="showTaskForm"
      :type="taskType"
      keys="showTaskForm,taskFormAtts"
      :persons="persons"
      :data="taskFormAtts"
      :form-items="formItems"
      :services="services"
      @cancel="showTaskForm = !showTaskForm"
      @confirm="handleOk"
      confirm-button-text="保存"
    />
    <el-dialog title="提示" :visible.sync="showExecutorNotice" width="30%">
      <span class="exector-notice">
        {{
          noExectorNum
        }}个任务未分配执行人，确定发布后任务将自动分配给您，您可后续在任务详情页修改执行人。
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="publishHandler(false)"
          style="border-color: transparent;"
          >暂不发布</el-button
        >
        <el-button type="primary" @click="publishHandler(true)"
          >确定发布</el-button
        >
      </span>
    </el-dialog>
    <!-- </div> -->
  </page-init>
</template>
<script>
import { getPersons, queryRobotServices } from '~/mixins'
import FlowHelper from '~/utils/flow'
export default {
  name: 'flow-detail',
  components: {
    'router-back': _ => import('~/components/router-back'),
    'flow-display': _ => import('~/components/flow-display'),
    'form-pane': _ => import('~/components/form-pane'),
    'page-init': _ => import('~/components/page-init')
  },
  mixins: [getPersons, queryRobotServices],
  data() {
    return {
      size: 100,
      flowXml: '',
      showTemplateForm: true,
      showTaskForm: false,
      taskFormAtts: {},
      services: [],
      processModelAttribute: this.makeFormItems(),
      message: '',
      persons: [],
      categories: [],
      pageInit: true,
      code: 0,
      taskType: 1,
      path: [],
      showExecutorNotice: false, // 执行人提示弹窗
      noExectorNum: '' // 未填写执行人数量
    }
  },
  async created() {
    if (!this.$route.params.fid) {
      this.pageInit = false
      this.message = '数据不存在'
      this.code = 404
      return
    }
    await this.queryRobotServices()
    this.services = this.$services
    this.getPersons()
      .then(r => {
        this.persons = this.$persons.map(p => ({ ...p }))
        return this.getDetail()
          .then(r => (this.pageInit = false))
          .catch(e => Promise.reject(e))
      })
      .catch(e => {
        this.code = e.code
        this.pageInit = false
        this.message = e.message || e.msg
      })
  },
  watch: {
    taskFormAtts: {
      deep: true,
      handler(v) {
        this.updateCellAttrs(v)
      }
    },
    showTaskForm(v) {
      if (!v) this.$refs.graphContainer.resetCell(this.activeCell, '#ededed')
    }
  },
  methods: {
    cancleHandler() {
      this.showTemplateForm = !this.showTemplateForm
      this.processModelAttribute = JSON.parse(
        JSON.stringify(this.processModelAttribute)
      )
    },
    publishHandler(isTrue) {
      if (isTrue) {
        this.handleFlowSave()
      }
      this.showExecutorNotice = false
    },
    clickPublishHandler() {
      const noExectorNum = (this.noExectorNum = this.getNoExectorNum())
      if (noExectorNum > 0) {
        this.showExecutorNotice = true
      } else {
        this.handleFlowSave()
      }
    },
    getNoExectorNum() {
      let execNum = 0 // 执行人数量
      let totalExecNum = 0 // 执行人总数
      if (this.tempTasks) {
        Object.keys(this.tempTasks).forEach(t => {
          let id = t.slice(4)
          const task = this.flowTree.tasks.find(
            val => parseInt(val.id, 10) === parseInt(id, 10)
          )
          let subTask
          if (!task) {
            this.flowTree.tasks.find(val => {
              if (val.flow === 'flow') {
                subTask = val.subFlow.flowTree.tasks.find(
                  val => parseInt(val.id, 10) === parseInt(id, 10)
                )
                return !!subTask
              }
              return false
            })
          }
          if (
            (task || subTask) &&
            (task || subTask).flow !== 'flow' &&
            (task || subTask).flow !== 'robot'
          ) {
            totalExecNum++
            if (this.tempTasks[t].assignee) {
              execNum++
            }
          }
        })
      }
      return totalExecNum - execNum
    },
    clickTaskHandler({ cell, event }) {
      if (/subflow-btn/.test(event.target.className)) {
        const target = this.flowTree.tasks.find(
          val => parseInt(val.id, 10) === parseInt(cell.id, 10)
        )
        this.flowXml = this.preParseXML(JSON.stringify(target.subFlow.flowTree))
        this.pathHandle(cell)
      }
    },
    clickLocationHandler(i) {
      if (i === 0) {
        this.flowXml = JSON.stringify(this.flowTree)
        this.path.splice(1, 1)
      }
    },
    updateFlowTree(data) {
      if (data) {
        this.flowTree = data
        return
      }
      let flowTree = JSON.parse(JSON.stringify(this.flowTree))
      if (this.tempTasks) {
        Object.keys(this.tempTasks).forEach(t => {
          let id = t.slice(4)
          flowTree.tasks.forEach(c => {
            if (parseInt(c.id, 10) === parseInt(id, 10)) {
              // 流程下的任务节点处理
              c.attrs = JSON.parse(JSON.stringify(this.tempTasks[t]))
              if (c.flow == 'flow') {
                c.subFlow = JSON.parse(
                  JSON.stringify(this.tempTasks[t].subFlow)
                )
                delete c.attrs.subFlow
              }
            } else if (c.flow === 'flow') {
              // 子流程下的任务节点处理
              const target = c.subFlow.flowTree.tasks.find(
                val => parseInt(val.id, 10) === parseInt(id, 10)
              )
              if (target) {
                target.attrs = this.tempTasks[t]
              }
            }
          })
        })
      }
      this.flowTree = flowTree
    },
    makeFormItems() {
      return Object.keys(this.$constant.FLOW_ITEMS.start.template).reduce(
        (o, k) => {
          if (this.$constant.FLOW_ITEMS.start.template[k].show) {
            o[k] = this.makeFormItemVal(k)
          }
          return o
        },
        {}
      )
    },
    makeFormItemVal(k) {
      switch (k) {
        case 'label':
          return ''
        case 'attachment':
          return []
        default:
          return ''
      }
    },
    toggleTemplateForm() {
      this.showTemplateForm = true
      this.showTaskForm = false
    },
    getDetail() {
      return this.$api.template
        .query(
          { id: this.$route.params.fid },
          { needToast: false, headers: { groupId: this.$route.params.storeId } }
        )
        .then(({ data }) => this.getDetailDone(data))
        .catch(e => Promise.reject(e))
    },
    getDetailDone(data) {
      let { flowXml, processModelAttribute } = data
      flowXml = this.preParseXML(flowXml)
      this.flowXml = flowXml
      let flowTree = JSON.parse(flowXml)
      flowTree.tasks.forEach(t => {
        this.createTempTask(t)
        if (t.flow === 'flow') {
          t.subFlow.flowTree.tasks.forEach(val => this.createTempTask(val))
        }
      })
      this.updateFlowTree(flowTree)
      this.processModelAttribute = Object.assign(
        this.processModelAttribute,
        processModelAttribute
      )
      this.path = [
        {
          label: processModelAttribute.label,
          id: null
        }
      ]
    },
    preParseXML(xml) {
      xml = JSON.parse(xml)
      xml.cells.forEach(t => {
        if (t.style) {
          if (t.flow) {
            t.style.fillColor = '#ededed'
            t.style.strokeColor = 'transparent'
            t.style.strokeWidth = 0
          } else if (t.edge) {
            t.style.strokeColor = '#999'
          }
        }
      })
      xml.tasks.forEach(t => {
        t.value = t.attrs.label
        if (t.style) {
          t.style.fillColor = '#ededed'
          t.style.strokeWidth = 0
          t.style.strokeColor = 'transparent'
        }
        if (t.flow === 'flow') {
          t.style.shape = 'mxgraph.portal.flowa'
        }
      })
      return JSON.stringify(xml)
    },
    handleFlowCancel() {
      this.$router.go(-1)
    },
    handleOk(data) {
      let o = { ...data }
      Object.assign(this, data)
      if (data.taskFormAtts) {
        let assignee = data.taskFormAtts.assignee + ''
        let { name, color } =
          this.persons.find(p => assignee.indexOf(p.id) > -1) || {}
        this.$refs.graphContainer.setCellValue(
          this.activeCell,
          name,
          color,
          data.taskFormAtts.label,
          data.taskFormAtts.executorPost
        )
      }
    },
    pathHandle(cell) {
      if (this.flowTree) {
        const clickCell = this.flowTree.tasks.find(val => val.id === cell.id)
        if (clickCell && clickCell.flow === 'flow') {
          this.path.push({
            label: clickCell.attrs.label,
            id: clickCell.id
          })
        }
      }
    },
    dblclickTaskHandler(cell) {
      const typeMap = {
        task: 1,
        condition: 2,
        flow: 3,
        robot: 4
      }
      if (!/task|condition|flow|robot/.test(cell.flow)) return
      const cellType = cell.flow
      this.taskType = typeMap[cellType]
      this.showTemplateForm = false
      this.showTaskForm = true
      this.createTempTask(cell)
      let temp = {}
      if (cell.flow == 'condition') {
        let edges = cell.edges.filter(e => e.source == cell)
        let agree = edges.find(e => e.conditionExpression == 0) || {
          target: { value: '' }
        }
        let reject = edges.find(e => e.conditionExpression == 1) || {
          target: { value: '' }
        }
        temp.agree =
          agree.target.flow == 'terminal'
            ? '结束'
            : agree.target.flow == 'board'
            ? '中转站'
            : agree.target.flow == 'merge'
            ? '合并'
            : agree.target.flow == 'branch'
            ? '分支'
            : this.tempTasks['task' + agree.target.id].label
        temp.reject =
          reject.target.flow == 'terminal'
            ? '结束'
            : reject.target.flow == 'board'
            ? '中转站'
            : reject.target.flow == 'merge'
            ? '合并'
            : reject.target.flow == 'branch'
            ? '分支'
            : this.tempTasks['task' + reject.target.id].label
      }
      this.taskFormAtts = { ...this.tempTasks['task' + cell.id], ...temp }
      this.activeCell = cell
      this.$refs.graphContainer.resetCell(cell)
    },
    updateCellAttrs(attrs) {
      let id = 'task' + this.activeCell.id
      let temp = JSON.parse(JSON.stringify(attrs))
      if ('agree' in temp) delete temp.agree
      if ('reject' in temp) delete temp.reject
      Object.assign(this.tempTasks[id], temp)
      this.updateFlowTree()
    },
    handleFlowSave() {
      this.toggleSaveLoading()
      if (!this.validTemplate() || !this.validTasks()) {
        return this.toggleSaveLoading()
      }
      let processModelAttribute = { ...this.processModelAttribute }
      if (
        processModelAttribute.attachment instanceof Array &&
        processModelAttribute.attachment.length > 0
      ) {
        processModelAttribute.attachment = processModelAttribute.attachment.map(
          a => ({
            url: a.url,
            name: a.name
          })
        )
      } else {
        processModelAttribute.attachment = null
      }
      let params = {
        flowTree: this.flowTree,
        //groupId: this.$route.params.storeId,
        processModelAttribute
      }
      delete params.processModelAttribute.assignee
      if (this.$route.params.fid) {
        params.modelId = this.$route.params.fid
      }

      this.$api.flowSetting
        .flowStart(params, { headers: { groupId: this.$route.params.storeId } })
        .then(r => {
          this.$message.success({
            message: '启动成功',
            onClose: _ => {
              this.toggleSaveLoading()
              // if (this.$route.params.storeId) {
              //   this.$router.replace(`/${this.$route.params.storeId}/task`)
              // }
              this.$router.back()
            }
          })
        })
        .catch(e => this.toggleSaveLoading())
    },
    toggleSaveLoading() {
      if (!this.loadingInstance) {
        this.loadingInstance = this.$loading({
          target: this.$refs.page_init.$el
        })
      } else {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    },
    validTemplate() {
      let hasName =
        this.processModelAttribute.label &&
        this.processModelAttribute.label.length > 0
      if (hasName) {
        return true
      } else {
        this.$message.error('请编辑完善流程模板的名称或者分类')
        return false
      }
    },
    validTasks() {
      let tasks = FlowHelper.getTaskCells(this.$refs.graphContainer.graph)
      if (!tasks.every(t => this.validTaskAttr(t))) {
        return false
      }
      return true
    },
    validTaskAttr(cell) {
      let value = cell.value
      let message = '请双击检查相关任务节点的属性必填信息是否完善'
      if (!this.tempTasks) {
        this.$message.error(message)
        return false
      } else if (
        !this.tempTasks['task' + cell.id] ||
        !this.tempTasks['task' + cell.id].label
      ) {
        this.$message.error(message)
        return false
      }
      return true
    },
    createTempTask(task) {
      let id = 'task' + task.id
      if (!this.tempTasks) {
        this.tempTasks = {}
      }
      if (!this.tempTasks[id]) {
        this.tempTasks[id] = {}
      }
      if (task.attrs) {
        this.tempTasks[id] = task.attrs
      }
      let temp = {
        label: '',
        assignee: '',
        description: ''
      }
      if (task.flow == 'task') {
        temp.knowledge = ''
        temp.tools = ''
      }
      if (task.flow === 'flow') {
        temp.subFlow = task.subFlow
      }
      this.tempTasks[id] = Object.assign(temp, this.tempTasks[id])
    }
  },
  computed: {
    /**
     * taskType@任务类型
     * task => 1
     * condition => 2
     * flow => 3
     * robot => 4
     */
    formItems() {
      const start = this.$constant.FLOW_ITEMS.start
      switch (this.taskType) {
        case 1:
          return start.task
        case 2:
          return start.check
        case 3:
          return start.flow
        case 4:
          return start.robot
      }
      return this.$constant.FLOW_ITEMS.start.template
    }
  }
}
</script>
<style lang="scss" scoped>
.page-init {
  display: flex;
  flex-direction: column;
}
.graph {
  flex: 1;
  background-color: #fff;
}
.actions {
  position: absolute;
  right: 16px;
  top: 0;
}
.btn-edit-template {
  margin-left: 22px;
  background: transparent;
  border-radius: 2px;
  color: #999999;
  padding: 7px;
  border-color: transparent;
  &:hover {
    color: #3366ff;
    background: rgba(51, 102, 255, 0.1);
  }
}
.btn-edit-template-hover {
  color: #3366ff;
  background: rgba(51, 102, 255, 0.1);
}
.location {
  line-height: 56px;
  background: white;
  font-size: 14px;
  color: #333;
  padding: 0 32px;
  > span {
    cursor: pointer;
    color: #333;
    &:hover {
      color: #3366ff;
    }
  }
}
.exector-notice {
  font-size: 14px;
  color: #333;
  line-height: 22px;
}
</style>
