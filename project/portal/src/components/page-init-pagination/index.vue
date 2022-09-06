<template>
  <page-init :code="code" :message="message" :loading="loading" :class="{'page-init-empty': !hasData}">
    <slot />
    <pagination
      v-if="hasData"
      :page="page.currentPage"
      :total="page.total"
      :size="page.pageSize"
      @pageChange="handleCurrentChange"
      @sizeChange="handleSizeChange"
    />
  </page-init>
</template>
<script>
const initPage = {
  currentPage: 1,
  total: 0,
  pageSize: 10
}
export default {
  components: {
    pageInit: _ => import('~/components/page-init'),
    pagination: _ => import('~/components/pagination')
  },
  props: {
    hasStore: {
      default: _ => false,
      type: Boolean
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
    },
    apiName: {
      default: _ => '',// string => module.api | api, Array => [module, api]
      type: [String, Array]
    },
    httpConfig: {
      default: _ => null,
      type: Object
    },
    responseListKey: {
      default: _ => 'records',
      type: String
    },
    refresh: {
      default: _ => false,
      type: Boolean
    }
  },
  data() {
    return {
      code: 0,
      message: '',
      loading: true,
      hasData: false,
      page: { ...initPage }
    };
  },
  computed: {
    request() {
      let arr = []
      if (typeof this.apiName === 'string') {
        arr = this.apiName.split('.')
      } else {
        arr = this.apiName
      }
      return arr.reduce((api, name) => {
        return api[name]
      }, this.$api)
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let params = {}
      Object.assign(params, this.page)
      this.$emit('request-before', params)
      this.loading = true
      this.code = 0
      try {
        let res = await this.request(params, this.httpConfig)
        let data = res.data || {}
        this.page.total = data.totalCount
        if (!data[this.responseListKey] || data[this.responseListKey].length < 1) {
          this.hasData = false
          this.message = '暂无数据'
        } else {
          this.hasData = true
          this.message = ''
        }
        this.$emit('request-done', res)
      } catch (err) {
        this.$emit('request-fail', err)
        this.message = err.msg || err.message
        this.code = err.code
      } finally {
        this.loading = false
      }
    },
    handleCurrentChange(page) {
      this.page.currentPage = page
      this.init()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.init()
    },
    handleRefresh(noChangeSize, noChangePage) {
      let page = {...initPage}
      if (noChangeSize) {
        page.pageSize = this.page.pageSize
      }
      if (noChangePage) {
        page.currentPage = this.page.currentPage
      }
      this.page = page
      this.init()
    }
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.handleRefresh(true)
      }
    },
    refresh(v) {
      if (v) this.handleRefresh(true, true)
    }
  }
}
</script>
<style lang="scss">
  .page-init.page-init-empty {
    background-color: #fff !important;
  }
</style>