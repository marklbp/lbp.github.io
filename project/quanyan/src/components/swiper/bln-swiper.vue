<template lang="html">
  <div class="bln-swiper swipe-core-wh" ref="root">
    <div>
      <slot></slot>
    </div>
  </div>

</template>

<script>
import swiper from 'swipe-core/dist/swipe-core.es'

export default {
  name: 'bln-swiper',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    cycle: {
      type: Boolean,
      default: true
    },
    expose: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: window.screen.width
    },
    height: {
      type: Number
    },
    index: {
      type: Number,
      default: 0
    },
    css: {
      type: Boolean,
      default: false
    }
  },
  date () {
    return {
      instance: null
    }
  },
  mounted () {
    this.instance = swiper({
      root: this.$refs.root,
      elms: this.$children.map(c => c.$el),
      auto: this.auto,
      cycle: this.cycle,
      expose: this.expose,
      index: this.index,
      width: this.width,
      height: this.height,
      css: this.css
    })
  },
  beforeDestroy () {
    this.instance.destroy()
  }
}
</script>

<style lang="css">
</style>
