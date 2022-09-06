import { getPersons } from '~/mixins'
export default {
  mixins: [getPersons],
  components: {
    'page-init': _ => import('~/components/page-init'),
    'detail-pane': _ => import('~/components/detail-pane')
  },
  data() {
    return {
      xml: '',
      message: '',
      paneType: 0,
      flowName: '',
      pageInit: true,
      code: 0,
      detail: {
        label: '',
        priority: 0,
        startTime: '',
        endTime: '',
        assignee: [],
        copyPerson: [],
        rateProgress: 0,
        description: '',
        knowledge: '',
        attachment: [],
        allAttachment: [],
        allTasks: [],
        iexecuteTasks: [],
        tags: [],
        relatedKnowledge: ''
      },
      persons: [],
      taskDefinitionKey: this.$route.params.taskDefinitionKey,
      isSub: false,
      breads: [],
      privileges: {},
      flowDetail: {},
      parentPath: {}
    }
  },
  created() {
    this.headers = {
      headers: { groupId: this.$route.params.storeId }
    }
    this.init()
  },
  watch: {
    '$route.path': function(v) {
      this.init()
    },
    'detail.attachment': function(v) {
      this.oldAttachment = v
    }
  },
  methods: {
    async init() {
      try {
        this.pageInit = true
        this.message = ''
        this.code = 0
        if (!this.$route.params.rootProcessExec) {
          let err = this.makeError('数据不存在', 404)
          throw err
        }
        await this.getPersons(null, null, -1)
        this.persons = JSON.parse(JSON.stringify(this.$persons))
        await this.getFlowPrivilege()
        await this.getFlowDetail(false)
        let promiseFn = Promise.resolve.bind(Promise)
        if (this.$route.params.taskDefinitionKey) {
          promiseFn = this.getNodeDetail
        }
        await promiseFn()
        this.code = 0
        this.message = ''
        this.detailPaneCollapse = false
      } catch (e) {
        console.error(e)
        this.message = e.message || e.msg
        this.code = e.code
      } finally {
        this.pageInit = false
      }
    },

    /**
     * 获取流程详情编辑权限
     * @return {Object} Promise实例
     */
    async getFlowPrivilege() {
      try {
        let success = ({ data }) => {
          this.privileges = data.reduce((r, o) => {
            r[o.fieldName] = o.permission
            return r
          }, {})
        }
        let fail = e => {
          throw e
        }
        await this.request(
          false,
          this.$api.flowSetting.getFlowPrivilege,
          { processInstanceId: this.$route.params.rootProcessExec },
          { needToast: false, ...this.headers },
          success,
          fail
        )
        return
      } catch (e) {
        return Promise.reject(e)
      }
    },
    /**
     * 获取流程详情接口函数
     * @return {Object} promise实例
     */
    getFlowDetail(isLoading = true) {
      return new Promise((resolve, reject) => {
        let promiseFn = this.$api.flowSetting.flowDetail
        let params = { rootProcessExec: this.$route.params.rootProcessExec }
        let headers = { needToast: false, ...this.headers }
        let success = ({ data }) => {
          this.flowJson = JSON.parse(data.flowJson)
          let id = this.$route.params.taskDefinitionKey
          if (id) {
            JSON.parse(data.flowJson).tasks.forEach(t => {
              if (id == t.id) {
                // this.paneType = t.flow == 'condition' ? 2 : 1
                const flowType = t.flow
                this.paneType =
                  flowType.indexOf('condition') > -1
                    ? 2
                    : /flow/.test(flowType)
                    ? 3
                    : 1
              } else if (t.flow == 'flow' && t.subFlow) {
                const { tasks } = t.subFlow.flowTree || {}
                tasks.map(item => {
                  if (id == item.id) {
                    const flowType = item.flow
                    this.paneType =
                      flowType.indexOf('condition') > -1
                        ? 2
                        : /flow/.test(flowType)
                        ? 3
                        : 1
                  }
                })
              }
            })
          }
          this.path = [data.label]
          if (typeof this.preParseXML == 'function') {
            this.xml = this.preParseXML(data.flowJson)
          } else {
            this.xml = data.flowJson
          }
          let dataAssignees = data.assignees || []
          this.persons = [...this.persons].concat(
            dataAssignees
              .filter(d => this.persons.findIndex(p => p.id == d.id) == -1)
              .map(v => ({
                id: (v && v.id) || '',
                pic: (v && (v.pic || v.photo)) || '',
                color: (v && v.color) || 'blue',
                name: (v && (v.name || v.realName || v.userName)) || '',
                disable: true
              }))
          )
          this.flowName = data.label
          this.flowDetail = Object.assign(this.makeNewFlowDetail(), {
            label: data.label,
            description: data.baseInfo && data.baseInfo.description,
            relatedKnowledge: data.relatedKnowledge,
            knowledge: data.knowledge,
            startTime: this.$helper.formatTime(data.startTime),
            rateProgress: data.rateProgress,
            priority: data.priority,
            assignee: this.$helper.parsePerson(data.assignees, this.persons),
            copyPerson: this.$helper.parsePerson(data.copyPerson, this.persons),
            attachment: data.attachment || [],
            endTime: this.$helper.formatTime(data.endTime),
            status: data.status,
            creator: data.creator || [],
            category: (data.category && data.category.name) || '',
            allAttachment: data.allAttachment,
            allTasks: data.allTasks,
            iexecuteTasks: data.iexecuteTasks,
            tags: Array.isArray(data.tags)
              ? data.tags.map(val => parseInt(val.id, 10))
              : []
          })
          if (!this.$route.params.taskDefinitionKey) {
            this.paneType = 0
            this.isSub = false
            this.detail = this.flowDetail
          }
          this.parseParentPath(this.flowJson)
          resolve()
        }
        let fail = e => reject(e)
        this.request(isLoading, promiseFn, params, headers, success, fail)
      })
    },
    /**
     * 更新流程详情接口函数
     * @param {Object} update   更新的{数据字段: 值}
     * @return {Object} promise 实例
     */
    updateFlowDetail(update) {
      let [filedName, filedValue] = [
        Object.keys(update)[0],
        Object.values(update)[0]
      ]
      if (filedName == 'copyPerson') {
        filedValue = filedValue.map(({ id }) => id).join(',')
      }
      if (filedName == 'tags') {
        filedValue = filedValue.join(',')
      }
      if (filedName == 'attachment') {
        filedValue = this.parseAttachmentParam(filedValue)
      }
      let promiseFn = this.$api.flowSetting.updateFlowDetail
      let params = {
        processInstanceId: this.$route.params.rootProcessExec,
        filedName,
        filedValue
      }
      if (filedName === 'attachment') {
        params.oldContent = this.parseAttachmentParam(this.oldAttachment)
      }
      let headers = this.headers
      let success = _ => {
        this.$message.success('更新成功')
        Object.assign(this.flowDetail, update)
      }
      let fail = _ => _
      this.request(true, promiseFn, params, headers, success, fail)
    },
    /**
     * 获取节点详情接口函数
     * @return {Object}                   promise实例
     */
    getNodeDetail(nodeId) {
      return new Promise((resolve, reject) => {
        if (!this.$route.params.taskDefinitionKey && !nodeId) {
          return reject(this.makeError('数据不存在', 404))
        }
        let taskDefinitionKey = this.$route.params.taskDefinitionKey || nodeId
        let promiseFn = this.$api.flowSetting.nodeDetail
        let params = {
          taskDefinitionKey,
          processExecId: this.$route.params.rootProcessExec
        }
        let headers = {
          needToast: false,
          ...this.headers
        }
        let success = async ({ data }) => {
          try {
            await this.getTaskPrivilege(data)
            data = this.parseTaskData(data)
            let valid = this.toggleCurrentDetail(
              this.returnNodeDetailCache(taskDefinitionKey, {
                loading: 1,
                data
              }),
              { id: taskDefinitionKey }
            )
            if (!valid) {
              return reject(this.makeError('数据不存在', 404))
            }
            resolve()
          } catch (e) {
            reject(e)
          }
        }
        let fail = e => reject(e)
        this.request(true, promiseFn, params, headers, success, fail)
      })
    },
    /**
     * 节点任务和子任务切换时变更当前的detail实体
     * @param  {Object} detail 当前的detail实体
     * @param  {Object} cell   mxCell的伪实例
     * @return {Boolean}       用来判断切换的实体是否有效存在，阻止通过url直接的非法访问
     */
    toggleCurrentDetail(detail, cell) {
      if (this.$route.params.index) {
        this.isSub = true
        detail = this.parseSubDetail(
          detail,
          (this.$route.params.index + '').split('-')
        )
        if (!detail) return false
        detail.flowLabel = this.flowName
        this.detail = detail
      } else {
        this.isSub = false
        detail.flowLabel = this.flowName
        this.detail = detail
      }
      this.activeCell = cell
      this.activeCellId = cell && cell.id
      this.taskDefinitionKey = cell && cell.id
      this.detailPaneCollapse = false
      if (cell && cell.style) this.$refs.graphContainer.resetCell(cell)
      return true
    },
    /**
     * 解析父任务url
     * @param  {Object} data  流程详情
     * @return {Object}
     */
    parseParentPath(data) {
      const {
        storeId,
        rootProcessExec,
        index,
        taskDefinitionKey
      } = this.$route.params
      const parentPath = {}
      if (index) {
        // 节点任务子任务
        data.tasks.forEach(item => {
          if (item.id === taskDefinitionKey) {
            parentPath.name = item.value
            parentPath.url = `/${storeId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
          } else if (item.flow === 'flow') {
            const { tasks } = item.subFlow.flowTree
            tasks.map(el => {
              if (el.id === taskDefinitionKey) {
                parentPath.name = el.value
                parentPath.url = `/${storeId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
              }
            })
          }
        })
      } else {
        parentPath.name = this.flowDetail.label
        parentPath.url = `/${storeId}/flow-detail/${rootProcessExec}`
      }
      this.parentPath = parentPath
    },
    /**
     * 根据节点详情，解析url指定的子任务详情
     * @param  {Object} detail  节点详情
     * @param  {Array}  indexs  vm.$route.params.index参数
     * @return {Object}         子任务详情
     */
    parseSubDetail(detail, indexs) {
      let result = JSON.parse(JSON.stringify(detail))
      let breads = [
        {
          url: `/${this.$route.params.storeId}/flow-detail/${this.$route.params.rootProcessExec}`,
          name: this.flowDetail.label
        },
        {
          url: `/${this.$route.params.storeId}/flow-detail/${this.$route.params.rootProcessExec}/${this.$route.params.taskDefinitionKey}`,
          name: detail.label
        }
      ]
      let joinId = ''
      while (indexs.length) {
        let tempId = indexs.shift()

        result = result.subTaskCloneList.find(
          s => s.processInstanceId == tempId || s.dataCloneId == tempId
        )
        if (indexs.length > 0) {
          joinId += '-' + tempId
          breads.push({
            url: `/${this.$route.params.storeId}/flow-detail/${
              this.$route.params.rootProcessExec
            }/${this.$route.params.taskDefinitionKey}/${joinId.slice(1)}`,
            name: result.label
          })
        }
      }
      this.breads = breads
      if (!result || typeof result != 'object') return false
      return this.parseTaskData(result)
    },
    /**
     * 接口返回的节点详情数据预处理
     * @param  {Object} data 接口返回原始数据
     * @return {Object}      符合页面渲染需要的数据
     */
    parseTaskData(data) {
      data.assignee = this.$helper.parsePerson(data.assignee, this.persons)
      data.copyPerson = this.$helper.parsePerson(data.copyPerson, this.persons)
      data.attachment = data.attachment instanceof Array ? data.attachment : []
      data.creator = data.creator ? [{ id: data.creator }] : []
      return Object.assign(this.makeNewNodeDetail(), data)
    },
    /**
     * 页面操作详情更新
     * @param  {Object} update 更新的{数据字段: 值}
     * @return {Undefined}     没有返回值
     */
    updateDetail(update) {
      if (update.comment) {
        /*决策节点审核批注更新*/
        if (update.comment instanceof Array) {
          this.detail.comment = [...this.detail.comment, ...update]
        } else {
          this.detail.comment = update.comment
        }
        return
      }
      if (update.subTaskCloneList) {
        this.detail.subTaskCloneList = update.subTaskCloneList
        return
      }
      if ('status' in update) {
        return this.updateTaskStatus(update)
      }
      if (update.check) {
        return this.init()
      }
      if (this.paneType == 0) {
        this.updateFlowDetail(update)
      } else {
        this.updateNodeDetail(update)
      }
    },
    /**
     * 更新节点详情接口函数
     * @param  {Object} update 更新的具体某个字段
     * @return {Object}        promise实例
     */
    updateNodeDetail(update) {
      let needReload = 'assignee' in update
      let promiseFn = this.$api.flowSetting.updateNodeDetail
      let params = {
        rootProcessInstanceId: this.$route.params.rootProcessExec, //主流程id
        taskDefinitionKey: this.$route.params.taskDefinitionKey //节点id
      }
      if (this.isSub) {
        promiseFn = this.$api.flowSetting.updateSubTaskDetail
        params = this.preParseSubTaskParams(params, update)
      } else {
        params = this.preParseTaskParams(
          params,
          update,
          this.loadedTaskIds[this.activeCellId].data
        )
      }
      if (params.hasOwnProperty('comment')) delete params.comment
      if (params.hasOwnProperty('status')) delete params.status
      if (params.fieldName === 'attachment') {
        params.oldContent = this.parseAttachmentParam(this.oldAttachment)
      }
      let success = _ => {
        this.$message.success('更新成功')
        if (needReload) {
          this.init()
        } else {
          if (this.isSub) {
            let subDetail = this.parseSubDetail(
              this.loadedTaskIds[this.activeCellId].data,
              this.$route.params.index.split('-')
            )
            Object.assign(subDetail, update)
          } else {
            if (update.assignee) {
              let { name, color } = update.assignee[0] || {}
              this.$refs.graphContainer &&
                this.$refs.graphContainer.setCellValue(
                  this.activeCellId,
                  name,
                  color
                )
            }
            Object.assign(this.loadedTaskIds[this.activeCellId].data, update)
          }
          Object.assign(this.detail, update)
        }
      }
      let fail = _ => _
      this.request(
        true,
        promiseFn,
        params,
        this.headers,
        success,
        fail,
        needReload
      )
    },
    /**
     * 子任任务详情更新前的入参预处理
     * @param  {Object} params 预定义的初始入参对象
     * @param  {Object} update 实际需要变更的入参对象
     * @return {Object}        最终更新接口的入参对象
     */
    preParseSubTaskParams(params, update) {
      let fieldName = Object.keys(update)[0]
      let fieldValue = Object.values(update)[0]
      if (fieldValue instanceof Array) {
        if (/copyPerson|assignee/.test(fieldName)) {
          fieldValue = fieldValue.map(c => c.id).join(',')
        }
        if (/attachment/.test(fieldName)) {
          fieldValue = this.parseAttachmentParam(fieldValue)
        }
      }
      return {
        ...params,
        processInstanceId: this.$route.params.index.split('-').slice(-1)[0],
        fieldName, //编辑的字段名
        fieldValue //编辑的字段值
      }
    },
    /**
     * 节点任任务详情更新前的入参预处理
     * @param  {Object} params 预定义的初始入参对象
     * @param  {Object} update 实际需要变更的入参对象
     * @param  {Object} detail 节点任务详情的缓存副本
     * @return {Object}        最终更新接口的入参对象
     */
    preParseTaskParams(params, update, detail) {
      let fieldName = Object.keys(update)[0]
      let fieldValue = Object.values(update)[0]
      let processType = this.paneType * 2 // paneType = 1-> 普通节点任务，2 -> 决策任务
      if (fieldValue instanceof Array) {
        if (/copyPerson|assignee/.test(fieldName)) {
          fieldValue = fieldValue.map(c => c.id).join(',')
        }
        if (/attachment/.test(fieldName)) {
          fieldValue = this.parseAttachmentParam(fieldValue)
        }
      }
      params = {
        ...params,
        processInstanceId: detail.processExecId,
        fieldName, //编辑的字段名
        fieldValue, //编辑的字段值
        processType
      }
      return params
    },
    /**
     * 创建一份独立的流程详情新数据格式，防止对象引用值修改干扰
     * @return {Object} 详情里各数据字段原始值定义
     */
    makeNewFlowDetail() {
      return {
        label: '',
        description: '',
        knowledge: '',
        startTime: '',
        endTime: '',
        rateProgress: 0,
        priority: 0,
        copyPerson: [],
        attachment: [],
        allAttachment: [],
        allTasks: [],
        iexecuteTasks: []
      }
    },
    /**
     * 创建一份独立的节点或子任务的详情新数据格式，防止对象引用值修改干扰
     * @return {Object} 详情里各数据字段原始值定义
     */
    makeNewNodeDetail() {
      let task = {
        processExecId: null,
        subTaskCloneList: []
      }
      let share = {
        label: '',
        status: null,
        assignee: [],
        startTime: null,
        endTime: null,
        copyPerson: [],
        description: '',
        // tools: '',
        knowledge: '',
        priority: 0,
        attachment: [],
        allAttachment: [],
        allTasks: [],
        iexecuteTasks: []
        // annotion: null, 批注
        // state: null 任务动态
      }
      return this.$route.params.index ? share : { ...task, ...share }
    },
    /**
     * 返回一份本地缓存的接口数据，方便任务节点来回切换详情
     * @param  {String|Number} id     任务节点id
     * @param  {Object} update        变更的数据
     * @return {Object}               节点详情副本
     */
    returnNodeDetailCache(id, update) {
      if (!this.loadedTaskIds) {
        this.loadedTaskIds = {}
        this.loadedTaskIds[id] = { loading: 0 }
      } else {
        if (!this.loadedTaskIds[id] || this.loadedTaskIds[id].loading != 1) {
          this.loadedTaskIds[id] = { loading: 0 }
        }
      }
      if (update && typeof update == 'object') {
        this.loadedTaskIds[id] = Object.assign(
          this.loadedTaskIds[id] || {},
          update
        )
      }
      return this.loadedTaskIds[id].data
    },
    /**
     * 更新任务状态函数
     * @param  {Object} update {status: 0|1|2|3...}
     * @return {Undefined}
     */
    updateTaskStatus(update) {
      let promiseFn = this.$api.flowSetting.updateTaskStatus
      let params = {
        processExecId: this.loadedTaskIds[this.activeCellId].data.processExecId
      }
      if (this.isSub) {
        params.processExecId = this.$route.params.index.split('-').slice(-1)[0]
      }
      params = Object.assign(update, params)
      let success = _ => {
        this.$message.success('更新成功')
        this.init()
      }
      let fail = _ => _
      this.request(true, promiseFn, params, this.headers, success, fail, true)
    },
    /**
     * 构造错误实例函数
     * @param  {String} msg  消息文本
     * @param  {Number} code 消息码
     * @return {Object}       Error实例
     */
    makeError(msg, code) {
      let err = new Error(msg || '未知异常')
      if (code) {
        err.code = code
      }
      return err
    },
    /**
     * 附件编辑入参预处理函数
     * @param  {Object} v 编辑的数据
     * @return {String}   附件入参处理后的格式
     */
    parseAttachmentParam(v) {
      return JSON.stringify(
        v.map(({ url, name }) => ({
          url,
          name
        }))
      )
    },
    /**
     * 获取任务详情编辑权限（含子任务）
     * @param  {Object} taskData 任务详情副本
     * @return {Object}          Promise实例
     */
    async getTaskPrivilege(taskData) {
      try {
        let params = {
          taskDefinitionKey: this.$route.params.taskDefinitionKey
        }
        let processInstanceId
        if (this.$route.params.index !== undefined) {
          params.type = 3
          let index = this.$route.params.index.split('-').slice(-1)[0]
          let subTask = taskData.subTaskCloneList.find(
            s => index == (s.processInstanceId || s.dataCloneId)
          )
          if (subTask) {
            if (subTask.processInstanceId) {
              params.processInstanceId = subTask.processInstanceId
            } else {
              params.dataCloneId = subTask.dataCloneId
            }
          }
        } else {
          params.type = 2
          params.processInstanceId =
            taskData.processExecId || this.$route.params.rootProcessExec
        }
        let success = ({ data }) => {
          this.privileges = data.reduce((r, o) => {
            r[o.fieldName] = o.permission
            return r
          }, {})
        }
        let fail = e => {
          throw e
        }
        await this.request(
          true,
          this.$api.flowSetting.getTaskPrivilege,
          params,
          { needToast: false, ...this.headers },
          success,
          fail
        )
        return
      } catch (e) {
        return Promise.reject(e)
      }
    },
    /**
     * 请求抽象函数
     * @param  {Boolean}  needLoading 是否需要loading遮罩
     * @param  {Function} promiseFn   具体接口函数
     * @param  {Object}   params      接口入参
     * @param  {Object}   headers     请求头
     * @param  {Function} success     接口成功回调
     * @param  {Function} fail        接口失败回调
     * @param  {Boolean}  keepLoading 接口成功后是否需要保持loading遮罩
     * @return {Object}               Promise实例
     */
    async request(
      needLoading,
      promiseFn,
      params,
      headers,
      success,
      fail,
      keepLoading
    ) {
      let loadingInstance
      if (needLoading) {
        // this.pageInit = true
        loadingInstance = this.$loading({ background: 'transparent' })
      }
      try {
        let res = await promiseFn(params, headers)
        if (!keepLoading) {
          // this.pageInit = false
          loadingInstance && loadingInstance.close()
        }
        typeof success == 'function' && success(res)
      } catch (e) {
        // this.pageInit = false
        loadingInstance && loadingInstance.close()
        typeof fail == 'function' && fail(e)
      }
    }
  }
}
