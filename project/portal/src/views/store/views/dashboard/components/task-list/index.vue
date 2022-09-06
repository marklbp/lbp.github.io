<template>
  <div class="list-wrap">
    <el-tabs @tab-click="handleTabClick" v-model="activeName" class="tabs">
      <el-tab-pane label="我的任务" name="task">
        <page-init :loading="loading" :message="message">
          <div class="list-container">
            <div
              class="task-list"
              v-for="(item, i) in taskList"
              :key="i"
              @click="clickTaskHandler(item)"
              :class="{
                'task-delay':
                  +item.status !== 2 &&
                  item.endTime &&
                  item.endTime < window.portalTime,
                'task-paush': parseInt(item.status, 10) === 3,
                'task-finish': parseInt(item.status, 10) === 2,
                'task-notstart': parseInt(item.status, 10) === 0
              }"
            >
              <p class="task-title">
                <overflow-tip class="title-text" :words="item.label">
                </overflow-tip>
                <span
                  class="task-status"
                  v-if="parseInt(item.status, 10) !== 0"
                  >{{ item.status | parseTaskStatus }}</span
                >
                <span class="task-status" v-else>待处理</span>
              </p>
              <div
                style="display:flex;color:#999;width:100%;"
                v-if="item.processLabel"
              >
                <span
                  class="font-icon framework"
                  style="margin-right:8px;"
                ></span>
                <overflow-tip
                  class="task-desc"
                  :words="item.processLabel"
                ></overflow-tip>
              </div>
              <p
                class="task-time ellipsis-end-line"
                v-if="item.startTime || item.endTime"
              >
                {{ item.startTime | formatTime }} 至
                {{ item.endTime | formatTime }}
              </p>
              <div class="realName">
                {{ item.assignee.realName }}
              </div>
            </div>
          </div>
          <p class="btn">
            <a href="javascript:;" @click="toTaskPage">全部 ></a>
          </p>
        </page-init>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import pageInit from '~/components/page-init'
import overflowTip from '~/components/overflow-tip'
export default {
  data() {
    this.window = window
    return {
      activeName: '', // tab: process, task
      processList: [],
      taskList: [],
      loading: false,
      message: ''
    }
  },
  watch: {
    activeName(newv) {
      if (newv === 'process') {
        this.fetchProcessData()
      } else if (newv === 'task') {
        this.getTaskList()
      }
    }
  },
  props: ['type'],
  components: {
    pageInit: _ => import('~/components/page-init'),
    overflowTip: _ => import('~/components/overflow-tip')
  },
  filters: {
    parseFlowStatus(status) {
      return Vue.prototype.$constant.FLOW_STATUS.find(({ id }) => id == status)
        .name
    },
    parseTaskStatus(status) {
      return Vue.prototype.$constant.TASK_STATUS.find(({ id }) => id == status)
        .name
    }
  },
  created() {
    this.activeName = 'task'
  },
  methods: {
    async getTaskList() {
      this.loading = true
      this.code = 0
      const { queryTaskList } = this.$api.myTask
      const params = {
        currentPage: 1,
        total: 0,
        pageSize: 5,
        searchType: '0',
        isHideFile: '1'
      }
      try {
        const res = await queryTaskList(params, {
          headers: {
            groupId: this.$route.params.storeId
          }
        })
        const { records } = res.data
        this.taskList = records.filter(item => item.status === 0).slice(0, 5)
        if (!records || records.length == 0) {
          this.message = '暂无数据'
        } else {
          this.message = ''
        }
      } catch (err) {
        console.error(err)
        this.message = err.msg || err.message
        this.code = err.code
      } finally {
        this.loading = false
      }
    },
    handleTabClick(tab) {
      const { name } = tab
      this.activeName = name
    },
    clickProcessHandler(item) {
      const path = `/${this.$route.params.storeId}/flow-detail/${item.rootProcessExec}`
      this.$router.push(path)
    },
    clickTaskHandler(item) {
      let url
      const {
        taskDefinitionKey,
        rootProcessExec,
        id: processExecId,
        instanceTag,
        subTaskType,
        groupId
      } = item
      if (instanceTag == 1 || (instanceTag == 3 && subTaskType == 1)) {
        // 独立任务和独立任务的子任务
        url = `/${groupId}/task-detail/${processExecId}`
      } else if (instanceTag == 2 || instanceTag == 4) {
        // 流程任务
        url = `/${groupId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
      } else if (instanceTag == 3 && subTaskType == 2) {
        // 流程节点的子任务
        url = `/${groupId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}/${processExecId}`
      }
      this.$router.push(url)
    },
    toProcessPage() {
      const path = `/${this.$route.params.storeId}/task?taskTab=2&view=process`
      this.$router.push(path)
    },
    toTaskPage() {
      const path = `/${this.$route.params.storeId}/task?myTab=0&taskTab=0&view=task`
      this.$router.push(path)
    },
    fetchProcessData(params) {
      this.loading = true
      const paramsCommon = {
        type: 4,
        pageSize: 5,
        currentPage: 1,
        groupId: this.$route.params.storeId,
        status: -1,
        label: ''
      }
      Object.assign(paramsCommon, params)
      this.$api.processList
        .get(paramsCommon, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
        .then(({ data: { records } }) => {
          this.processList = records
          this.loading = false
          if (this.processList.length) {
            this.message = ''
          } else {
            this.message = '暂无数据'
          }
        })
        .catch(err => {
          this.loading = false
          this.message = err.msg || err.message
        })
    },
    fetchTaskData(params) {
      this.loading = true
      const paramsCommon = {}
      Object.assign(paramsCommon, params)
      this.$api.storeTask
        .getStoreTaskByPage(paramsCommon, {
          needToast: false,
          headers: {
            groupId: this.$route.params.storeId
          }
        })
        .then(({ data = [] }) => {
          this.taskList = data
          this.loading = false
          if (this.taskList.length) {
            this.message = ''
          } else {
            this.message = '暂无数据'
          }
        })
        .catch(err => {
          this.loading = false
          this.message = err.msg || err.message
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-wrap {
  background: white;
  height: 633px;
  /deep/ {
    .el-tabs__header {
      margin-bottom: 0px;
      height: 55px;
      box-sizing: border-box;
    }
    .el-tabs__item {
      opacity: rgba(51, 51, 51, 0.5);
      font-weight: bold;
      height: 54px;
      line-height: 54px;
      opacity: 0.5;
      color: #333;
      &.is-active {
        opacity: 1;
      }
    }
    .el-tabs__nav {
      margin-left: 32px;
    }
    .el-tabs__active-bar {
      height: 4px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
}
.list-container {
  height: 528px;
  box-sizing: border-box;
  padding: 15px 24px 0;
  overflow: auto;
}
// 滚动条设置
::-webkit-scrollbar {
  width: 6px; //y轴上的滚动条宽度
  height: 6px; //x轴上滚动条高度
}
::-webkit-scrollbar-track {
  border-radius: 3px; /*滚动条的背景区域的圆角*/
  background-color: #fdf8f5; /*滚动条的背景颜色*/
}
::-webkit-scrollbar-thumb {
  border-radius: 3px; /*滚动条的圆角*/
  background-color: rgba(0, 0, 0, 0.3); /*滚动条的背景颜色*/
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

::-webkit-scrollbar-thumb:active {
  // background-color: rgb(4  6, 86, 159);
  cursor: pointer;
}

.tabs {
  margin-bottom: 22px;
}
.process-list {
  height: 76px;
  display: flex;
  justify-content: center;
  // align-items: center;
  flex-direction: column;
  padding: 0 16px;
  border: 1px solid #d9d9d9ff;
  margin-bottom: 8px;
  cursor: pointer;
  &:last-of-type {
    margin-bottom: 0px;
  }
}
.process-title {
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > .title-words {
    font-size: 14px;
    color: #333;
    margin: 0;
    flex: 1;
    margin-right: 10px;
    // max-width: 160px;
  }
  > p {
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    padding: 0 8px;
    margin: 0;
    background: #3366ff1a;
    border-radius: 80px;
    color: #3366ffff;
    flex-shrink: 0;
  }
}
.process-time {
  font-size: 12px;
  color: #999999ff;
  margin: 0;
  padding: 0 3px;
  border-radius: 2px;
  align-self: flex-start;
}
.process-finish {
  opacity: 0.5;
}
.process-paush {
  opacity: 0.5;
  .process-title {
    > p {
      color: #999999ff;
      background: #ababab2e;
    }
  }
}
.process-notstart {
  .process-title {
    > p {
      color: #999999ff;
      background: #ababab2e;
    }
  }
}
.process-delay {
  .process-time {
    background: #ed4040ff;
    color: white;
  }
  .process-title {
    > p {
      color: #ed4040ff;
      background: #ed40401a;
    }
  }
}

.task-finish {
  opacity: 0.5;
}
.task-paush {
  opacity: 0.5;
  .task-title > .task-status {
    color: #999999ff;
    background: #ababab2e;
  }
}
.task-notstart {
  .task-title > .task-status {
    color: #999999ff;
    background: #ababab2e;
  }
}
.task-delay {
  .task-time {
    color: white;
    background: #ed4040ff;
  }
  .task-title > .task-status {
    color: #ed4040ff;
    background: #ed40401a;
  }
}
.btn {
  height: 48px;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
  line-height: 48px;
  text-align: right;
  color: #3366ffff;
  font-size: 14px;
  margin: 0;
  padding: 0 24px;
  > a {
    float: right;
  }
}
.task-list {
  // width:227px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 10px 16px;
  border: 1px solid #d9d9d9ff;
  font-size: 12px;
  cursor: pointer;
  &:last-of-type {
    margin: 0;
  }
  box-sizing: border-box;
}
.task-title {
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  > .title-text {
    font-size: 14px;
    color: #333;
    line-height: 21px;
    height: 21px;
    font-weight: bold;
    padding-right: 10px;
  }
  > .task-status {
    color: #3366ffff;
    white-space: nowrap;
    background: #3366ff1a;
    border-radius: 50px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 24px;
  }
}

.task-desc {
  margin: 0;
  line-height: 18px;
  height: 18px;
  margin-bottom: 8px;
  flex: 1;
}
.task-time {
  margin: 0;
  display: inline-block;
  padding: 0 3px;
  border-radius: 2px;
  line-height: 16px;
  color: #999;
  margin-bottom: 7px;
  max-width: 220px;
}
.realName {
  color: #666666;
  font-size: 12px;
  padding-top: 5px;
}
/deep/ {
  .el-tabs__nav-scroll {
    height: 56px;
  }
  .el-tabs__active-bar {
    opacity: 0;
  }
  .el-tabs__item {
    cursor: auto;
  }
}
</style>
