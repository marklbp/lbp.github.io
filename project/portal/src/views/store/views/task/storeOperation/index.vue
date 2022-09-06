<template>
  <div class="operation-wrap">
    <search v-model="searchConditions" @search="searchHandler"></search>
    <page-init :loading="pageInit" :message="message">
      <process-list :list="records.list"></process-list>
    </page-init>
    <pagination
      :totalCount="records.totalCount"
      :pageData="pageData"
      v-show="records.list.length"
      @pageChange="pageChangeHandler"
    />
  </div>
</template>
<script>
import search from '../myOperation/search'
import processList from '../myOperation/process-list'
import pagination from '../myOperation/pagination'
export default {
  name: 'storeOperation',
  data() {
    return {
      pageInit: true,
      message: '',
      pageData: {
        pageSize: 10,
        currentPage: 1
      },
      searchConditions: {
        searchWords: '',
        status: -1
      },
      records: {
        totalCount: 10,
        list: []
      }
    }
  },
  methods: {
    switchTabHandler(vm) {
      const { index } = vm
      this.pageData.currentPage = 1
      this.getProcessList({ type: +index + 1 })
    },
    searchHandler() {
      this.pageData.currentPage = 1
      this.getProcessList()
    },
    getProcessList(params = {}) {
      const paramsCommon = {
        type: 4,
        pageSize: this.pageData.pageSize,
        currentPage: this.pageData.currentPage,
        groupId: this.$route.params.storeId,
        status: this.searchConditions.status,
        label: this.searchConditions.searchWords
      }
      Object.assign(paramsCommon, params)
      this.$api.processList
        .get(paramsCommon, { headers: { groupId: this.$route.params.storeId } })
        .then(val => {
          const {
            data: { totalCount, records: list }
          } = val
          this.records = { totalCount, list }
          this.pageInit = false
          if (!list || !list.length) {
            this.message = '暂无数据'
          } else {
            this.message = ''
          }
        })
        .catch(err => {
          this.pageInit = false
          this.message = err.message || err.msg || '暂无数据'
          this.records = {
            totalCount: 0,
            list: []
          }
          console.log(err)
        })
    },
    pageChangeHandler(params) {
      this.pageData = params
      this.getProcessList()
    }
  },
  components: {
    'page-init': _ => import('~/components/page-init'),
    search,
    processList,
    pagination
  },
  mounted() {
    this.getProcessList()
  }
}
</script>
<style lang="scss" scoped>
.switch-mode {
  position: absolute;
  right: 16px;
  top: 0;
  line-height: 56px;
  color: #3366ff;
  font-size: 14px;
  cursor: pointer;
}
.operate-tabs {
  background: white;
  border-radius: 2px;
  height: 56px;
  // padding: 0 32px;
  color: #333;
  /deep/ {
    .el-tabs__nav-wrap {
      padding-left: 30px;
    }
    .el-tabs__item {
      height: 56px;
      line-height: 56px;
      font-size: 14px;
    }
  }
}
.tabs-notice {
  float: right;
  cursor: pointer;
  line-height: 56px;
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  > i {
    width: 16px;
    height: 11px;
    // background:url(../../../asset/gw-icon.png) center no-repeat;
    background-size: 16px;
    margin-right: 8px;
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  box-sizing: content-box;
}
</style>
