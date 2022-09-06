<template>
  <page-init-pagination
    :has-store="hasStore"
    api-name="processList.get"
    :params="params"
    :http-config="httpConfig"
    @request-before="reqBefore"
    @request-done="reqDone"
    @request-fail="reqFail"
    :refresh="refresh"
    id="process-list"
  >
    <process-card
      @updateProcessList="refresh = true"
      v-for="(item, i) in processList"
      :processData="item"
      :key="i"
    />
  </page-init-pagination>
</template>

<script>
export default {
  name: 'process-list',
  components: {
    processCard: _ => import('./process-card'),
    pageInitPagination: () => import('~/components/page-init-pagination')
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
        searchType: '0',
        isHideFile: '1',
        sort: '0'
      }),
      type: Object
    }
  },
  data() {
    return {
      processList: [],
      httpConfig: {
        headers: {
          groupId: this.$route.params.storeId
        }
      },
      refresh: false
    }
  },
  methods: {
    reqBefore(params) {
      params = Object.assign(params, this.params, {
        filed: +this.params.isHideFile ? 0 : null,
        type: +this.params.searchType + 1,
        groupId: this.$route.params.storeId
      })
      delete params.isHideFile
      delete params.searchType
      if (this.hasStore) {
        params.type = 4
      }
    },
    reqDone(res) {
      this.refresh = false
      let data = res.data || {}
      this.processList = data.records
    },
    reqFail(err) {
      this.refresh = false
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped></style>
