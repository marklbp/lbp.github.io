/* 比赛投注 */
<template>
  <div class="center-flex-v">
    <div class="del-box center-flex active-btn" @click="delSelectedMatch(content._autoId)">
      <div class="shut-icon c-f"></div>
    </div>
    <div class="flex-full">
       <div class="content-item bg-f">
          <!-- 第一行 -->
          <div class="center-flex-v p-b10">
            <div class="endtime-ph"></div>
            <div class="f-24 c-86 play-fav center-flex">让球</div>
            <div class="flex-full center-flex f-26 c-31">
              <div>{{content.mainTeam}}&emsp;VS&emsp;{{content.guestTeam}}</div>
            </div>
          </div>
          <div class="sec-row-wrapper">
            <!-- 比赛信息 -->
            <div class="games-box bg-f6">
              <!-- 胜平负 -->
              <div class="games-item center-flex-v f-24 c-31">
                <div class="play-fav f-28 c-31 center-flex games-bor full-height">0</div>
                <!-- 没有胜平负玩法 -->
                <template v-if="formateContent(content)._haveVictoryRate">
                  <div class="flex-full games-bor full-height center-flex" :class="{'match-selected': content._victory_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_victory_selected'})">主胜{{content.victoryRate}}</div>
                  <div class="flex-full games-bor full-height center-flex" :class="{'match-selected': content._flat_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_flat_selected'})">平{{content.flatRate}}</div>
                  <div class="flex-full full-height center-flex"  :class="{'match-selected': content._defeat_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_defeat_selected'})">客胜{{content.defeatRate}}</div>
                </template>
                <div class="flex-full center-flex f-24 c-31" v-else>
                  暂未开盘胜平负玩法
                </div>
              </div>
              <!-- 让胜平负 -->
               <div class="games-item center-flex-v f-24 c-31" v-if="formateContent(content)._haveGiveVictoryRate">
                <div class="play-fav f-28 c-31 center-flex games-bor full-height" :class="formateContent(content)._isGiceBall ? 'c-f0' : 'c-018'">{{formateContent(content)._giveBallNo}}</div>
                <div class="flex-full games-bor full-height center-flex" :class="{'match-selected': content._givevictory_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_givevictory_selected'})">主胜{{content.giveVictoryRate}}</div>
                <div class="flex-full games-bor full-height center-flex" :class="{'match-selected': content._giveflat_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_giveflat_selected'})">平{{content.giveFlatRate}}</div>
                <div class="flex-full full-height center-flex" :class="{'match-selected': content._givedefeat_selected}" @click="changeMatchSelect({_autoId: content._autoId, key: '_givedefeat_selected'})">客胜{{content.giveDefeatRate}}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'BettingGame',
  props: {
    //  一个赛事
    content: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    //  格式化赛事信息
    formateContent (content = {}) {
      let model = {
        //  当前赛事是否有胜平负
        _haveVictoryRate: content.victoryRate && content.victoryRate !== '',
        //  当前赛事是否有让球胜平负
        _haveGiveVictoryRate: content.giveVictoryRate && content.giveVictoryRate !== '',
        //  是否是让球
        _isGiceBall: content.giveBallNo && parseInt(content.giveBallNo) > 0,
        //  让球数
        _giveBallNo: content.giveBallNo && parseInt(content.giveBallNo) > 0 ? `+${content.giveBallNo}` : content.giveBallNo
      }
      return {
        ...content,
        ...model
      }
    },
    //  选择赛事
    //  删除赛事
    ...mapMutations('FBBetting', ['changeMatchSelect', 'delSelectedMatch'])
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
.endtime-ph
  box-sizing content-box
  width endtimewidth
  overflow hidden
  padding-right 20px
.play-fav
  width 60px
.sec-row-wrapper
  position relative
  padding-left endtimewidth + 20
.endtime-wrapper
  position absolute
  left 0
  top 0
  bottom 0
  overflow hidden
.bg-f6
  background-color #F6F6F6
.games-item
  height 70px
.p-b10
  padding-bottom 10px
.match-selected
  color #FFF
  background linear-gradient(to right,#F66637,#ED3B11)
</style>

<style lang="scss" scoped>
.games-box {
  .games-bor {
    position: relative;
    @include hairline-right(#FFF);
  }
  .games-item:first-child {
    position: relative;
    @include hairline-bottom(#FFF);
  }
}
</style>
