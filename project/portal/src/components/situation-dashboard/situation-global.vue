<template>
  <div class="summary-wrap" :class="{ smallDrag: width !== 12 && width !== 8 }">
    <ul class="task-summary">
      <li class="task-total" v-for="(item, i) in formatData" :key="i">
        <p class="task-title" v-if="i === 0">
          我执行的
        </p>
        <p class="task-title" v-if="i === 1">我创建的</p>
        <p class="task-title" v-if="i === 2">抄送给我的</p>
        <ul class="task-number">
          <li :class="{ wd_4: width === 4, wd_6: width === 6 }">
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
          <li :class="{ wd_4: width === 4, wd_6: width === 6 }">
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
    /* type: {
      value: String, // 类型： 'task'(任务概览)， 'process'(流程概况)
      required: true
    }, */
    params: {
      type: Object,
      default: () => ({
        type: 'process',
        scope: 'store',
        enableDrag: false,
        width: 12
      })
    }
  },
  computed: {
    type() {
      // 类型：'process'（流程）， 'task'（任务）
      const type = this.params.type
      return type || 'process'
    },
    scope() {
      // 范围： 'store'(店铺)， 'global' (全局)
      const scope = this.params.scope
      return scope ? 'scope' : 'store'
    },
    width() {
      const width = this.params.width
      return width || 12
    },
    formatData() {
      return [
        this.summaryData.iExecute || {},
        this.summaryData.iCreated || {},
        this.summaryData.copyToMe || {}
      ]
    }
  },
  methods: {
    clickHandler(ind, item) {
      // let tab, subTab
      // if (this.type === 'task') {
      //   tab = ind === 0 ? 2 : 0
      //   subTab = ind === 1 ? 1 : 2
      // } else if (this.type === 'process') {
      //   tab = ind === 0 ? 3 : 1
      //   subTab = ind === 1 ? 1 : 2
      // }
      // this.$router.push(
      //   `/${
      //     this.$route.params.storeId
      //   }/task?taskTab=${tab}&myOp=${subTab}&myTab=1`
      // )
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
  .wd_4 {
    display: inline-block !important;
    width: 49%;
    &:first-child {
      margin-bottom: 0;
    }
    > div {
      display: inline-block !important;
      width: 49%;
      padding-bottom: 16px;
    }
  }
  .wd_6 {
    display: inline-block !important;
    width: 49%;
    > div {
      display: inline-block !important;
      width: 49%;
    }
  }
}
.smallDrag {
  .task-summary {
    display: block;
  }
  .task-total {
    border: 0 none;
  }
  .task-title {
    font-weight: bolder;
  }
}
</style>
