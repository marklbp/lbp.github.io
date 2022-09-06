<template>
  <div class="store-dashboard">
    <taskNotice type="store" class="top-notice">滚动条</taskNotice>
    <div class="store-dashboard-welcome">
      <!-- <img
        v-if="currentShops.photo"
        :src="currentShops.photo"
        class="store-dashboard-welcome-logo"
      /> -->
      <div>{{ '欢迎来到：' + parseGroupName() }}</div>
    </div>
    <div class="store-dashboard-top">
      <div class="dashboard-item">
        <dashboardTabs :params="dashboardTabsParams" />
      </div>
    </div>
    <div class="store-dashboard-content">
      <div class="store-dashboard-content-left">
        <div class="dashboard-item">
          <overview :params="overviewTask" />
        </div>
        <div class="dashboard-item">
          <overview :params="overviewProcess" />
        </div>
        <div class="dashboard-item flex">
          <div class="dashboard-item-left">
            <knowledge :params="knowledgeParams" />
          </div>
          <div class="dashboard-item-gap"></div>
          <div class="dashboard-item-right">
            <shop-report />
          </div>
        </div>
      </div>
      <div class="store-dashboard-content-right">
        <div class="dashboard-item">
          <taskList type="process" />
        </div>
      </div>
    </div>
    <dashboardCalendar />
  </div>
</template>
<script>
import dashboardCalendar from './components/calendar'
export default {
  name: 'store-dashboard',
  components: {
    taskNotice: _ => import('~/components/task-notice'), // 最新待办
    dashboardCalendar,
    overview: _ => import('~/components/situation-dashboard'),
    taskList: _ => import('./components/task-list'),
    knowledge: _ => import('~/components/knowledge-dashboard'),
    dashboardTabs: _ => import('~/components/dashboard-tabs'), // GMV
    shopReport: _ => import('./components/report')
  },
  methods: {
    parseGroupName() {
      let s = this.shops.find(s => s.id == this.$route.params.storeId)
      if (s) {
        return s.groupName
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      overviewTask: {
        type: 'task',
        scope: 'store'
      },
      overviewProcess: {
        type: 'process',
        scope: 'store'
      },
      dashboardTabsParams: {
        type: 'store'
      },
      knowledgeParams: {
        scope: 'store'
      }
    }
  },
  computed: {
    shops() {
      return this.$store.state.STORE_LIST
    },
    currentShops() {
      return this.shops.find(s => s.id == this.$route.params.storeId) || {}
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
.store-dashboard {
  .flex {
    @include flex;
    align-items: stretch;
  }
  &-welcome {
    @include flex;
    color: #333333;
    font-size: 22px;
    padding: 6px 32px 32px 32px;
    align-items: center;
    &-logo {
      display: block;
      width: 48px;
      height: 48px;
      margin-right: 24px;
    }
  }
  .dashboard-item {
    width: 100%;
    margin-bottom: 16px;
    &-gap {
      width: 16px;
    }
    &-left {
      width: 0;
      flex: 1;
    }
    &-right {
      width: 0;
      flex: 1;
    }
  }
  &-top {
    @include border-box;
  }
  &-content {
    @include flex;
    @include border-box;
    &-left {
      width: 66%;
      margin-right: 17px;
    }
    &-right {
      width: 32%;
    }
  }
}
</style>
