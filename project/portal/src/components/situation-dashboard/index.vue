<template>
  <div class="situation-wrap">
    <slot v-show="enableDrag" name="drag" />
    <div class="header">
      <p class="title">{{ type === 'process' ? '流程' : '任务' }}概况</p>
    </div>
    <page-init
      :loading="loading"
      :message="message"
      :iconSize="['auto', 80]"
      :code="code"
    >
      <component
        :is="summaryC"
        :summaryData="summaryData"
        :type="type"
        :params="params"
      >
      </component>
    </page-init>
  </div>
</template>
<script>
import storeSummary from './situation'
import globalSummary from './situation-global'
export default {
  data() {
    return {
      summaryC: '',
      loading: true,
      summaryData: {}, // 概况数据
      message: '',
      code: 0
    }
  },
  components: {
    storeSummary,
    globalSummary,
    pageInit: _ => import('~/components/page-init')
  },
  props: {
    /* type: {
      type: String, // 类型：'process'（流程）， 'task'（任务）
      default: 'process'
    },
    scope: {
      type: String, // 范围： 'store'(店铺)， 'global' (全局)
      default: 'store'
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
  created() {
    this.initData()
    this.summaryC = this.scope === 'store' ? storeSummary : globalSummary
  },
  watch: {
    $route(newV, oldV) {
      if (
        this.scope === 'store' &&
        newV.params.storeId !== oldV.params.storeId
      ) {
        this.initData()
      }
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
      return scope || 'store'
    },
    width() {
      const width = this.params.width
      return width || 12
    },
    enableDrag() {
      const enableDrag = this.params.enableDrag
      return enableDrag === undefined ? false : enableDrag
    },
    title() {
      if (this.type === 'task') {
        return '任务概况'
      } else if (this.type === 'process') {
        return '流程概况'
      } else {
        return ''
      }
    }
  },
  methods: {
    async initData() {
      const apiName =
        this.type === 'task'
          ? 'fetchTaskSummary'
          : this.type === 'process'
          ? 'fetchProcessSummary'
          : ''
      if (!apiName) return
      const data = await this[apiName]()
      this.summaryData = data
    },
    // 获取流程概况
    fetchProcessSummary(params = {}) {
      this.loading = true
      const apiName =
        this.scope === 'store'
          ? 'getStoreProcessSummary'
          : 'getGlobalProcessSummary'
      const converterName =
        this.scope === 'store'
          ? 'processDataConverter'
          : 'globalProcessConverter'
      const headers =
        this.scope === 'store' ? { groupId: this.$route.params.storeId } : null
      return this.$api.dashboard[apiName](params, {
        headers,
        needToast: false
      })
        .then(val => {
          this.loading = false
          const { data } = val
          if (!data || !Object.keys(data).length) {
            // this.code = 400
            this.message = '暂无数据'
          }
          return this[converterName](data || {})
        })
        .catch(err => {
          this.loading = false
          this.code = 500
          this.message = err.msg || err.message || '未知异常'
          return {}
        })
    },
    // 获取任务概况
    fetchTaskSummary(params = {}) {
      this.loading = true
      const apiName =
        this.scope === 'store' ? 'getStoreTaskSummary' : 'getGlobalTaskSummary'
      const converterName =
        this.scope === 'store' ? 'taskDataConverter' : 'globalTaskConverter'
      const headers =
        this.scope === 'store' ? { groupId: this.$route.params.storeId } : null
      return this.$api.dashboard[apiName](params, {
        headers,
        needToast: false
      })
        .then(val => {
          this.loading = false
          const { data } = val
          return this[converterName](data || {})
        })
        .catch(err => {
          this.loading = false
          this.code = 500
          this.message = err.msg || err.message || '未知异常'
          return {}
        })
    },
    // 转换店铺流程概况数据为展示组件接受的数据结构
    processDataConverter(data = {}) {
      return {
        group: data.groupPros || {}, // 全部
        iCreated: data.icreated || {}, // 我创建的
        iExecute: data.ihandle || {} // 我执行的
      }
    },
    // 转换店铺任务概况数据为展示组件接受的数据结构
    taskDataConverter(data = {}) {
      return {
        group: data.groupTask || {}, // 全部
        iCreated: data.iCreated || {}, // 我创建的
        iExecute: data.iExecute || {} // 我执行的
      }
    },
    // 全局流程概况数据转换为组件接受的数据结构
    globalProcessConverter(data = {}) {
      return {
        iExecute: data.ihandle || {},
        iCreated: data.icreated || {},
        copyToMe: data.copyToMe || {}
      }
    },
    // 全局任务概况数据转换为组件接受的数据结构
    globalTaskConverter(data = {}) {
      return {
        iExecute: data.iExecute || {},
        iCreated: data.iCreated || {},
        copyToMe: data.copyToMe || {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.situation-wrap {
  position: relative;
  background: white;
  /* height: 186px; */
  /deep/ {
    .page-init {
      min-height: 130px;
      background: white;
    }
    .done {
      min-height: 0;
    }
    .component-empty {
      min-height: 0;
      background: white;
    }
  }
}
.header {
  height: 56px;
  padding: 0 32px;
  border-bottom: 1px solid #e8e8e8ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 16px;
    color: #333333ff;
    font-weight: bold;
  }
}
</style>
