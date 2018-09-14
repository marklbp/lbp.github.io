/* 冠亚军投注 */
<template>
  <div class="center-flex-v champion-item">
    <!-- 删除 -->
     <div class="del-box center-flex active-btn" @click="delSelectedMatch(content._autoId)">
      <div class="shut-icon c-f"></div>
    </div>
    <div class="flex-full center-flex-v">
      <!-- 主队 -->
      <div class="flex-full center-flex-v">
        <img class="team-icon m-r40" :src="content.mainTeamPic | makeImg({code: 'CHAMPION_TEAMPIC_QUIZ'})" alt="" srcset="">
        <div>{{content.mainTeam}}</div>
      </div>
      <div v-if="content.guestTeam && content.guestTeam !== ''">VS</div>
      <!-- 次队 -->
      <div class="flex-full center-flex-v align-r" v-if="content.guestTeam && content.guestTeam !== ''">
        <div>{{content.guestTeam}}</div>
        <img class="team-icon m-l40" :src="content.guestTeamPic | makeImg({code: 'CHAMPION_TEAMPIC_QUIZ'})" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'BettingChampion',
  props: {
    //  冠军，还是冠亚军
    type: {
      type: String,
      default: '1'
    },
    //  content
    content: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    ...mapMutations('WorldCupBetting', ['delSelectedChampion', 'delSelectedChampionSec']),
    //  删除项目
    delSelectedMatch (_autoId) {
      let method = this.type === '1' ? this.delSelectedChampion : (this.type === '2' ? this.delSelectedChampionSec : function () {})
      method(_autoId)
    }
  }
}
</script>

<style lang="stylus" scoped>
.del-box
  width 48px
  height 48px
  border-radius 50%
  background-color #DCDCDC
  margin-right 32px
.content-item
  padding 20px 26px 36px
  box-shadow 0 2px 10px 0 #DDD
  margin-top 32px
  border-raidus 4px
.team-icon
  width 40px
  height 40px
.champion-item
  height 100px
.align-r
  justify-content flex-end
.m-r40
  margin-right 40px
.m-l40
  margin-left 40px
</style>

<style lang="scss" scoped>
.champion-item {
  position: relative;
  @include hairline-bottom(#F1F1F1, dashed)
}
</style>
