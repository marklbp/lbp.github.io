<template>
  <router-link
    :to="taskDetailPath"
    class="task-card"
    :class="taskStatusClass"
    :style="{ height: viewType == 'process' ? '82px' : '' }"
  >
    <div class="task-card-baseinfo">
      <!-- done -->
      <div class="left">
        <span
          v-if="task.status != 4 && task.change != 0"
          class="dot"
          :class="{ hover: task.status == 0, done: task.status == 2 }"
          @click.prevent="dotClick"
        ></span>

        <span
          class="label"
          :class="statusClass(task.status)"
          :title="task.label"
          >{{ task.label }}</span
        >
        <span
          class="task-card-time"
          v-if="viewType == 'task' && (task.endTime || task.startTime)"
        >
          <span v-if="task.startTime"
            >{{ task.startTime | formatTime('y-M-d') }} 至</span
          >
          <span v-else>截止：</span>
          {{ task.endTime | formatTime('y-M-d') }}
          <span v-if="taskStatusClass == 'dely'">逾期</span>
        </span>
        <span
          class="status-bar"
          :class="statusClass(task.status)"
          v-if="task.status !== null"
          >{{ statusText(task.status) }}</span
        >
        <span class="status-bar padding" v-if="task.status === null"
          >即将开始</span
        >
        <el-tooltip
          :content="cyclicalText"
          placement="top"
          v-if="task.cyclical && task.cyclical != 'once'"
        >
          <span class="font-icon icon-repeatx"></span>
        </el-tooltip>
        <el-tooltip
          :content="'自定义提醒：' + task.remindTime"
          placement="top"
          v-if="task.remindTime"
        >
          <span class="font-icon icon-tixingx-copy"></span>
        </el-tooltip>
      </div>
      <div class="right" v-if="viewType == 'task'">
        <router-link
          :to="parentDetailPath"
          class="parent-label"
          :title="task.rootLabel"
          v-if="task.instanceTag != 1"
          :style="task.subTaskType == 1 ? 'margin-right:16px' : ''"
        >
          <span class="font-icon framework" v-if="task.subTaskType != 1" />
          {{ task.subTaskType == 1 ? '父任务：' : '' }}
          {{ task.rootLabel }}
        </router-link>
        <span class="classify" v-if="task.subTaskType != 1 && task.category"
          >（{{ task.category }}）</span
        >
        <span v-if="task.instanceTag == 1">独立任务&nbsp;&nbsp;</span>
        由
        <span class="creator-text">{{ creatorText }}</span>
        创建
      </div>
    </div>

    <div class="executor">
      执行人：
      <span>
        {{ task.assignee && task.assignee.realName }}
        <!-- <span>;</span> -->
      </span>
    </div>
    <div class="task-card-actions">
      <div class="left">
        <div
          v-if="this.type == 'global' && task.group"
          class="group"
          :title="task.group.groupName"
        >
          <span class="font-icon icon-shop"></span>
          {{ task.group.groupName }}
        </div>
        <template v-if="task.tags">
          <span class="tag-item" v-for="item in task.tags" :key="item.id">
            <span></span>
            {{ item.name }}
          </span>
        </template>
      </div>
      <div class="right">
        <el-dropdown
          placement="bottom"
          @command="dropCommand"
          v-if="hasShowMore"
        >
          <span class="el-dropdown-link" @click.prevent>
            <span class="font-icon more-horizontal"></span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :key="1" :command="1">取消</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="overdue-bar" v-if="task.priority == 2" title="非常紧急"></div>
    <policy-modal
      :processExecId="processExecId"
      :storeId="task.groupId"
      @close="$emit('changeStatus')"
      v-model="policyModalVisible"
    />
  </router-link>
</template>

<script>
import policyModal from '~/components/policy-modal'

const cyclicalObj = {
  once: '不重复',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
  workday: '工作日'
}

export default {
  name: 'task-card',
  components: {
    policyModal
  },
  props: {
    task: {
      type: Object,
      default: _ => ({})
    },
    /**
     * task 为独立任务
     * process 为 流程任务
     */
    viewType: {
      type: String,
      default: 'task'
    },
    /**
     * global 为全局
     * 省缺 为 店铺任务
     */
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: 2,
      processExecId: '',
      policyModalVisible: false,
      userInfo: this.$cache.get('USER_INFO')
    }
  },
  // created() {},
  mounted() {},
  methods: {
    async handleStatusChange(status, processExecId) {
      if (this.task.instanceTag == 4) {
        this.processExecId = processExecId
        this.policyModalVisible = true
        return
      }
      const Loading = this.$loading({
        background: 'transparent'
      })
      try {
        const { changeStatus } = this.$api.myTask
        const params = {
          processExecId,
          status
        }
        await changeStatus.query(params, {
          headers: {
            groupId: this.task.groupId
          }
        })
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('changeStatus')
      } catch (error) {
        console.error(error)
      } finally {
        Loading.close()
      }
    },
    dotClick() {
      if (this.task.status == 2 || this.task.status == 4) return
      this.handleStatusChange(2, this.task.id)
    },
    policyHandler(processExecId) {
      this.processExecId = processExecId
      this.policyModalVisible = true
    },
    dropCommand(command) {
      if (command == 1) {
        this.cancelTask_mixin(this.task.id, this.task.groupId)
      }
    },
    statusText(statusCode) {
      const result = this.$constant.TASK_STATUS.find(
        item => statusCode == item.id
      )
      return result ? result.name : '待处理'
    },
    statusClass(statusCode) {
      return ['padding', 'processing', 'done', 'suspend', 'cancel'][statusCode]
    },
    cancelTask_mixin(processInstanceId, groupId) {
      this.$confirm('确认取消该任务？', '提示', {
        confirmButtonText: '确定取消',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({
            background: 'rgba(0, 0, 0, 0.0)'
          })
          const { cancleProcess } = this.$api.myTask
          const httpConfig = {
            headers: {
              groupId
            }
          }
          cancleProcess({ processInstanceId }, httpConfig)
            .then(() => {
              this.$emit('changeStatus')
              loading.close()
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
            .catch(() => {
              loading.close()
            })
        })
        .catch(() => {})
    }
  },
  computed: {
    // 创建人文案处理
    creatorText() {
      const { creator } = this.task
      if (this.userInfo && this.userInfo.id) {
        return creator.id == this.userInfo.id ? '我' : creator.realName
      }
      return creator.realName
    },
    // 重复周期文案
    cyclicalText() {
      return cyclicalObj[this.task.cyclical || 'once'] + '重复'
    },
    taskStatusClass() {
      const { status } = this.task
      if (status !== 2) {
        if (status == 4 || status == 3) {
          return 'over'
        } else if (
          this.task.endTime &&
          this.task.endTime < window.portalTime &&
          status !== 3
        ) {
          return 'dely'
        }
      } else if (status == 2) {
        return 'over'
      }
      return ''
    },
    taskDetailPath() {
      let url
      const {
        taskDefinitionKey,
        rootProcessExec,
        id,
        instanceTag,
        subTaskType,
        groupId
      } = this.task
      if (instanceTag == 1 || (instanceTag == 3 && subTaskType == 1)) {
        // 独立任务和独立任务的子任务
        url = `/${groupId}/task-detail/${id}`
      } else if (instanceTag == 2 || instanceTag == 4) {
        // 流程任务
        url = `/${groupId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
      } else if (instanceTag == 3) {
        // 流程节点的子任务
        url = `/${groupId}/process-task-detail/${rootProcessExec}/${taskDefinitionKey}/${id}`
      }
      return url
    },
    parentDetailPath() {
      let url
      const { parentExecId, rootProcessExec, subTaskType, groupId } = this.task
      if (subTaskType == 1) {
        // 独立任务
        url = `/${groupId}/task-detail/${parentExecId}`
      } else {
        // 流程
        url = `/${groupId}/flow-detail/${rootProcessExec}`
      }
      return url
    },
    hasShowMore() {
      return (
        this.task.instanceTag == 1 &&
        this.task.status != 4 &&
        this.task.status != 2 &&
        this.task.change != 0
      )
    }
  }
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
$--color-primary: #3366ff;
$--white-border: 2px solid #fff;

.blue-text {
  color: $--color-primary;
}

@mixin hover() {
  &:hover {
    color: $--color-primary;
  }
}
.task-card {
  position: relative;
  min-height: 105px;
  padding: 16px 16px 16px 56px;
  color: #333;
  margin-bottom: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  .time-box {
    margin-top: 8px;
  }
  &.dely {
    .task-card-time {
      background: #ed4040;
      color: white;
      border-radius: 2px;
      padding: 0 2px;
    }
  }
  &.over {
    opacity: 0.7;
  }
  &-baseinfo {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      height: 20px;
      .task-card-time {
        margin-left: 12px;
        margin-right: 12px;
        vertical-align: middle;
      }
      .font-icon {
        color: #999999;
        font-size: 14px;
        margin-left: 23px;
      }
      .dot {
        position: absolute;
        left: -30px;
        top: 3px;
        cursor: pointer;
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #cccccc;
        border-radius: 50%;
        transition: all 0.3s;
        &.hover {
          &:hover {
            border-color: $--color-primary;
            &::before {
              display: block;
            }
          }
        }
        &::before {
          content: '完成';
          position: absolute;
          display: none;
          width: 64px;
          height: 42px;
          top: 17px;
          left: -2px;
          font-size: 14px;
          text-align: center;
          line-height: 42px;
          color: #333333;
          background: #fff;
          border: 1px solid #ebebeb;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        }

        &.done {
          border-color: $--color-primary;
          background: $--color-primary;
          opacity: 0.7;
          cursor: auto;
          &::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 7px;
            border-right: $--white-border;
            border-bottom: $--white-border;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -55%) rotate(45deg);
          }
        }
      }
      .label {
        color: #333;
        font-size: 14px;
        font-weight: 600;
        max-width: 340px;
        vertical-align: middle;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        @include hover;

        &.cancel {
          text-decoration: line-through;
        }
      }
      .status-bar {
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 12px;
        line-height: 1;
        &.done {
          background: rgba(51, 102, 255, 0.1);
          color: rgba(51, 102, 255, 0.8);
          opacity: 0.8;
        }
        &.padding {
          background: rgba(240, 240, 240, 1);
          color: #999999;
        }
        &.processing {
          background: rgba(51, 102, 255, 0.1);
          color: #3366ff;
        }
        &.suspend {
          background: rgba(240, 240, 240, 1);
          color: #999999;
        }
        &.cancel {
          background: rgba(240, 240, 240, 1);
          color: #999999;
        }
      }
    }
    .right {
      font-size: 14px;
      color: #999;
      .parent-label {
        color: #333333;
        // margin-right: 16px;
        line-height: 1;
        vertical-align: middle;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
        text-align: right;
        @include hover;

        span {
          vertical-align: middle;
          font-size: 14px;
          color: #999;
        }
      }
      .creator-text {
        color: #333333;
      }
    }
  }
  .executor {
    color: #999;
    font-size: 14px;
    margin-top: 10px;
    span {
      color: #333;
    }
  }
  &-time {
    color: #999999;
    font-size: 14px;
  }
  &-actions {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    color: #666666;
    .group {
      display: inline-block;
      margin-right: 20px;
      .font-icon {
        color: #999999;
        padding: 10px 0 10px 10px;
      }
    }
    .right {
      color: #999999;
    }
    .tag-item {
      display: inline-block;
      color: #333;
      font-size: 14px;
      margin-right: 16px;
      position: relative;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #3366ff;
      }
    }
  }
  .overdue-bar {
    position: absolute;
    // display: none;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background-color: #ff0000;
  }
}
</style>
