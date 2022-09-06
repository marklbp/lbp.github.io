<template>
  <section class="task-list-warrper">
    <page-init-pagination 
      :has-store="hasStore"
      :api-name="taskApiName"
      :params="params"
      :http-config="httpConfig"
      @request-before="reqBefore"
      @request-done="reqDone"
      @request-fail="reqFail"
      :refresh="refreshTask"
    >
      <task-card
        @changeStatus="handelTaskStatusChange"
        v-for="item in taskListData"
        :task="item"
        :key="item.id"
        :type="type"
      />
    </page-init-pagination>
    <template v-if="!hasStore && type != 'global' && params.searchType == 0">
      <div class="collapse-container">
        <span class="collapse" @click="toggleShow">
          <i
            class="icon"
            :class="`el-icon-arrow-${soonShow ? 'down' : 'right'}`"
          />
          即将开始（{{ soonTotal }}）
        </span>
      </div>
      <page-init-pagination 
        v-show="soonShow"
        :has-store="hasStore"
        api-name="myTask.futureTaskList"
        :params="params"
        :http-config="httpConfig"
        @request-before="reqBeforeSoon"
        @request-done="reqDoneSoon"
        @request-fail="reqFailSoon"
        :refresh="refreshSoonTask"
      >
        <task-card
          @changeStatus="refreshSoonTask = true"
          v-for="item in taskListDataSoon"
          :task="item"
          :key="item.id"
          :type="type"
        />
      </page-init-pagination>
    </template>
  </section>
</template>

<script>
export default {
  name: 'task-list',
  components: {
    taskCard: _ => import('./task-card'),
    pageInitPagination: () => import('~/components/page-init-pagination')
  },
  props: {
    hasStore: {
      default: _ => false,
      type: Boolean
    },
    type: {
      default: _ => 'store',
      type: String
    },
    params: {
      default: _ => ({
        keyWord: '',
        tags: '',
        status: '',
        fromTime: '',
        toTime: '',
        creator: '',
        searchType: 0,
        isHideFile: 1,
        sort: 0
      }),
      type: Object
    }
  },
  data() {
    return {
      taskListData: [],
      taskListDataSoon: [],
      httpConfig: {
        headers: {
          groupId: this.$route.params.storeId
        }
      },
      soonShow: true,
      soonTotal: 0,
      refreshSoonTask: false,
      refreshTask: false
    }
  },
  computed: {
    taskApiName() {
      if (this.type == 'global') {
        return 'globalTask.getTask'
      } else {
        return 'myTask.queryTaskList'
      }
    }
  },
  methods: {
    reqBefore(params) {
      let searchType = this.params.searchType
      if (this.hasStore) {
        searchType = 4
      } else if (this.$route.query.view == 'process') {
        searchType += 1
      }
      Object.assign(params, this.params, {searchType})
    },
    reqDone(res) {
      this.refreshTask = false
      let data = res.data || {}
      this.taskListData = data.records
    },
    reqFail(err) {
      this.refreshTask = false
      console.log(err)
    },
    reqBeforeSoon(params) {
      delete params.total
    },
    reqDoneSoon(res) {
      this.refreshSoonTask = false
      let data = res.data || {}
      this.taskListDataSoon = data.records
      this.soonTotal = res.data.totalCount
    },
    reqFailSoon(err) {
      this.refreshSoonTask = false
      console.log(err)
    },
    handelTaskStatusChange() {
      this.refreshTask = true
      if (this.params.searchType == '0') {
        this.refreshSoonTask = true
      }
    },
    toggleShow() {
      this.soonShow = !this.soonShow
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list-warrper {
  .collapse-container {
    height: 38px;
    line-height: 38px;
    .collapse {
      font-size: 14px;
      color: #333;
      cursor: pointer;
      user-select: none;
      .font-icon {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
