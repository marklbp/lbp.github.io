<template>
  <div class="operation-wrap">
    <search v-model="searchConditions" @search="searchHandler"></search>
    <div class="operate-tabs">
      <el-tabs
        v-model="activeType"
        @tab-click="switchTabHandler"
        style="height:100px;"
      >
        <el-tab-pane label="我经办的" name="1"></el-tab-pane>
        <el-tab-pane label="我创建的" name="2"></el-tab-pane>
        <el-tab-pane label="抄送给我的" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <page-init :loading="pageInit" :message="message">
      <process-list :list="records[activeType - 1].list"></process-list>
    </page-init>
    <pagination
      :totalCount="records[activeType - 1].totalCount"
      :pageData="pageData"
      v-show="records[activeType - 1].list.length"
      @pageChange="pageChangeHandler"
    />
  </div>
</template>
<script>
import search from './search'
import processList from './process-list'
import pagination from './pagination'
export default {
  name: 'myOperation',
  data() {
    return {
      pageInit: true,
      message: '',
      activeType: '1',
      pageData: {
        pageSize: 10,
        currentPage: 1
      },
      searchConditions: {
        searchWords: '',
        status: -1
      },
      records: [
        // 我经办的
        {
          totalCount: 10,
          list: []
        },
        // 我创建的
        {
          totalCount: 10,
          list: []
        },
        // 抄送给我的
        {
          totalCount: 10,
          list: []
        }
      ]
    }
  },
  methods: {
    switchTabHandler(vm) {
      const { path, query } = this.$route
      this.$router.push({
        path,
        query: {
          myTab: query.myTab,
          taskTab: query.taskTab,
          myOp: vm.name
        }
      })
      const { index } = vm
      this.pageData.currentPage = 1
      this.getProcessList({ type: +index + 1 })
    },
    searchHandler() {
      this.pageData.currentPage = 1
      this.getProcessList()
    },
    getProcessList(params = {}) {
      this.pageInit = true
      this.message = ''
      const type = this.activeType
      const paramsCommon = {
        type,
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
          this.records.splice(type - 1, 1, {
            totalCount,
            list
          })
          if (!list || !list.length) {
            throw new Error('暂无数据')
          }
          if (this.activeType === type) {
            this.message = ''
          }
        })
        .catch(err => {
          this.records.splice(type - 1, 1, {
            totalCount: 0,
            list: []
          })
          if (this.activeType === type) {
            this.message = err.message || err.msg
          }
          console.log(err)
        })
        .finally(() => {
          this.pageInit = false
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
    const { query } = this.$route
    this.activeType = query.myOp || '1'
    this.getProcessList()
  }
}
</script>
<style lang="scss" scoped>
.operation-wrap {
  /deep/ {
    .component-empty {
      background: white;
    }
  }
}
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
