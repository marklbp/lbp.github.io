/* 带箭头的气泡提示 */
<template>
  <div @click.stop @touchmove.prevent v-show="value">
    <div class="mask" :class="{transparent: maskTransparent}" @click="clickMask"></div>
    <div class="arrow"></div>
    <div class="content-wrapper" :class="{'content-wrapper-active': showContent}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArrowTip',
  props: {
    //  遮罩层是否透明
    maskTransparent: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean
    }
  },
  data () {
    return {
      showContent: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        let timer = requestAnimationFrame(() => {
          this.showContent = val
          cancelAnimationFrame(timer)
        })
      }
    }
  },
  methods: {
    //  点击遮罩层
    clickMask () {
      this.value = false
    }
  }
}
</script>

<style lang="stylus" scoped>
/* 箭头大小 */
arrow-width = 30px
/* 箭头大小的一半 */
arrow-half = 15px
/* 顶部高度 */
top-height = 92px
.mask
  position fixed
  left 0
  right 0
  top top-height
  bottom 0
  background-color rgba(0, 0, 0, .6)
  z-index 996
  &.transparent
    background-color transparent
.content-wrapper
  position absolute
  right 0
  top 100%
  background-color #FFF
  border-radius 4px
  z-index 997
  margin-top arrow-half
  transform scaleY(0)
  transition transform .2s linear
  transform-origin right top
.content-wrapper-active
  transform scaleY(1)
.arrow
  position absolute
  top 100%
  border-right arrow-width solid transparent
  border-top arrow-width solid transparent
  border-left arrow-width solid transparent
  border-bottom arrow-width solid #FFF
  z-index 997
  width 0
  height 0
  box-size content-box
  left 50%
  transform translate(-50%, -50%)
</style>
