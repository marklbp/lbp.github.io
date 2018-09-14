/* 混合过关比赛 */
<template>
  <div class="wrapper">
    <div class="box bg-f">
      <!-- 头部 -->
      <div class="header center-flex-v" @click="openContent">
        <div class="full-height flex-full center-flex-v f-26 c-31">
          <div class="p-r30">星期{{item._week}}</div><div>{{item._time}}</div>
        </div>
        <div class="full-height center-flex-v f-26 c-86">
          <div class="p-r40">共{{(item.ftMatchItemList && item.ftMatchItemList.length) || 0}}场比赛</div>
          <div class="center-flex arrow-icon-box" :class="{'shut-arrow-icon-box': !item._open}">
            <div class="top-icon"></div>
          </div>
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="content" :class="{'content-open': item._open}">
        <!-- 如果没有让胜负平，左边就基于整个item来定位 -->
        <div class="content-item" :class="{'relative-view': !content._haveGiveVictoryRate}" v-for="(content, index) in (item.ftMatchItemList || [])" :key="index">
          <!-- 第一行 -->
          <div class="center-flex-v p-b10">
            <div class="endtime-ph"></div>
            <div class="f-24 c-86 play-fav center-flex">让球</div>
            <div class="flex-full center-flex f-26 c-31">
              <div>{{content.mainTeam}}&emsp;VS&emsp;{{content.guestTeam}}</div>
            </div>
          </div>
          <!-- 如果有让胜负平，左边就基于下面两行来定位 -->
          <div class="sec-row-wrapper" :class="{'relative-view': content._haveGiveVictoryRate}">
            <!-- 截止时间 -->
            <div class="center-flex-v endtime-wrapper endtime-ph" :class="{'endtime-wrapper-noGiveVictoryRate': !content._haveGiveVictoryRate}">
              <div class="f-24 c-86">
                <div :class="teamClass[content.matchName]">{{content.matchName}}</div>
                <div>{{content.matchCode}}</div>
                <div>{{formateContent(content)._endTime}}止</div>
              </div>
            </div>
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
  </div>
</template>

<script>
import { getWeek } from 'quiz/tools/utils/index.js'
import teamClass from 'quiz/tools/utils/team-class.js'
import { mapMutations } from 'vuex'
export default {
  name: 'MixedClearanceGame',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      teamClass
    }
  },
  methods: {
    //  展开或者收起当天赛事列表
    openContent () {
      this.$emit('changeOpenContent', this.item._autoId)
    },
    //  格式化赛事信息
    formateContent (content = {}) {
      let model = {
        //  当前赛事是否有胜平负
        _haveVictoryRate: content.victoryRate && content.victoryRate !== '',
        //  当前赛事是否有让球胜平负
        _haveGiveVictoryRate: content.giveVictoryRate && content.giveVictoryRate !== '',
        //  让球数
        _giveBallNo: content.giveBallNo && parseInt(content.giveBallNo) > 0 ? `+${content.giveBallNo}` : content.giveBallNo,
        //  是否是让球
        _isGiceBall: content.giveBallNo && parseInt(content.giveBallNo) > 0,
        //  截止时间周几
        _endTimeWeek: content.payEndTime && content.payEndTime !== '' ? `周${getWeek(new Date(content.payEndTime))}` : '',
        //  截止时间hh:mm
        _endTime: content.payEndTime && content.payEndTime !== '' ? new Date(content.payEndTime)._Format('hh:mm') : ''
      }
      return {
        ...content,
        ...model
      }
    },
    //  选择赛事
    ...mapMutations('FBBetting', ['changeMatchSelect'])
  }
}
</script>

<style lang="stylus" scoped>
@import "../../styles/team.styl"
/* 截止时间左边的宽度 */
endtimewidth = 100px
.wrapper
  padding 0 25px
.box
  border-radius 4px
  box-shadow 0 2px 10px 0 #DDD
.header
  height 88px
  overflow hidden
  padding 0 25px
.full-height
  height 100%
.p-r30
  padding-right 30px
.p-r40
  padding-right 40px
.top-icon
  position relative
  top 5px
.content-item
  padding 20px 25px 36px
.endtime-ph
  box-sizing content-box
  width endtimewidth
  overflow hidden
  padding-right 20px
.play-fav
  width 60px
.sec-row-wrapper
  padding-left endtimewidth + 20
.endtime-wrapper
  position absolute
  left 0
  top 0
  bottom 0
  overflow hidden
.endtime-wrapper-noGiveVictoryRate
  left 25px
.bg-f6
  background-color #F6F6F6
.games-item
  height 70px
.p-b10
  padding-bottom 10px
.content
  max-height 0
  overflow hidden
  transition max-height .2s linear
.content-open
  max-height 10000px
.match-selected
  color #FFF
  background linear-gradient(to right,#F66637,#ED3B11)
.arrow-icon-box
  transform rotate(0)
  transition transform .2s linear
.shut-arrow-icon-box
  transform rotate(180deg)
</style>

<style lang="scss" scoped>
.header {
  position: relative;
  @include hairline-bottom(#E0E0E0);
}
.content {
  .content-item:not(:last-child) {
    position: relative;
    @include hairline-bottom(#E0E0E0);
  }
}
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
