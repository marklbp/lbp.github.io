<template>
  <div class="process-card">
    <div
      class="process-bar"
      @click.stop="toggle"
      :class="{
        'finished-flow': +processData.status === 2,
        'delay-flow': processData.isOverdue,
        'cancle-flow': +processData.status === 4
      }"
    >
      <!-- <span class="font-icon icon-down"></span> -->
      <div class="left">
        <span
          class="font-icon"
          :class="!processData.visibleSub ? 'single-right' : 'icon-down'"
        ></span>
        <span class="label" @click="toProcessDetail" style="cursor:pointer;">{{
          processData.label
        }}</span>
        <span
          class="priority"
          :style="{
            color:
              processData.priority && processData.priority != 0
                ? '#ed4040'
                : null
          }"
          >{{ convertPriority(processData.priority) }}</span
        >
        <span class="time" v-if="processData.startTime || processData.endTime">
          <span v-if="processData.startTime">
            {{ processData.startTime | formatTime('y-M-d') }} 至
          </span>
          <span v-else>截至：</span>
          {{ processData.endTime | formatTime('y-M-d') }}</span
        >
        <span class="status-bar" :class="statusClass(processData.status)">{{
          statusText(processData.status)
        }}</span>
        <processFinish :rate="processData.rateProgress" v-if="false" />
      </div>
      <div class="right">
        <span class="creator">
          由
          <span class="blue-text">{{ creatorText(processData.creator) }}</span>
          创建
        </span>
        <el-dropdown @command="commandHandler">
          <span class="el-dropdown-link" @click.stop>
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="cancle"
              :disabled="
                !isCreator(processData.creator) ||
                  (processData.status != 1 && processData.status != 3)
              "
              >取消</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <ross-tag
        class="tags"
        v-if="processData.tags && processData.tags.length"
        :value="(processData.tags || []).map(val => val.id)"
        :processId="processData.rootProcessExec"
        isEdit
        :canEdit="false"
      />
    </div>
    <div class="process-sub-task" v-show="processData.visibleSub">
      <taskCard
        viewType="process"
        v-for="(task, i) in processData.taskListQueryRes"
        :task="task"
        @changeStatus="updateList"
        :key="i"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'process-card',
  components: {
    processFinish: _ => import('~/components/progress-finish'),
    taskCard: _ => import('~/components/task-list/task-card'),
    'ross-tag': _ => import('~/ross-components/ross-tag')
  },
  props: {
    processData: {
      type: Object,
      default: _ => ({})
    }
  },
  data() {
    return {}
  },
  methods: {
    cancleTask() {
      return this.$api.myTask.cancleProcess(
        {
          processInstanceId: this.processData.rootProcessExec
        },
        {
          headers: {
            groupId: this.$route.params.storeId
          }
        }
      )
    },
    isCreator(item) {
      const userInfo = this.$cache.get('USER_INFO')
      if (userInfo.id === item.id) {
        return true
      }
      return false
    },
    toggle() {
      // this.processData.visibleSub = !this.processData.visibleSub
      this.$set(this.processData, 'visibleSub', !this.processData.visibleSub)
    },
    statusText(statusCode) {
      const result = this.$constant.FLOW_STATUS.find(
        item => statusCode == item.id
      )
      return result ? result.name : '待处理'
    },
    statusClass(statusCode) {
      return ['padding', 'processing', 'done', '', 'cancel'][statusCode]
    },
    convertPriority(num) {
      return (this.$constant.PRIORITIES.find(val => val.id == +num) || {}).name
    },
    updateList() {
      this.$emit('updateProcessList')
    },
    async commandHandler(e) {
      const loadingIns = this.$loading({
        target: '#process-list',
        fullscreen: false
      })
      try {
        if (e === 'cancle') {
          await this.cancleTask()
          this.$message.success('取消成功')
          this.$emit('updateProcessList')
        }
      } catch (err) {
        console.log(err)
      } finally {
        loadingIns.close()
      }
    },
    toProcessDetail() {
      this.$router.push(
        `/${this.$route.params.storeId}/flow-detail/${
          this.processData.rootProcessExec
        }`
      )
    },
    // 创建人文案处理
    creatorText(creator) {
      const userInfo = this.$cache.get('USER_INFO')
      if (userInfo && userInfo.id) {
        return creator.id == userInfo.id ? '我' : creator.realName
      }
      return creator.realName
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin hover() {
  &:hover {
    color: $--color-primary;
  }
}

.process-card {
  // display: flex;
  // align-items: center;
  background: #fff;
  margin-bottom: 8px;
  .process-bar {
    // height: 56px;
    padding: 18px 0;
    align-items: center;
    padding: 18px 32px 18px 27px;
    display: flex;
    width: 100%;
    cursor: pointer;
    border-bottom: 1px solid #e8e8e8;
    justify-content: space-between;
    flex-wrap: wrap;
    .tags {
      width: 100%;
      margin-top: 10px;
      padding-left: 24px;
    }
    .left {
      font-size: 14px;
      display: flex;
      height: 100%;
      align-items: center;
      .font-icon {
        margin-right: 8px;
        color: #999;
        font-size: 12px;
        cursor: pointer;
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .label {
        color: #333333;
        font-weight: 600;
        @include hover;
      }
      .priority {
        margin: 0 24px;
      }
      .time {
        color: #999;
        padding: 0 3px;
        border-radius: 2px;
      }
      .no-progress-bar {
        border: none;
        width: 95px !important;
      }
      .status-bar {
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 12px;
        line-height: 16px;
        margin-right: 16px;
        &.done {
          background: rgba(51, 102, 255, 0.1);
          color: rgba(51, 102, 255, 0.8);
          opacity: 0.8;
        }
        &.processing {
          background: rgba(51, 102, 255, 0.1);
          color: #3366ff;
        }
        &.cancel {
          background: #f0f0f0;
          color: #999999;
        }
      }
    }
    .right {
      .creator {
        color: #999999;
        font-size: 14px;
        margin-right: 20px;
        span {
          color: #333;
        }
      }
      .el-dropdown-link {
        color: #3366ff;
      }
    }
  }
}
.finished-flow {
  opacity: 0.6;
}
.delay-flow {
  .time {
    color: white !important;
    background: #ed4040;
  }
}
.cancle-flow {
  opacity: 0.6;
  .label {
    text-decoration: line-through;
  }
}
</style>
