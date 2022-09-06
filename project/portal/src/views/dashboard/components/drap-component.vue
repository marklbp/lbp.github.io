<template>
  <keep-alive>
    <component :is="componentName" :params="params">
      <template slot="drag">
        <slot />
      </template>
    </component>
  </keep-alive>
</template>
<script>
export default {
  name: 'drapComponent',
  components: {
    dashboardTabs: _ => import('~/components/dashboard-tabs'), // GMV/SLP
    overview: _ => import('~/components/situation-dashboard'), // 任务概况/流程概况
    listModule: _ => import('../components/list-module'), // 通用列表组件
    knowledgeGlobal: _ => import('~/components/knowledge-dashboard'), // 知识库组件
    commonStore: _ => import('../components/common-store'), // 店铺概览
    iframeBlock: _ => import('../components/iframe-block') // 自定义模块
  },
  data() {
    return {}
  },
  props: {
    component: {
      type: String,
      default: 'iframe'
    },
    width: {
      type: Number,
      default: 12
    },
    iframe: {
      // iframe带的属性
      type: Object
    },
    scaleParams: {
      // 缩放时的零时属性
      type: Object,
      default: null
    }
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    componentName() {
      const component = this.component
      let name = component
      if (['overviewTask', 'overviewProcess'].indexOf(component) > -1) {
        name = 'overview'
      }
      if (
        ['listModuleOperation', 'listModuleProduct'].indexOf(component) > -1
      ) {
        name = 'listModule'
      }
      return name
    },
    params() {
      let params = {
        enableDrag: true,
        width: this.scaleParams
          ? this.scaleParams.width
            ? this.scaleParams.width
            : this.width
          : this.width
      }
      switch (this.component) {
        case 'commonStore':
          break
        case 'dashboardTabs':
          params = {
            ...params,
            type: 'global'
          }
          break
        case 'overviewTask':
          params = {
            ...params,
            type: 'task',
            scope: 'global'
          }
          break
        case 'overviewProcess':
          params = {
            ...params,
            type: 'process',
            scope: 'global'
          }
          break
        case 'knowledgeGlobal':
          params = {
            ...params,
            scope: 'global'
          }
          break
        case 'listModuleOperation':
          params = {
            ...params,
            type: 'operation'
          }
          break
        case 'listModuleProduct':
          params = {
            ...params,
            type: 'product'
          }
          break
        case 'iframeBlock':
          params = {
            ...params,
            title: this.iframe.title,
            src: this.iframe.src,
            height: this.iframe.height
          }
          break
        default:
          break
      }
      return params
    }
  }
}
</script>
<style lang="scss" scoped>
.drap_component {
  width: 100%;
  height: auto;
}
</style>
