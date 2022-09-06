<template>
  <div class="summary-wrap">
    <ul class="task-summary">
      <li class="task-total" v-for="(item, i) in formatData" :key="i">
        <p class="task-title" v-if="i === 0">
          店铺全部{{ type === 'task' ? '任务' : '流程' }}
        </p>
        <p class="task-title" v-if="i === 1">我执行的</p>
        <p class="task-title" v-if="i === 2">我创建的</p>
        <ul class="task-number">
          <li>
            <div @click="clickHandler(i, 0)" v-if="type === 'process'">
              进行中&nbsp;
              <span>{{
                item.inProgress === undefined ? '-' : item.inProgress
              }}</span>
            </div>
            <div @click="clickHandler(i, 0)" v-else>
              待处理&nbsp;
              <span>{{
                item.inProgress === undefined ? '-' : item.pending
              }}</span>
            </div>
            <div @click="clickHandler(i, 1)" v-if="type === 'process'">
              有逾期&nbsp;
              <span>{{ item.delay === undefined ? '-' : item.delay }}</span>
            </div>
            <div @click="clickHandler(i, 1)" v-else>
              已逾期&nbsp;
              <span>{{ item.delay === undefined ? '-' : item.delay }}</span>
            </div>
          </li>
          <li>
            <div @click="clickHandler(i, 2)">
              今日完成&nbsp;
              <span>{{
                item.completedToday === undefined ? '-' : item.completedToday
              }}</span>
            </div>
            <div @click="clickHandler(i, 3)">
              今日到期&nbsp;
              <span class="green">{{
                item.expireToday === undefined ? '-' : item.expireToday
              }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    summaryData: {
      // 概览数据
      value: Array,
      default: {}
    },
    type: {
      value: String, // 类型： 'task'(任务概览)， 'process'(流程概况)
      required: true
    }
  },
  computed: {
    // 格式化渲染数据
    formatData() {
      return [
        this.summaryData.group || {},
        this.summaryData.iExecute || {},
        this.summaryData.iCreated || {}
      ]
    }
  },
  methods: {
    clickHandler(ind, item) {
      let myTab, taskTab
      taskTab = ind === 0 ? 2 : 0
      myTab = ind - 1
      this.$router.push(
        `/${this.$route.params.storeId}/task?${
          taskTab === 2 ? '' : 'myTab=' + myTab + '&'
        }taskTab=${taskTab}&view=${this.type}`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.task-list,
.task-detail {
  list-style: none;
  padding: 0;
  margin: 0;
}
.summary-wrap {
  background: white;
  margin-top: 24px;
}
.task-summary {
  list-style: none;
  margin: 0;
  padding: 0 0 24px 0;
  > li {
    list-style: none;
    border-right: 1px solid #e8e8e8ff;
    padding: 0 32px;
    flex: 1;
    &:last-child {
      border-right: none;
    }
  }
  display: flex;
  align-items: center;
}
.task-title {
  color: #333;
  font-size: 14px;
  margin: 0;
  margin-bottom: 20px;
}
.task-total-number {
  font-size: 24px;
  margin: 0;
  color: #333;
  margin-bottom: 24px;
}
.task-number {
  list-style: none;
  font-size: 12px;
  color: #666;
  margin: 0;
  padding: 0;
  > li {
    list-style: none;
  }
  > li {
    color: #666;
    display: flex;
    justify-content: space-between;
    > div {
      min-width: 80px;
      white-space: nowrap;
      cursor: pointer;
    }
    span {
      color: #333;
    }
    .green {
      color: #3266ffff;
    }
    &:first-child {
      margin-bottom: 16px;
    }
  }
}
</style>
