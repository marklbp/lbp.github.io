<template>
  <page-init
    :loading="pageInit"
    :message="message"
    :code="code"
    class="page-init-editor"
  >
    <div class="flow-editor" v-loading="saveLoading">
      <div class="editor__header">
        <div class="editor__title">
          <div class="editor__brand">
            <img src="~/assets/img/logo.svg" />
          </div>
          <div class="template__name">
            {{ processModelAttribute.label || '模板名称' }}
          </div>
          <el-button
            class="template__edit ml__m"
            type="text"
            @click="
              showTemplateForm = true
              showTaskForm = false
            "
            >编辑</el-button
          >
        </div>
        <div class="editor__action">
          <el-button type="default" size="small" @click="handleFlowCancel"
            >取消</el-button
          >
          <el-button type="default" size="small" @click="handleFlowSave()"
            >保存为草稿</el-button
          >
          <el-button type="primary" size="small" @click="handleFlowSave(true)"
            >保存并发布</el-button
          >
        </div>
      </div>
      <div class="editor__body">
        <div class="editor__content" id="flow_editor" ref="flowEditerRef"></div>
      </div>
      <form-pane
        :is-active="showTemplateForm"
        :type="0"
        keys="showTemplateForm,processModelAttribute"
        :data="processModelAttribute"
        :categories="categories"
        :form-items="$constant.FLOW_ITEMS.template.template"
        @cancel="cancleHandler('flow')"
        @confirm="handleOk"
        @categories="updateCategories"
        :existTemplateLabel="existTemplateLabel"
      />
      <form-pane
        :is-active="showTaskForm"
        :type="taskType"
        keys="showTaskForm,taskFormAtts"
        :form-items="formItems"
        :data="taskFormAtts"
        :persons="persons"
        :services="services"
        @cancel="cancleHandler('task')"
        @confirm="handleOk"
        :tasks="nodesYesNo"
      />
    </div>
  </page-init>
</template>
<script>
import '^/mxgraph/editor/styles/grapheditor.css'
import '^/mxgraph/editor/resources/grapheditor.txt.js'
import '^/mxgraph/editor/styles/default.xml.js'
import '^/mxgraph/editor/sanitizer/sanitizer.min.js'
import '^/mxgraph/editor/js/EditorUi.js'
import '^/mxgraph/editor/js/Editor.js'
import '^/mxgraph/editor/js/Sidebar.js'
import '^/mxgraph/editor/js/Graph.js'
import '^/mxgraph/editor/js/Format.js'
import '^/mxgraph/editor/js/Shapes.js'
import '^/mxgraph/editor/js/Actions.js'
import '^/mxgraph/editor/js/Menus.js'
import '^/mxgraph/editor/js/Toolbar.js'
import '^/mxgraph/editor/js/Dialogs.js'
import FlowHelper from '~/utils/flow'
import { getPersons, getCategories, queryRobotServices } from '~/mixins'
export default {
  name: 'FlowEditor',
  components: {
    'page-init': _ => import('~/components/page-init'),
    'form-pane': _ => import('~/components/form-pane')
  },
  mixins: [getPersons, getCategories, queryRobotServices],
  data() {
    return {
      pageInit: true,
      message: '',
      saveLoading: false,
      showTaskForm: false,
      taskFormAtts: {},
      showTemplateForm: false,
      processModelAttribute: {
        label: '',
        category: null,
        knowledge: null
      },
      xml: '',
      categories: [],
      persons: [],
      services: [],
      code: 0,
      taskType: 1,
      nodesYesNo: [],
      existTemplateLabel: [] // 已存在的模板名
    }
  },
  watch: {
    taskFormAtts: {
      deep: true,
      handler(v) {
        this.updateCellAttrs(v)
      }
    }
  },
  created() {
    this.cellErrors = {}
    this.init()
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
      const template = this.$constant.FLOW_ITEMS.template
      switch (this.taskType) {
        case 1:
          return template.task
        case 2:
          return template.check
        case 3:
          return template.flow
        case 4:
          return template.robot
      }
      return this.$constant.FLOW_ITEMS.template.template
    }
  },
  destroyed() {
    let children = [...document.body.children]
    children.forEach(c => {
      if (
        c.nodeType === 1 &&
        ((c.className &&
          (c.className.indexOf('ge') == 0 || c.className.indexOf('mx') == 0)) ||
          (c.style.touchAction === 'none' &&
            c.firstChild.nodeName.toLowerCase() === 'svg'))
      ) {
        document.body.removeChild(c)
      }
    })
  },
  methods: {
    async init() {
      try {
        await Promise.all([
          this.getPersons(),
          this.getCategories(),
          this.queryRobotServices()
        ])
        this.persons = this.$persons.map(p => ({ ...p }))
        this.categories = this.$categories
        this.services = this.$services
        await this.queryXml()
        this.pageInit = false
        this.message = ''
        this.code = 0
        this.timer = setInterval(_ => this.initEditor(), 0)
      } catch (e) {
        this.pageInit = false
        this.message = e.message || e.msg
        this.code = e.code
      }
    },
    cancleHandler(type) {
      if (type === 'task') {
        this.showTaskForm = !this.showTaskForm
      } else if (type === 'flow') {
        this.showTemplateForm = !this.showTemplateForm
        this.processModelAttribute = JSON.parse(
          JSON.stringify(this.processModelAttribute)
        )
      }
    },
    // GraphEditor初始化
    initEditor() {
      if (!this.$refs.flowEditerRef) return
      clearInterval(this.timer)
      delete this.timer
      this.graph = FlowHelper.initEditor(
        this.$refs.flowEditerRef,
        grapheditorTXT,
        defaultThemeStylesheet,
        cell => {
          this.clickTaskHandle(cell)
        }
      )
      this.displayXml()
    },
    /**
     * [queryXml 获取编辑的xml接口函数]
     * @return {[undefined]} [没有返回值]
     */
    queryXml() {
      if (!this.$route.params.modelId) return Promise.resolve()
      return this.$api.template
        .query(
          { id: this.$route.params.modelId },
          { needToast: false, headers: { groupId: this.$route.params.storeId } }
        )
        .then(({ data }) => this.queryXmlDone(data))
        .catch(e => Promise.reject(e))
    },
    queryXmlDone(data) {
      this.xml = this.preParseXML(data.flowXml)
      let flowTree = JSON.parse(this.xml)
      flowTree.tasks.forEach(t => this.createTempTask(t, flowTree))
      if (
        data.processModelAttribute.label &&
        Number(this.$route.params.modifyType) === 0 &&
        data.processModelAttribute.label.length <= 26
      ) {
        data.processModelAttribute.label += '（复制）'
      }
      this.processModelAttribute = data.processModelAttribute
      this.displayXml()
    },
    preParseXML(xml) {
      let xmlObj = JSON.parse(xml)
      xmlObj.cells.forEach(c => {
        if (c.flow) {
          c.style.fillColor = '#fff'
          c.style.strokeColor = '#999'
        }
      })
      xmlObj.tasks.forEach(t => {
        t.value = t.attrs.label
        if (t.flow) {
          t.style.fillColor = '#fff'
          t.style.strokeColor = '#999'
          t.style.strokeWidth = 1
        }
      })
      return JSON.stringify(xmlObj)
    },
    displayXml() {
      if (this.xml && this.graph) {
        const cells = []
        FlowHelper.display(this.xml, null, null, this.graph, false, false)
        FlowHelper.getTaskCells(this.graph).forEach(t => {
          const { label, executorPost: post, assignee } = this.tempTasks[
            'task' + t.id
          ]
          const executor = this.persons.find(val => val.id === assignee) || {}
          FlowHelper.updateCellAttrs(this.graph, t, {
            label: t.value,
            assigneeName: executor.name || assignee,
            executorPost: post
          })
          if (!assignee && /task|condition/.test(t.flow)) {
            cells.push(t)
          }
        })
        if (cells.length) {
          this.$message.error('请填写任务执行人')
          this.setCellStyle(cells, '#f00')
        }
      }
    },
    updateSubFlowId(flowTree) {
      flowTree.tasks.forEach(taskItem => {
        let taskItemId
        if (taskItem.flow === 'flow') {
          let taskItemId = taskItem.id
          const { cells, tasks } = taskItem.subFlow.flowTree
          cells.concat(tasks).forEach(val => {
            val.id && (val.id = taskItemId + '' + val.id)
            val.source && (val.source = taskItemId + '' + val.source)
            val.target && (val.target = taskItemId + '' + val.target)
          })
        }
      })
      return flowTree
    },
    createTempTask(task, flowTree) {
      let id = 'task' + task.id
      let temp = { label: '', assignee: '', description: '' }
      if (!this.tempTasks) {
        this.tempTasks = {}
      }
      if (!this.tempTasks[id]) {
        this.tempTasks[id] = {}
      }
      if (task.attrs) {
        this.tempTasks[id] = task.attrs
      }
      if (task.flow == 'condition') {
        temp = { agree: '', reject: '' }
        if (flowTree) {
          /**
           * 编辑时候需要设置决策节点的agree属性为指定的edge.id
           * 编辑时候需要设置决策节点的reject属性为指定的edge.id
           */
          flowTree.cells
            .filter(({ source }) => source == task.id)
            .forEach(e => {
              if (e.conditionExpression == 0) {
                temp.agree = e.id
              }
              if (e.conditionExpression == 1) {
                temp.reject = e.id
              }
            })
        }
      } else if (task.flow == 'task') {
        temp = { tools: '', knowledge: '' }
      } else if (task.flow == 'flow') {
        temp = { label: '', description: '', subFlow: task.subFlow }
      }
      // 兼容新旧数据
      !this.tempTasks[id].agree && delete this.tempTasks[id].agree
      !this.tempTasks[id].reject && delete this.tempTasks[id].reject
      this.tempTasks[id] = Object.assign(temp, this.tempTasks[id], {
        label: this.tempTasks[id].label || this.getValue(task)
      })
    },
    handleFlowCancel() {
      this.$confirm('是否确定取消流程模板编辑?取消后不可恢复', '提示', {
        confirmButtonText: '确定取消',
        cancelButtonText: '暂不取消',
        type: 'danger'
      })
        .then(_ => this.$router.go(-1))
        .catch(e => e)
    },
    handleFlowSave(releaseTag) {
      this.toggleSaveLoading()
      this.validFlow()
      if (this.validErrors()) {
        return this.toggleSaveLoading()
      }
      this.setCellStyle(FlowHelper.getCells(this.graph).filter(c => c.flow))
      let flowTree = FlowHelper.encodeXML2JSON(this.graph)
      if (this.tempTasks) {
        Object.keys(this.tempTasks).forEach(t => {
          let id = t.slice(4)
          flowTree.tasks.forEach(c => {
            if (c.id == id) {
              c.attrs = JSON.parse(JSON.stringify(this.tempTasks[t]))
              if ('agree' in c.attrs) delete c.attrs.agree
              if ('reject' in c.attrs) delete c.attrs.reject
              if ('assigneeName' in c.attrs) delete c.attrs.assigneeName
              if (c.flow === 'flow') {
                c.subFlow = c.attrs.subFlow
                delete c.attrs.subFlow
              }
            }
          })
        })
      }

      // 子流程更换后重置recode标识
      this.modifySubFlowList &&
        flowTree.tasks.forEach(val => {
          if (this.modifySubFlowList.includes(val.id)) {
            val.recode = ''
          }
        })

      let params = {
        flowTree,
        processModelAttribute: this.processModelAttribute,
        releaseTag: !releaseTag ? 0 : 1
      }
      if (
        this.$route.params.modelId &&
        this.$route.params.modifyType &&
        Number(this.$route.params.modifyType) === 1
      ) {
        params.modelId = this.$route.params.modelId
      }
      this.$api.template
        .save(params, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
        .then(r => {
          this.$message.success('保存成功')
          if (this.$route.params.storeId != undefined) {
            this.$router.replace(
              `/${this.$route.params.storeId}/setting/operation`
            )
          }
        })
        .catch(e => {
          this.toggleSaveLoading()
          if (parseInt(e.code, 10) === 10001) {
            this.showTemplateForm = true
            this.showTaskForm = false
            this.existTemplateLabel.push(this.processModelAttribute.label)
          } else {
            this.$message.error(e.message)
          }
        })
    },
    /**
     * [校验模板表单信息是否填写完整]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validTemplate() {
      let hasName =
        this.processModelAttribute.label &&
        this.processModelAttribute.label.length > 0
      if (!hasName) {
        this.makeErrors({ key: 'template', message: '模板信息未完善' })
      }
    },
    /**
     * [校验流程是否正确]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validFlow() {
      this.validStartEnd()
      this.validTasks()
      this.validConditions()
      this.validMergeBranch()
      this.validTemplate()
    },
    /**
     * [校验开始节点和结束节点]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validStartEnd() {
      let start = FlowHelper.getStartCells(this.graph)
      let end = FlowHelper.getEndCells(this.graph)
      // 开始节点仅关联一个节点
      if (start && start[0] && start[0].edges && start[0].edges.length > 1) {
        this.makeErrors({
          key: start[0].id,
          message: '开始节点只能关联一个其它节点',
          cell: start[0]
        })
      }

      // // 结束节点仅被一个节点关联
      // if (end && end[0] && end[0].edges && end[0].edges.length > 1) {
      //   this.makeErrors({
      //     key: end[0].id,
      //     message: '结束节点只能被一个其它节点关联',
      //     cell: end[0]
      //   })
      // }

      if (start.length <= 0 || start.length > 1) {
        if (start.length <= 0) {
          this.makeErrors({ key: 'start', message: '缺少开始节点' })
        } else {
          start.forEach(s =>
            this.makeErrors({ key: s.id, message: '节点仅限一个', cell: s })
          )
        }
      } else {
        start = start[0]
        if (
          !start.edges ||
          start.edges.length < 1 ||
          !start.edges.every(
            e =>
              e &&
              e.target &&
              e.target !== e.source &&
              e.target !== start &&
              e.target !== end &&
              e.source !== end &&
              e.target.isVertex() &&
              e.source.isVertex()
          )
        ) {
          console.log('1')
          this.makeErrors({
            key: start.id,
            message: '节点必须至少关联一个非开始和结束的节点,不能被关联',
            cell: start,
            type: 0
          })
        }
      }
      if (end.length <= 0) {
        this.makeErrors({ key: 'terminal', message: '缺少结束节点' })
      } else {
        for (let i = 0; i < end.length; i++) {
          let ed = end[i]
          let b =
            !ed.edges ||
            ed.edges.length < 1 ||
            !ed.edges.every(
              e =>
                e &&
                e.target &&
                e.target === ed &&
                e.source &&
                e.source.isVertex() &&
                !/terminal|start/.test(e.source.flow)
            )
          if (b) {
            this.makeErrors({
              key: ed.id,
              cell: ed,
              type: 0,
              message: '节点必须至少被一个非开始和结束的节点关联,只能被关联'
            })
          }
          if (end.length > 1) {
            this.makeErrors({
              key: ed.id,
              cell: ed,
              type: 0,
              message: '节点仅限一个'
            })
          }
        }
      }
    },
    /**
     * [校验分支合并节点]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validMergeBranch() {
      let cells = FlowHelper.getCells(this.graph).filter(
        t => t.flow == 'merge' || t.flow == 'branch'
      )
      for (let i = 0; i < cells.length; i++) {
        let c = cells[i]
        let f = c.flow
        let edges = c.edges
        let node = '节点'
        if (!edges || edges.length < 1) {
          this.makeErrors({
            key: c.id,
            cell: c,
            type: 0,
            message: `${node}不能独立存在`
          })
        } else {
          let x
          let w
          let message
          if (f == 'merge') {
            x = edges.findIndex(e => e.source == c)
            w =
              edges
                .filter((e, n) => n != x)
                .findIndex(e => /merge|branch/.test(e.source.flow)) > -1
            message = `${node}必须关联一个其他类型的节点`
          }
          if (f == 'branch') {
            x = edges.findIndex(e => e.target == c)
            w =
              edges
                .filter((e, n) => n != x)
                .findIndex(e => /merge|branch/.test(e.target.flow)) > -1
            message = `${node}必须被一个其他类型的节点关联`
          }
          if (x == -1) {
            this.makeErrors({ key: c.id, cell: c, type: 0, message })
          }
          if (w) {
            this.makeErrors({
              key: c.id,
              cell: c,
              type: 0,
              message: `${node}不能互联分支或合并节点`
            })
          }
          let z = edges.length < 3
          if (z) {
            message =
              cells.flow == 'branch'
                ? `${node}必须关联两个以上的其他类型节点`
                : `${node}必须被两个以上的其他类型节点关联`
            this.makeErrors({ key: c.id, cell: c, type: 0, message })
          }
        }
      }
    },
    /**
     * [校验决策节点有效性]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validConditions() {
      let conditions = FlowHelper.getConditions(this.graph)
      for (let i = 0; i < conditions.length; i++) {
        let c = conditions[i]
        if (!c.edges) {
          this.makeErrors({
            key: c.id,
            cell: c,
            type: 0,
            message: '决策节点不能独立存在'
          })
        } else {
          let t
          c.edges.forEach(e => {
            if (e.target.flow == 'start' || e.source.flow == 'start') {
              this.makeErrors({
                key: c.id,
                cell: c,
                type: 0,
                message: '节点不能关连开始节点'
              })
            }
            if (
              e.source.flow == 'condition' &&
              e.conditionExpression != 0 &&
              e.conditionExpression != 1
            ) {
              this.makeErrors({
                key: c.id,
                cell: c,
                type: 1,
                message: '请完善节点的流转规则配置'
              })
            }
          })
        }
      }
    },
    /**
     * [校验所有任务节点的有效性]
     * @return {[Boolean]} [true -> 通过校验，false -> 校验失败]
     */
    validTasks() {
      let tasks = FlowHelper.getTaskCells(this.graph)
      if (tasks.length <= 1) {
        this.makeErrors({
          key: 'task',
          cell: tasks[0],
          message: '至少包含两个任务节点'
        })
      } else {
        for (let i = 0; i < tasks.length; i++) {
          let t = tasks[i]
          const validMsg = this.validTask(tasks[i])
          validMsg.forEach(val => {
            this.makeErrors({
              key: t.id,
              cell: t,
              type: 0,
              message: val
            })
          })

          if (!this.validTaskAttr(tasks[i])) {
            this.makeErrors({
              key: t.id,
              cell: t,
              type: 0,
              message: '请检查节点的必填信息是否填写完善'
            })
          }
        }
      }
    },
    /**
     * [校验单个节点的有效性]
     * @param  {[Object]} task [mxCell实例]
     * @return {[Boolean]}      [true -> 通过校验，false -> 校验失败]
     */
    validTask(task) {
      const taskId = task.id
      const edges = task.edges || []
      const msg = []
      // 决策结点连接校验
      if (task.flow === 'condition') {
        let targetNum = 0
        let sourceNum = 0
        edges.forEach(val => {
          if (val.source.id === taskId) {
            sourceNum++
          }
          if (val.target.id === taskId) {
            targetNum++
          }
        })
        if (sourceNum !== 2) {
          msg.push('该节点必须关联两个其它节点')
        }
        if (targetNum < 1) {
          msg.push('该节点至少被一个节点关联')
        }
      }

      // 任务及子流程结点连接校验
      if (/task|robot|flow/.test(task.flow)) {
        let sourceNum = 0
        let targetNum = 0
        edges.forEach(val => {
          if (val.source.id === taskId) {
            sourceNum++
          }
          if (val.target.id === taskId) {
            targetNum++
          }
        })
        if (sourceNum > 1) {
          msg.push('该节点只能关联一个节点')
        }
        if (!sourceNum) {
          msg.push('该节点没有关联其它节点')
        }
        if (targetNum < 1) {
          msg.push('该节点至少被一个节点关联')
        }
      }
      return msg
    },
    /**
     * [校验单个任务的节点属性是否有效]
     * @param  {[Object]} cell [mxCell实例]
     * @return {[Boolean]}      [true -> 通过校验，false -> 校验失败]
     */
    validTaskAttr(cell) {
      let value = cell.value
      if (
        !this.tempTasks ||
        (!this.tempTasks['task' + cell.id] ||
          !this.tempTasks['task' + cell.id][
            /task|condition|robot/.test(cell.flow) ? 'label' : 'subFlow'
          ])
      ) {
        return false
      }
      return true
    },
    handleOk(data) {
      console.log(data)
      // 暂存更改了子流程的节点，保存时删除对应recode标记
      if (data.taskFormAtts && !data.notModify) {
        const modifySubFlowList = this.modifySubFlowList || []
        modifySubFlowList.push(this.activeCell.id)
        this.modifySubFlowList = modifySubFlowList
      }

      let showTaskForm = this.showTaskForm
      Object.assign(this, data)
      if (
        showTaskForm &&
        this.activeCell &&
        this.activeCell.flow == 'condition' &&
        this.activeCell.edges &&
        this.activeCell.edges.length > 1
      ) {
        let cell1 = this.activeCell.edges.find(
          e => e.id == data.taskFormAtts.agree
        )
        let cell2 = this.activeCell.edges.find(
          e => e.id == data.taskFormAtts.reject
        )
        FlowHelper.updateCellAttrs(
          this.graph,
          cell1,
          {
            label: '同意',
            conditionExpression: 0
          },
          true
        )
        FlowHelper.updateCellAttrs(
          this.graph,
          cell2,
          {
            label: '拒绝',
            conditionExpression: 1
          },
          true
        )
      }
      this.$api.refreshSession(null, { needToast: false }).catch(e => e)
    },
    clickTaskHandle(cell) {
      console.log(cell)
      if (!/task|condition|flow|robot/.test(cell.flow)) return
      this.activeCell = cell
      // this.taskType = cell.flow == 'task' ? 1 : cell.flow == 'condition' ? 2 : 3
      switch (cell.flow) {
        case 'task':
          this.taskType = 1
          break
        case 'condition':
          this.taskType = 2
          break
        case 'flow':
          this.taskType = 3
          break
        case 'robot':
          this.taskType = 4
          break
      }

      if (cell.flow == 'condition') {
        this.setYesNoTask(cell)
      }
      this.showTemplateForm = false
      this.showTaskForm = true
      // 新建结点缓存结点数据
      this.createTempTask(cell)

      this.taskFormAtts = { ...this.tempTasks['task' + cell.id] }
    },
    updateCellAttrs(attrs) {
      attrs = JSON.parse(JSON.stringify(attrs))
      let id = 'task' + this.activeCell.id
      // 更新属性时将执行人id转换为name进行显示
      if (attrs.assignee) {
        const executor =
          this.persons.find(val => val.id === attrs.assignee) || {}
        attrs.assigneeName = executor.name || attrs.assignee
        this.setCellStyle([this.activeCell])
      } else {
        attrs.assigneeName = ''
      }
      Object.assign(this.tempTasks[id], attrs)
      FlowHelper.updateCellAttrs(this.graph, this.activeCell, attrs)
      const executor = this.persons.find(val => val.id === attrs.assignee)
    },
    toggleSaveLoading() {
      this.saveLoading = !this.saveLoading
    },
    updateCategories(data) {
      this.categories = data
    },
    /**
     * [设置决策节点的流转节点]
     * @param {[Object]} cell [mxCell实例]
     */
    setYesNoTask(cell) {
      if (!cell.edges || cell.edges.length <= 0) {
        this.nodesYesNo = []
        return
      }
      this.nodesYesNo = cell.edges
        .filter(e => e.source == cell && e.target)
        .map(({ id, target }) => {
          return {
            id,
            name: target.flow == 'terminal' ? '结束' : this.getValue(target)
          }
        })
      let old
      if (this.tempTasks && this.tempTasks['task' + cell.id]) {
        old = this.tempTasks['task' + cell.id]
        // 编辑后更新决策节点的缓存数据
        if (!this.nodesYesNo.some(e => e.id == old.agree)) {
          old.agree = ''
        }
        if (!this.nodesYesNo.some(e => e.id == old.reject)) {
          old.reject = ''
        }
      }
    },
    getValue(target) {
      let div = document.createElement('div')
      div.innerHTML = target.value
      return div.textContent || div.innerText
    },
    validErrors() {
      let keys = Object.keys(this.cellErrors)
      if (keys.length <= 0) {
        return false
      } else {
        let message = []
        let cells = []
        let n = 1
        keys.forEach(k => {
          let err = this.cellErrors[k]
          err.forEach(e => {
            let name = ''
            if (e.cell) {
              name =
                '【' +
                (e.cell.flow == 'start'
                  ? '开始'
                  : e.cell.flow == 'terminal'
                  ? '结束'
                  : this.getValue(e.cell)) +
                '】'
            }
            message.push(n + '. ' + name + e.message)
            n += 1
            if (e.cell) {
              cells.push(e.cell)
            }
          })
        })
        this.$message.error({
          dangerouslyUseHTMLString: true,
          duration: 7000,
          message: message.join('<br/><br/>')
        })
        if (cells.length > 0) {
          this.setCellStyle(cells, '#ED4040')
          //this.graph.setSelectionCells(cells)
          let ids = cells.map(c => c.id)
          this.setCellStyle(
            FlowHelper.getCells(this.graph).filter(
              c => ids.indexOf(c.id) < 0 && c.flow
            )
          )
        }
        if (keys.length == 1 && keys[0] == 'template') {
          this.setCellStyle(FlowHelper.getCells(this.graph).filter(c => c.flow))
        }
        this.cellErrors = {}
        return true
      }
    },
    // 构造需要错误提示的数据接口
    makeErrors({ key, message, cell, type }) {
      this.cellErrors[key] = this.cellErrors[key] || []
      this.cellErrors[key].push({ message, cell, type })
    },
    setCellStyle(cells, color = '#999') {
      cells = cells || FlowHelper.getCells(this.graph).filter(c => c.flow)
      this.graph.setCellStyles('strokeColor', color, cells)
    }
  }
}
</script>
<style lang="scss" src="./flow.scss" scoped />
<style lang="scss">
.el-message-box__btns .el-button--danger {
  &:focus {
    background-color: #ed4040 !important;
  }
  &:hover {
    background: #f16666 !important;
  }
}
</style>
