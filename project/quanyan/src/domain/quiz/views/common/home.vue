/* 首页列表 */
<template>
  <div>
    <div v-if="item !== 'undefined'" @click="view(item.path)" class="list-item center-flex-v f-28 c-31 active-btn" v-for="(item, index) in list" :key="index">
      {{item.title}}
    </div>
  </div>
</template>

<script>
import router from 'quiz/router.js'
let { options: { routes = [] } = {} } = router
const list = routes.map(item => {
  if (item.path === '/' || (item.meta && item.meta.showInHome === false)) {
    return 'undefined'
  }
  return {
    title: (item.meta && item.meta.title) || '',
    path: item.path
  }
})
export default {
  name: 'HOME',
  data () {
    return {
      list
    }
  },
  methods: {
    view (path) {
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="stylus" scoped>
.list-item
  height 110px
  padding 0 40px
</style>

<style lang="scss" scoped>
.list-item {
  position: relative;
  @include hairline-bottom(#D7D7D7)
}
</style>
