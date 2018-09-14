/* 投注头部 */
<template>
   <!-- 头部 -->
    <div class="header">
      <div class="header-box box-plr full-height center-flex-v">
        <div class="flex-full center-flex clear-box header-item f-30 c-ad active-btn" @click="clears">
          <img class="clear-icon" src="@/domain/quiz/assets/delete.svg" alt="" srcset="">
          <div class="p-l20">清空重选</div>
        </div>
        <div class="header-place"></div>
        <div class="flex-full center-flex header-item f-30 c-f0 add-game-box active-btn" @click="addMatchs">
          <div class="add-icon"></div>
          <div class="p-l20">添加{{title || '赛事'}}</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'BettingHeader',
  props: {
    title: String
  },
  methods: {
    //  点击清除
    clears () {
      if (this.title) {
        this.$trace('jczqcgjtz_qkzx')
      } else {
        this.$trace('jczqhhggtz_qkzx')
      }
      this.$emit('clears')
    },
    //  添加赛事
    addMatchs () {
      if (this.title) {
        this.$trace('jczqcgjtz_tjqd')
      } else {
        this.$trace('jczqhhggtz_tjss')
      }
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/var.styl';
.header
  height top-height
  position fixed
  left 0
  right 0
  top 0
  background-color #f4f4f4
.box-plr
  padding 0 box-plr
.header-place
  width box-plr
.clear-icon
  width 40px
  height 40px
.header-item
  height 80px
.m-l20
  margin-left 20px
.p-l20
  padding-left 20px
</style>

<style lang="scss" scoped>
.clear-box {
  position: relative;
  @include hairline(#DBDBDB, 4px);
}
.add-game-box {
  position: relative;
  @include hairline(#F04A1E, 4px);
}
</style>
