/* 头部footer */
<template>
  <div class="footer">
    <!-- 过关方式 -->
    <div class="game-fav-box center-flex-v">
      <div class="game-fav-item center-flex-v fav-box box-plr">
        <!-- footer-top-left 50% -->
        <slot name="footer-top-left"></slot>
      </div>
      <div class="game-fav-item center-flex-v" @click="chooseMultiple">
        <div class="f-28 c-86 box-plr">投</div>
        <div class="f-28 c-31 double-val flex-full center-flex">{{mutiples}}</div>
        <div class="c-31 f-28 box-plr">倍</div>
      </div>
    </div>
    <!-- 付款按钮 -->
    <div class="pay-wrapper center-flex-v">
      <div class="flex-full box-plr">
        <!-- footer-bot-left -->
        <slot name="footer-bot-left"></slot>
      </div>
      <div class="full-height center-flex linear-bg f-32 c-f pay-btn" @click="pay">付款</div>
    </div>
    <choose-mutiple class="index-102" :isKeyBoardShow="isKeyBoardShow" :mutiple="mutiples" @setMutiple="setMutiple" @hideChooseMutiple="hideChooseMutiple"></choose-mutiple>
  </div>
</template>

<script>
export default {
  name: 'BettingFooter',
  components: {
    //  选择倍数
    ChooseMutiple: () => import('quiz/components/footballlGame/betting/choose-mutiple.vue')
  },
  props: {
    //  投注倍数
    mutiples: {
      default: 1
    }
  },
  data () {
    return {
      isKeyBoardShow: false
    }
  },
  methods: {
    //  选择倍数
    chooseMultiple () {
      this.isKeyBoardShow = true
    },
    //  设置倍数
    setMutiple (number) {
      this.isKeyBoardShow = false
      this.$emit('setMutiple', number)
    },
    //  隐藏数字键盘
    hideChooseMutiple () {
      this.isKeyBoardShow = false
    },
    //  点击付款
    pay () {
      this.$emit('pay')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/var.styl';
.box-plr
  padding 0 box-plr
.footer
  position fixed
  left 0
  right 0
  bottom 0
  background-color #FFF
.game-fav-box
  height bottom1-height
.fav-box
  height 60px
.double-val
  background-color #F6F6F6
  border-radius 4px
  height 60px
.game-fav-item
  width 50%
.pay-wrapper
  height bottom2-height
.pay-btn
  width 240px
.index-102
  z-index 102
</style>

<style lang="scss" scoped>
.game-fav-box {
  position: relative;
  @include hairline-bottom(#D7D7D7);
}
</style>
