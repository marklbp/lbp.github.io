/* 选择倍数 */
<template>
  <div class="wrapper choose-multiple-wrapper" v-show="isKeyBoardShow">
    <div class="mask" @click="hideChooseMutiple"></div>
    <div class="content-wrapper" :class="{'content-wrapper-active': showContent}">
      <div class="center-flex-v header-box">
        <div class="game-fav-item box-plr center-flex-v" @click="hideChooseMutiple">
          <div class="top-icon c-86"></div>
        </div>
        <div class="game-fav-item center-flex-v">
          <div class="f-28 c-86 box-plr">投</div>
          <div class="f-28 c-31 double-val flex-full center-flex">{{temMutiple}}</div>
          <div class="c-31 f-28 box-plr">倍</div>
        </div>
      </div>
      <md-number-keyboard v-model="showKeybord" :is-view="true" @confirm="confirm" @enter="onNumberEnter" @delete="onNumberDelete"></md-number-keyboard>
    </div>
  </div>
</template>

<script>
import { NumberKeyboard } from 'mand-mobile'
import { mapState } from 'vuex'
export default {
  name: 'ChooseMutiple',
  components: {
    [NumberKeyboard.name]: NumberKeyboard
  },
  props: {
    isKeyBoardShow: {
      type: Boolean
    },
    //  初始化倍数
    mutiple: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 是否显示内容，用于产生动画
      showContent: false,
      //  显示数字键盘
      showKeybord: true,
      //  临时选择的倍数
      temMutiple: 1
    }
  },
  computed: {
    //  获取系统参数
    ...mapState(['LotterySetting'])
  },
  watch: {
    //  监听过滤弹窗显示与否
    isKeyBoardShow: {
      immediate: true,
      handler: function (val) {
        //  控制动画
        let timer = requestAnimationFrame(() => {
          this.showContent = val
          cancelAnimationFrame(timer)
        })
        if (val) this.temMutiple = this.mutiple
      }
    }
  },
  methods: {
    // 数字键盘输入
    onNumberEnter (val) {
      if (val === '.') return false
      try {
        this.temMutiple = parseInt(`${this.temMutiple}${val}`)
        //  限制最大投注倍数99倍
        if (this.temMutiple > this.LotterySetting.singleTimeMax) this.temMutiple = this.LotterySetting.singleTimeMax
      } catch (e) {
        this.temMutiple = 1
        console.error(e)
      }
    },
    //  数字键盘回退
    onNumberDelete () {
      let temMutiple = `${this.temMutiple}`
      if (temMutiple.length >= 1) this.temMutiple = temMutiple.slice(0, temMutiple.length - 1)
    },
    //  隐藏弹窗
    hideChooseMutiple () {
      this.$emit('hideChooseMutiple')
    },
    //  点击数字键确定
    confirm () {
      let number = 1
      try {
        number = Number(this.temMutiple)
      } catch (e) {
        number = 1
      }
      this.$emit('setMutiple', number)
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  position fixed
  left 0
  right 0
  top 0
  bottom 0
.mask
  position absolute
  left 0
  right 0
  bottom 0
  top 0
  background-color rgba(0, 0, 0, .6)
  z-index 1
.content-wrapper
  position absolute
  left 0
  right 0
  bottom 0
  transform scaleY(0)
  transition transform .2s linear
  z-index 2
  transform-origin center bottom
.content-wrapper-active
  transform scaleY(1)
.game-fav-item
  width 50%
.header-box
  background-color #FFF
  height 102px
.double-val
  background-color #F6F6F6
  border-radius 4px
  height 60px
.box-plr
  padding 0 24px
.top-icon
  width  30px
  height 30px
  position relative
  top 5px
  margin-left 20px
</style>

<style lang="stylus">
/* 定制数字键盘样式 */
.choose-multiple-wrapper
  .confirm
    background-color #f04a1e !important
    color #FFF !important
  .keyboard-number-list
    .keyboard-number-item:nth-child(10)
      color transparent
</style>
