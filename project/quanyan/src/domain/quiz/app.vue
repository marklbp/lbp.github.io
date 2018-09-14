<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="showRouterView && ($route.meta && $route.meta.keepAlive)"></router-view>
    </keep-alive>
    <router-view v-if="showRouterView && (!($route.meta && $route.meta.keepAlive))"></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'APP',
  computed: {
    //  是否显示根节点
    ...mapState(['showRouterView'])
  }
}
</script>
