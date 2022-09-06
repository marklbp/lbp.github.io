<template>
  <section class="task-list-warrper">
    <page-init
      class="task-list"
      :loading="loading"
      :code="code"
      :message="message"
      style="min-height: 50px;"
    >
      <task-card
        :task="item"
        @changeStatus="handelTaskStatusChange"
        v-for="item in taskListData"
        :key="item.id"
        :type="type"
      />
      <pagination
        v-if="this.taskListData.length"
        :page="page.currentPage"
        :total="page.total"
        :size="page.pageSize"
        @pageChange="handleCurrentChange"
        @sizeChange="handleSizeChange"
      />
    </page-init>
    <template v-if="!hasStore && type != 'global' && params.searchType == 0">
      <div class="collapse-container">
        <span class="collapse" @click="toggleShow">
          <i
            class="icon"
            :class="`el-icon-arrow-${soonShow ? 'down' : 'right'}`"
          />
          即将开始（{{ pageSoon.total }}）
        </span>
      </div>
      <page-init
        class="task-list"
        v-show="soonShow"
        :loading="loadingSoon"
        :code="codeSoon"
        :message="messageSoon"
        style="min-height: 50px;"
      >
        <task-card
          :task="item"
          @changeStatus="getSoonTaskList"
          v-for="item in taskListDataSoon"
          :key="item.id"
          :type="type"
        />
        <pagination
          v-if="this.taskListDataSoon.length"
          :page="pageSoon.currentPage"
          :total="pageSoon.total"
          :size="pageSoon.pageSize"
          @pageChange="handleCurrentChange($event, true)"
          @sizeChange="handleSizeChange($event, true)"
        />
      </page-init>
    </template>
  </section>
</template>

<script>
import taskCard from './task-card'
import pagination from '~/components/pagination'

const initPage = {
  currentPage: 1,
  total: 0,
  pageSize: 10
}
export default {
  name: 'task-list',
  components: {
    taskCard,
    pagination,
    pageInit: () => import('~/components/page-init')
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
      page: { ...initPage },
      pageSoon: { ...initPage },
      httpConfig: {},
      loading: true,
      message: '',
      loadingSoon: true,
      messageSoon: '',
      soonShow: true,
      code: 0,
      codeSoon: 0
    }
  },
  // created() {},
  mounted() {
    const { storeId } = this.$route.params
    this.httpConfig = {
      headers: {
        groupId: storeId
      }
    }
    this.getTaskList()
    if (!this.hasStore && this.type != 'global') {
      this.getSoonTaskList()
    }
  },
  methods: {
    async getTaskList() {
      this.loading = true
      this.code = 0
      const { queryTaskList } = this.$api.myTask
      const { getTask } = this.$api.globalTask
      let searchType = this.params.searchType
      if (this.hasStore) {
        searchType = 4
      } else if (this.$route.query.view == 'process') {
        searchType += 1
      }
      const params = Object.assign({}, this.params, this.page, {searchType})
      try {
        let res
        if (this.type == 'global') {
          res = await getTask(params, this.httpConfig)
        } else {
          res = await queryTaskList(params, this.httpConfig)
        }
        const { totalCount, records } = res.data
        this.taskListData = records
        this.page.total = totalCount
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
    async getSoonTaskList() {
      this.loadingSoon = true
      this.codeSoon = 0
      const { futureTaskList } = this.$api.myTask
      const params = {
        ...this.pageSoon
      }
      delete params.total
      try {
        const res = await futureTaskList(params, this.httpConfig)
        const { totalCount, records } = res.data
        this.taskListDataSoon = records
        this.pageSoon.total = totalCount
        if (!records || records.length == 0) {
          this.messageSoon = '暂无数据'
        } else {
          this.messageSoon = ''
        }
      } catch (err) {
        console.error(err)
        this.messageSoon = err.msg || err.message
        this.codeSoon = err.code
      } finally {
        this.loadingSoon = false
      }
    },
    handelTaskStatusChange() {
      this.getTaskList()
      if (this.params.searchType == '0') {
        this.getSoonTaskList()
      }
    },
    handleCurrentChange(page, isSoon) {
      if (!isSoon) {
        this.page.currentPage = page
        this.getTaskList()
      } else {
        this.pageSoon.currentPage = page
        this.getSoonTaskList()
      }
    },
    handleSizeChange(size, isSoon) {
      if (!isSoon) {
        this.page.pageSize = size
        this.page.currentPage = 1
        this.getTaskList()
      } else {
        this.pageSoon.pageSize = size
        this.pageSoon.currentPage = 1
        this.getSoonTaskList()
      }
    },
    refresh(noChangeSize) {
      if (noChangeSize) {
        this.page = { ...initPage, pageSize: this.page.pageSize }
      } else {
        this.page = { ...initPage }
      }
      this.getTaskList()
    },
    toggleShow() {
      this.soonShow = !this.soonShow
    }
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.refresh(true)
      }
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
