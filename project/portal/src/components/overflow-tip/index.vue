<template>
  <div class="overflow-tip" v-if="!showNotice" ref="tip">
    {{ words }}
  </div>
  <el-tooltip effect="dark" :content="words" placement="top" v-else>
    <div class="overflow-tip" v-if="showNotice" ref="tip">
      {{ words }}
    </div>
  </el-tooltip>
</template>
<script>
export default {
  data() {
    return {
      showNotice: false
    }
  },
  methods: {
    checkIfChange() {
      const dom = this.$refs.tip
      if (dom && dom.clientWidth < dom.scrollWidth) {
        this.showNotice = true
      } else {
        this.showNotice = false
      }
    },
    refreshTip() {
      if (document.visibilityState === 'visible' && this.showNotice) {
        this.showNotice = false
        window.setTimeout(() => {
          this.showNotice = true
        }, 0)
      }
    }
  },
  props: {
    words: {
      type: String,
      default: ''
    }
  },
  mounted() {
    function throttle(fn, time) {
      let timer = ''
      return function() {
        timer && clearTimeout(timer)
        timer = window.setTimeout(fn, time)
      }
    }
    const handler = (this.handler = throttle(this.checkIfChange, 200))
    window.addEventListener('resize', handler)

    // 修复显示提示时跳转其它页面返回时提示异常bug
    window.addEventListener('visibilitychange', this.refreshTip)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handler)
    window.removeEventListener('visibilitychange', this.refreshTip)
  },
  watch: {
    words: {
      immediate: true,
      handler() {
        window.setTimeout(() => {
          this.checkIfChange()
        }, 0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.overflow-tip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
