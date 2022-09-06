<template>
  <div class="top-notice" :class="{ 'global-notice': type === 'global' }">
    <div class="top-notice-content">
      <div class="top-notice-content-left">
        【最新待办】
      </div>
      <transition name="fade">
        <div
          class="top-notice-content-middle"
          v-if="showNoticeBox && showScroll"
          @mouseenter="enter"
          @mouseleave="leave"
        >
          <router-link :to="jumpUrl" ref="noticeBox" class="innerText">
            {{ activeItem.label }}
          </router-link>
        </div>
      </transition>

      <div class="top-notice-content-middle" v-if="!showScroll">
        <router-link v-if="list.length > 0" :to="jumpUrl" class="innerText">
          {{ activeItem.label }}
        </router-link>
        <div v-else>{{ nullData }}</div>
      </div>

      <router-link
        v-if="type === 'store'"
        class="top-notice-content-right"
        :to="`/${$route.params.storeId}/task?myTab=0&taskTab=0&view=task`"
      >
        更多待办
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'top-notice',
  components: {},
  props: {
    type: {
      type: String,
      default: 'global'
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    const activeItem = {
      label: '',
      processExecId: '0',
      assignee: '1101924',
      assigneeColor: '#Af6FFC',
      assigneeName: '',
      createDate: 1562761959000,
      endTime: '',
      instanceTag: 3,
      parentProcessExec: null,
      processLabel: null,
      rootProcessExec: null,
      status: '0',
      subTaskType: 1,
      taskDefinitionKey: null,
      updateDate: 1562761959000
    }
    if (this.type === 'global') {
      activeItem.groupId = 1
    }
    return {
      list: [],
      activeItem,
      showNoticeBox: true,
      nowText: '',
      currentNum: 0,
      speed: 1,
      timmer: null,
      nullData: ''
    }
  },
  mounted() {
    this.fetchList()
  },
  beforeDestroy() {
    clearTimeout(this.timmer)
    this.timmer = null
  },
  methods: {
    initScroll() {
      clearTimeout(this.timmer)
      this.timmer = null
      if (typeof this.$refs.noticeBox !== 'undefined' && this.list.length > 0) {
        this.changeNotice(0)
      }
    },
    async fetchList() {
      try {
        this.nullData = ''
        var detail = null
        if (this.type === 'global') {
          detail = await this.$api.globalDashboard.newestTaskForOverall()
        } else {
          detail = await this.$api.dashboard.taskListForNewestDone(null, {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          })
        }
        if (detail.success) {
          const list = detail.data ? detail.data : []
          this.list = list
          if (list.length > 1) {
            this.$nextTick(() => {
              this.initScroll()
            })
          } else if (list.length === 1) {
            this.activeItem = list[0]
          } else {
            this.nullData = '暂无待办'
          }
        }
      } catch (error) {
        console.log(error.message || error)
      }
    },
    enter() {
      this.speed = 0
    },
    leave() {
      this.speed = 1
    },
    changeNotice(num) {
      this.activeItem = this.list[num]
      this.showNoticeBox = false
      this.$nextTick(() => {
        this.showNoticeBox = true
        this.scrollToTop()
      })
    },
    scrollToTop() {
      clearTimeout(this.timmer)
      this.timmer = setTimeout(() => {
        if (this.speed) {
          // 执行滚屏
          const num = this.currentNum + 1
          const currentNum = num === this.comLimit ? 0 : num
          this.currentNum = currentNum
          this.changeNotice(currentNum)
        } else {
          // 暂停滚屏
          this.scrollToTop()
        }
      }, 2000)
    }
  },
  computed: {
    comLimit() {
      const limitNum = this.limit
      const length = this.list.length
      return limitNum > length ? length : limitNum
    },
    showScroll() {
      return this.list.length > 1
    },
    jumpUrl() {
      let url
      const {
        taskDefinitionKey,
        rootProcessExec,
        processExecId,
        instanceTag,
        subTaskType
      } = this.activeItem
      const pre =
        this.type === 'global'
          ? this.activeItem.groupId
          : this.$route.params.storeId
      if (instanceTag == 1 || (instanceTag == 3 && subTaskType == 1)) {
        // 独立任务和独立任务的子任务
        url = `/${pre}/task-detail/${processExecId}`
      } else if (instanceTag == 2 || instanceTag == 4) {
        // 流程任务
        url = `/${pre}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
      } else if (instanceTag == 3 && subTaskType == 2) {
        // 流程节点的子任务
        url = `/${pre}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}/${processExecId}`
      }
      return url
    }
  },
  watch: {
    $route(to, from) {
      this.fetchList()
    },
    '$store.state.dashboard.stopRoll'(newV, oldV) {
      if (newV && !oldV) {
        this.enter()
        return
      }
      if (oldV && !newV) {
        this.leave()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.global-notice {
  padding: 0 24px;
}
.top-notice {
  color: #333333;
  font-size: 14px;
  margin-bottom: 26px;
  @include border-box;
  &-content {
    background-color: #e9efff;
    border: 1px solid #3366ff;
    padding: 8px 24px;
    overflow: hidden;
    @include flex;
    @include border-box;
    align-items: center;
    justify-content: space-between;
    &-left {
      color: #3366ff;
      font-weight: 600;
      min-width: 90px;
      @include border-box;
    }
    &-middle {
      width: 100%;
      overflow: hidden;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @include border-box;
      .innerText {
        position: relative;
        left: 0;
        padding: 0 14px;
        display: inline-block;
        color: #333333;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    &-right {
      display: block;
      min-width: 60px;
      color: #3366ff;
      cursor: pointer;
      @include border-box;
    }
    &-right:hover {
      text-decoration: underline;
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: transform ease-in 0.2s;
      position: relative;
    }
    .fade-enter,
    .fade-leave-to {
      transform: translateY(20px);
    }
  }
}
</style>
