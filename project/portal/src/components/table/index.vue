<template>
  <div class="table-list">
    <el-table
      class="table portal-loading"
      :data="list"
      v-loading="loading"
      element-loading-spinner="portal-icon-loading"
      @selection-change="selectChange"
      :row-key="rowKey"
    >
      <slot></slot>
      <page-init
        slot="empty"
        v-if="!loading && message.length > 0"
        :is-search="isSearch"
        :message="message"
        :code="code"
        :loading="false"
      />
    </el-table>
    <el-pagination
      v-if="showPage"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="sizes"
      :layout="layout"
      :total="total"
      @size-change="change($event, 'pageSize')"
      @current-change="change($event, 'currentPage')"
    />
  </div>
</template>
<script>
export default {
  props: {
    showPage: {
      /*控制分页显示*/
      type: Boolean,
      default: _ => true
    },

    sizes: {
      /*单页分页器*/
      type: Array,
      default() {
        return [10, 20, 50]
      }
    },

    layout: {
      /*分页布局，参考element-ui的table组件*/
      type: String,
      default: 'sizes, total, jumper, prev, pager, next'
    },

    moduleName: {
      /*模块名字，可以不传*/
      type: String,
      default: _ => ''
    },

    apiName: {
      /*接口名字，必传*/
      type: String,
      default: _ => ''
    },

    filter: {
      /*筛选条件入参*/
      type: Object,
      default: _ => null
    },

    headers: {
      /*列表查询接口需要传入的请求头*/
      type: Object,
      default: _ => null
    },

    keys: {
      /*解析服务端返回的列表、总条数等字段*/
      type: Object,
      default: _ => ({ records: 'records', total: 'totalCount' })
    },

    refresh: {
      /*表格数据刷新标识，true则刷新*/
      type: Boolean,
      default: _ => false
    },

    loading: {
      /*表格数据单次加载状态标识，0->加载中，1->加载成功，2->加载失败*/
      type: Boolean,
      default: _ => true
    },

    rowKey: {
      type: [String, Function],
      default: _ => 'id'
    }
  },
  components: {
    pageInit: _ => import('~/components/page-init')
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 10,
      list: [],
      isSearch: 0,
      message: '',
      code: 0
    }
  },
  watch: {
    filter: {
      deep: true,
      handler(v) {
        this.currentPage = 1
        this.isSearch = 1
        this.getList()
      }
    },
    refresh(v) {
      if (v) {
        this.reset()
        return this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reset() {
      this.currentPage = 1
    },
    change(val, type) {
      this[type] = val
      this.isSearch = 0
      this.getList()
    },
    async getList() {
      try {
        this.$emit('loading', 0)
        if (!this.params) {
          this.params = {}
        }
        let o = this.showPage
          ? {
              pageSize: this.pageSize,
              currentPage: this.currentPage
            }
          : {}
        Object.assign(this.params, o, this.filter)
        let fn = this.$api
        if (this.moduleName) {
          fn = fn[this.moduleName]
        }
        if (this.apiName) {
          fn = fn[this.apiName]
        }
        let { data } = await fn(this.params, { headers: this.headers })
        this.list = data[this.keys['records']]
        this.total = data[this.keys['total']]
        this.$emit('loading', 1)
        this.code = 0
        if (
          !this.list ||
          (this.list instanceof Array && this.list.length <= 0)
        ) {
          this.message = this.isSearch == 1 ? '搜索为空' : '暂无数据'
        } else {
          this.message = ''
        }
        this.$emit('done', {
          total: data[this.keys['total']],
          list: data[this.keys['records']]
        })
      } catch (ex) {
        this.$emit('loading', 2)
        this.message = ex.message || ex.msg
        this.code = ex.code
      }
    },
    selectChange(val) {
      this.$emit('select', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-pagination {
  padding: 12px 30px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  position: relative;
  /deep/ .el-pagination__sizes {
    position: absolute;
    left: 32px;
    top: 12px;
  }
}
/deep/ .el-table {
  &__empty-block {
    width: auto !important;
    .el-table__empty-text {
      width: 100%;
    }
  }
  th {
    .cell {
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
