/* 帮助 */
<template>
  <div>
    <arrow-tip v-model="value">
      <div class="c-31 f-26 ellipsis help-box">
        <div class="help-item center-flex-v" @click="viewAwardList">
          <img class="help-icon" src="@/domain/quiz/assets/footballgame/drawlottery.svg" alt="" srcset=""> 开奖详情
        </div>
        <!-- <div class="help-item center-flex-v">
         <img class="help-icon" src="@/domain/quiz/assets/footballgame/information.svg" alt="" srcset=""> 相关资讯
        </div> -->
        <div class="help-item center-flex-v" @click="viewPlayRule">
          <img class="help-icon" src="@/domain/quiz/assets/footballgame/plays.svg" alt="" srcset="">
          玩法规则
        </div>
      </div>
    </arrow-tip>
  </div>
</template>

<script>
import ArrowTip from 'quiz/components/footballlGame/arrow-tip.vue'
export default {
  name: 'PopupHelp',
  components: {
    //  带箭头的气泡提示
    ArrowTip
  },
  props: {
    value: {
      type: Boolean
    }
  },
  methods: {
    //  查看开奖信息
    viewAwardList () {
      this.$trace('jczqhhgg_help_kjxx')
      this.$router.push({ path: '/footballgame/award-list/detail' })
    },
    //  查看玩法规则
    viewPlayRule () {
      this.$trace('jczqhhgg_help_rules')
      this.$router.push({ path: '/footballgame/lottery/rule' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.help-box
  padding 0 26px
.help-item
  height 80px
.help-icon
  width 30px
  height 30px
  margin-right 30px
</style>

<style lang="scss" scoped>
.help-item {
  position: relative;
  @include hairline-bottom(#F6F6F6);
}
</style>
