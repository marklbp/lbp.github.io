/* 右下角打钩选中 */
<template>
  <div class="choosed-wrapper">
    <img class="ok-img" src="@/domain/quiz/assets/footballgame/ok.svg" alt="" srcset="">
  </div>
</template>

<script>
export default {
  name: 'RBChoosed'
}
</script>

<style lang="stylus" scoped>
.choosed-wrapper
  position absolute
  bottom 0
  right 0
  border-top 40px solid transparent
  border-right 40px solide #F04A1E
  border-bottom 40px solid #F04A1E
  border-left 40px solid transparent
.ok-img
  position absolute
  right 0
  top 20px
  width 20px
  height 20px
</style>
