<template>
  <div class="f-28 c-f">
    <div v-if="ftChampionItemList && ftChampionItemList.length > 0">
        <div class="center-flex-v header-box f-26">
        <div class="number-item center-flex">编号</div>
        <div class="ranks-item flex-full center-flex">球队</div>
        <div class="bonus-item center-flex">赔率</div>
        <div class="proba-item center-flex">概率</div>
      </div>
      <div class="center-flex-v header-box content-item" :class="{'content-item-active': item._selected, 'over-item': item._is_over}" v-for="(item, i) in ftChampionItemList" :key="i" @click="changeFtChampionSel(item._autoId)">
        <div class="number-item center-flex">{{item._is_over ? '停售' : (i + 1)}}</div>
        <div class="ranks-item flex-full center-flex-v">
          <img v-if="item.mainTeamPic && item.mainTeamPic !== ''" class="team-icon" :src="item.mainTeamPic | makeImg({code: 'CHAMPION_TEAMPIC_QUIZ'})" alt="" srcset="">
          {{item.mainTeam}}
        </div>
        <div class="bonus-item center-flex">{{item.bonus}}</div>
        <div class="proba-item center-flex">{{item.supportRate}}</div>
      </div>
    </div>
    <!-- 没有赛事 -->
    <div class="center-nodata-tip center-flex f-28 c-86" v-if="ajaxLoaded && ftChampionItemList.length < 1">
      亲，暂无可投注球队
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ChampionList',
  data () {
    return {
      //  猜冠军列表
      val: [],
      ajaxLoaded: false
    }
  },
  computed: {
    //  猜冠军列表
    ...mapState('WorldCupBetting', ['ftChampionItemList'])
  },
  created () {
    //  获取冠军列表数据
    this.getFtChampionInfoList()
  },
  methods: {
    ...mapMutations('WorldCupBetting', ['setFtChampion_model', 'setftChampionItemList', 'changeFtChampionSelect']),
    //  获取冠军列表数据
    getFtChampionInfoList () {
      let traceId = Math.random().toString(16).slice(2)
      let matchType = 2
      get('lotterycenter.getFtChampionInfoList', { matchQuery: { traceId, matchType } })
        .then(res => {
          this.ajaxLoaded = true
          let { content = [] } = res
          let model = (content && content.length > 0 && content[0]) || {}
          let { ftChampionItemList = [] } = model
          console.log(JSON.stringify(ftChampionItemList))
          ftChampionItemList.sort((matchA, matchB) => {
            return -(matchB.bonus - matchA.bonus)
          })
          //  存储商品信息
          this.setFtChampion_model(model)
          let overList = []
          let list = []
          //  停售的赛事放在最后面
          ftChampionItemList.map(item => {
            //  默认没有选中项
            item._selected = false
            //  设置赛事是否已结束
            item._is_over = !(`${item.matchStatus}` === '2')
            item._autoId = Math.random().toString(16).slice(2)
            if (item._is_over) {
              overList.push(item)
            } else {
              list.push(item)
            }
          })
          this.setftChampionItemList(list.concat(overList))
        })
        .catch((e) => {
          console.error(e)
          this.ajaxLoaded = true
        })
    },
    //  选择指定冠军
    changeFtChampionSel (_autoId) {
      this.changeFtChampionSelect(_autoId)
    }
  }
}
</script>

<style lang="stylus" scoped>
.number-item
  width 140px
.bonus-item
  width 150px
.proba-item
  width 150px
.content-item
  height 92px
  margin-top 25px
  background-image url('../../../assets/worldcup/list/list-normal-btn-bg.jpg')
  background-size 100% 100%
  background-repeat no-repeat
.content-item-active
  background-image url('../../../assets/worldcup/list/list-item-choosed-bg.jpg')
.team-icon
  width 40px
  height 40px
  margin-right 24px
.over-item
  opacity .5
.center-nodata-tip
  position fixed
  left 0
  right 0
  top 180px
  bottom 102px
</style>
