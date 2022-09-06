import TaskEnclosure from './taskEnclosure'
import TaskMessage from './taskMessage'
import RouterBack from '~/components/router-back'
import { priorityObj, cyclicalObj } from './config'
import { bus } from '~/utils/bus'
import { formatTime } from '~/utils/index'
import Peoples from '~/components/peoples'
import { getPersons } from '~/mixins'
import peoplesSelect from '~/components/peoples-select'
import RossRepeat from '~/ross-components/ross-repeat'
import RossRemind from '~/ross-components/ross-remind'
import RossTimeRange from '~/ross-components/ross-time-range'

// const statusMap = [
//   [[1, 2, 3], [2, 3], [], [0, 1, 2]],
//   [[1, 2, 3], [2, 3], [], [0, 1, 2]],
//   []
// ]
const statusMap = [
  [[2, 4], [2, 4], [], [2, 4], []],
  [[2, 4], [2, 4], [], [2, 4], []],
  []
]
export default {
  name: 'task',
  components: {
    // TaskDetailActive,
    TaskEnclosure,
    TaskMessage,
    RouterBack,
    Peoples,
    peoplesSelect,
    RossRepeat,
    RossRemind,
    RossTimeRange,
    operationLog: () => import('~/components/operation-log'),
    rossTag: _ => import('~/ross-components/ross-tag')
  },
  mixins: [getPersons],
  provide() {
    // 给子组件共享groupId、processExecId
    const { storeId: groupId, processExecId } = this.$route.params
    this.processExecId = processExecId
    this.groupId = groupId
    return {
      processExecId: this.processExecId,
      grandInstance: this,
      groupId
    }
  },
  data() {
    const that = this
    return {
      originalPersons: [], // 全部员工源数据
      personsDataList: [], // 全部员工数据
      finishFetch: false, // 是否获取完当前任务数据
      activeName: 'first',
      loadLog: false, // 是否加载日志
      priorityObj,
      cyclicalObj,
      textVisible: false,
      loadingVisible: false,
      processExecId: '',
      labelText: '',
      taskFiles: [],
      permission: [],
      taskData: {
        assignee: {},
        copyPerson: [],
        fileDtos: [],
        baseInfoRes: {}
      },
      ccList: [],
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      defaultStartTime: '00:00:00',
      defaultEndTime: '23:59:59'
    }
  },
  methods: {
    async toggleTextEdit() {
      this.textVisible = !this.textVisible
      if (!this.textVisible && this.taskData.label !== this.labelText) {
        const res = await this.updateTaskField('label', this.labelText)
        if (res) {
          this.taskData.label = this.labelText
        } else {
          this.labelText = this.taskData.label
        }
      }
    },
    async cancelTask() {
      const { cancleProcess } = this.$api.myTask
      this.loadingVisible = true
      cancleProcess({ processInstanceId: this.processExecId }, this.httpConfig)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getDetail()
        })
        .catch(err => {
          console.log(err)
          this.loadingVisible = false
        })
    },
    async handleChangeStatus(status) {
      if (status == 4) return this.cancelTask()
      try {
        this.loadingVisible = true
        const params = {
          processExecId: this.processExecId,
          status
        }
        const { changeStatus } = this.$api.myTask
        await changeStatus.query(params, this.httpConfig)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.taskData.status = status
        this.getDetail()
      } catch (err) {
        this.loadingVisible = false
      }
    },
    handleClick(tab, event) {},
    // 处理更改紧急度
    handleCommand(command) {
      const result = this.updateTaskField('priority', command)
      result && this.$set(this.taskData, 'priority', command)
    },
    // 重复周期
    handleCyclical(command) {
      const result = this.updateCyclicalField('cyclical', command)
      result && this.$set(this.taskData, 'cyclical', command)
    },
    // 处理更改时间
    handleStartTimeDateChange(val) {
      this.updateTaskField('startTime', val || '')
    },
    // 处理更改时间
    handleEndTimeDateChange(val) {
      this.updateTaskField('endTime', val || '')
    },
    // 处理更改时间
    handleRemindTimeDateChange(value) {
      this.updateTaskField('remindTime', value || '')
    },
    // 更新请求前的处理
    async handleFieldUpdate({ fieldName, fieldValue }) {
      const { baseInfoRes } = this.taskData
      switch (fieldName) {
        case 'description':
        case 'tools':
          if ((this.taskData.baseInfoRes || {}).description !== fieldValue) {
            const res = await this.updateTaskField(fieldName, fieldValue)
            if (res) {
              if (!this.taskData.baseInfoRes) {
                this.taskData.baseInfoRes = {}
              }
              this.$set(this.taskData.baseInfoRes, fieldName, fieldValue)
            }
          }
          break
        case 'fileDtos':
          await this.updateTaskField('attachment', JSON.stringify(fieldValue))
          this.taskData.fileDtos = fieldValue
          this.taskFiles = fieldValue
          break
        case 'baseInfoRes.subTaskDtos':
          // baseInfoRes 可能为null
          const info = !baseInfoRes ? {} : { ...baseInfoRes }
          info.subTaskDtos = fieldValue
          this.$set(this.taskData, 'baseInfoRes', info)
          break
        case 'tags':
          const value = (fieldValue || []).join(',')
          const res = await this.updateTaskField(fieldName, value)
          if (res) {
            this.taskData.tags = this.currentChangeSelecteds
          }
          break
        default:
          break
      }
    },
    // 更新请求
    async updateTaskField(fieldName, fieldValue) {
      const loadingInstance = this.$loading({ background: 'transparent' })
      try {
        const { updateTask } = this.$api.taskDetail
        const params = {
          fieldName,
          fieldValue,
          groupId: this.groupId,
          processInstanceId: this.processExecId,
          formLayerId: this.taskData.formLayerId,
          processType: this.taskData.processType
          // cyclical: this.taskData.cyclical || 'once'
        }
        if (fieldName === 'attachment') {
          params.oldContent = JSON.stringify(this.oldAttachment)
        }
        await updateTask(params, this.httpConfig)
        this.$message.success('更新成功')
        this.taskDataCache[fieldName] = fieldValue
        if (fieldName === 'copyPerson') {
          return
        }
        if (fieldName !== 'tags') {
          this.taskData[fieldName] = fieldValue
        }
        return true
      } catch (err) {
        if (fieldName !== 'tags') {
          this.taskData[fieldName] = this.taskDataCache[fieldName]
        }
        console.error(err)
        return false
      } finally {
        loadingInstance.close()
      }
    },
    // 周期任务更新请求
    async updateCyclicalField(fieldName, fieldValue) {
      const loadingInstance = this.$loading({ background: 'transparent' })
      try {
        const { updateCyclical } = this.$api.taskDetail
        const params = {
          fieldName,
          fieldValue,
          groupId: this.groupId,
          processInstanceId: this.processExecId,
          cyclical: fieldValue
        }
        await updateCyclical(params, this.httpConfig)
        this.$message.success('更新成功')
        return true
      } catch (err) {
        console.error(err)
        return false
      } finally {
        loadingInstance.close()
      }
    },
    // 获取任务详情
    async getDetail(isLoading) {
      this.loadingVisible = !isLoading
      try {
        const params = { processExecId: this.processExecId }
        const { records } = await this.getPersons()
        this.personsDataList = this.$persons
        const { data } = await this.$api.taskDetail.getDetail(
          params,
          this.httpConfig
        )
        let { fileDtos } = data
        // 兼容重复周期任务附件filDtos: [null] 的情况
        fileDtos = fileDtos && fileDtos[0] ? fileDtos : []

        const assignee = data.assignee || {}
        this.taskData = { ...data, fileDtos }
        this.taskDataCache = { ...data, fileDtos }
        this.originalPersons = records
        this.taskFiles = fileDtos
        await this.getDetailAuth(this.taskData.parent)
        // 获取员工数据
        this.ccList = this.transformPersonData(
          this.personsDataList,
          this.seledSends,
          true
        )
      } catch (err) {
        console.error(err)
      } finally {
        this.finishFetch = true
        this.loadingVisible = false
      }
    },
    // 获取权限
    async getDetailAuth(isSub) {
      try {
        const { getDetailAuth } = this.$api.taskDetail
        const params = {
          processInstanceId: this.processExecId,
          type: isSub ? 3 : 1
        }
        const res = await getDetailAuth(params, this.httpConfig)
        this.permission = res.data || []
      } catch (err) {
        console.error(err)
      }
    },
    // 转换人员选项数据， 为了加个选中态..
    transformPersonData(originalData = [], selectedData = [], type) {
      return originalData.map(oItem => {
        const hasPerson = selectedData.find(sItem => sItem.id === oItem.id)
        return {
          id: oItem.id,
          name: oItem.name,
          color: oItem.color,
          active: !!hasPerson,
          disable: !this.getAuthByAction('edit') && !!hasPerson && type
        }
      })
    },
    handleTagChange(vals, selecteds) {
      this.currentChangeSelecteds = selecteds
      this.tags = vals
    },
    getAuthByAction(action, type) {
      const actions = this.auths[action]
      if (actions) {
        return actions[type]
      }
      return false
    }
  },
  computed: {
    // 状态文案
    statusText() {
      const status = this.taskData.status || 0
      const itemStatus = this.$constant.TASK_STATUS.find(v => v.id == status)
      return itemStatus.name
    },
    // 面包屑父级
    parentPath() {
      const subPath = `task-detail${this.isMessageRoute ? '-message' : ''}`
      const { info } = this.$route.query
      let path = `/${this.groupId}/${subPath}/${
        (this.taskData.parent || {}).processExecId
      }`
      return path
    },
    // 紧急程度文案
    priorityText() {
      return this.priorityObj[this.taskData.priority || 0]
    },
    // 时间格式
    endTimeText() {
      const timeStamp = this.taskData.endTime
      return timeStamp && formatTime(timeStamp)
    },
    startTimeText() {
      const timeStamp = this.taskData.startTime
      return timeStamp && formatTime(timeStamp)
    },
    tags: {
      get() {
        return (this.taskData.tags || []).map(item => item.id)
      },
      set(v) {
        this.handleFieldUpdate({ fieldName: 'tags', fieldValue: v })
      }
    },
    // 抄送人
    seledSends: {
      get() {
        return (this.taskData.copyPerson || []).map(item => {
          return {
            name: item.realName,
            color: item.color,
            id: item.id,
            pic: ''
          }
        })
      },
      set(v) {
        const selected =
          this.originalPersons.filter(item => {
            const b = v.find(vItem => {
              return vItem.id == item.id
            })
            return b
          }) || {}
        const selectedId = selected.map(s => s.id).join(',')
        this.taskData.copyPerson = selected
        this.updateTaskField('copyPerson', selectedId)
      }
    },
    // 执行人
    executor: {
      get() {
        const assignee = this.taskData.assignee || {}
        return [
          {
            name: assignee.realName || '',
            color: assignee.color || '',
            id: assignee.id
          }
        ]
      },
      async set(v) {
        const item =
          this.originalPersons.find(item => {
            return item.id === v[0].id
          }) || {}
        const id = v[0].id
        this.taskData.assignee = item
        await this.updateTaskField('assignee', v[0].id)
        this.getDetail(true)
      }
    },
    auths() {
      const authsObj = {}
      for (const p of this.permission) {
        authsObj[p.fieldName] = p.permission
      }
      return authsObj
    },
    // 状态集合
    statusList() {
      const { status, taskRole } = this.taskData
      return status !== undefined && taskRole !== -1
        ? statusMap[taskRole][status]
        : []
    },
    isMessageRoute() {
      const { path } = this.$route
      return /task\-detail\-message/g.test(path)
    },
    // 顶层任务id
    rootId() {
      let target = this.taskData
      while (target.parent) {
        target = target.parent
      }
      return target.processExecId
    },
    // 独立任务id
    processInstanceId() {
      return this.$route.params.processExecId
    }
  },
  watch: {
    'taskData.label': function(v, ov) {
      this.labelText = v
    },
    $route: function(v, ov) {
      this.processExecId = v.params.processExecId
      this.getDetail()
    },
    'taskData.fileDtos': function(v) {
      this.oldAttachment = v
    }
  },
  async created() {
    this.httpConfig = {
      headers: {
        groupId: this.groupId
      }
    }
    await this.getDetail()
  }
}
