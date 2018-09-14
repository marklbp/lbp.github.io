<template lang="html">
  <div class="award-detail-page column-flex">
    <div class="rule-notice c-f0 f-22 center-flex-v">
      官方开售截止赔率非中奖赔率，用户奖金以购买赔率为准。
    </div>
    <div class="filter-tab-caontain center-flex-b">
      <p class="f-28 c-86"><span class="date">{{selectedDate}}</span><span class="match-count">共{{this.awardDetailList.length}}场比赛</span></p>
      <img class="select-dateicon" src="../../../assets/footballgame/select-date.svg" @click.stop="showFilterPopupHandler()"/>
    </div>
    <div class="award-detail-list-contain flex-full">
      <div class="tab-content-contain column-flex">
        <div class="bg-white tab-title-item center-flex-b f-24 c-31 hairline--bottom" v-if="awardDetailList.length > 0 && finished">
          <p class="center-flex">胜平负</p>
          <p class="center-flex">让球胜平负</p>
          <p class="center-flex">比分</p>
          <p class="center-flex">总进球</p>
          <p class="center-flex">半全场</p>
        </div>
        <div class="tab-body-content overflow-y flex-full">
          <div class="match-detail-item bg-white" :class="index<awardDetailList.length-1?'hairline--bottom':''"
             v-for="(awardDetail,index) in awardDetailList" :key="index">
          <div class="title-info center-flex-v f-28 c-31">
            <div class="width-20 center-flex timer-no f-24">
              <p class="text-center">
                <span class="c-86">{{awardDetail.matchCode}}</span><br>
                <span class="" :class="awardDetail.leagueName.indexOf('联赛')>-1?'c-44':'c-d7'">{{awardDetail.leagueName}}</span>
              </p>
            </div>
            <div class="width-20 team-name center-flex font-b">
              {{awardDetail.hostTeamName}}
            </div>
            <div class="width-40 center-flex match-result">
              <span class="c-f0">{{awardDetail.fullScore}}<span class="c-86 point"> (半{{awardDetail.halfScore}})</span></span>
            </div>
            <div class="width-20 center-flex team-name font-b">
              {{awardDetail.visitingTeamName}}
            </div>
          </div>
          <div class="match-content-tab c-31 f-24 bg-f6">
            <div class="match-tab-t hairline--bottom-f center-flex-v">
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.flatResult}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.letFlatResult}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.scoreResult}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.totalScoreResult}}球</div>
              <div class="center-flex width-20">{{awardDetail.halffullFlatResult}}</div>
            </div>
            <div class="match-tab-info center-flex-v">
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.flatBonus}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.letFlatBonus}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.scoreBonus}}</div>
              <div class="center-flex width-20 hairline--right-f">{{awardDetail.totalScoreBonus}}</div>
              <div class="center-flex width-20">{{awardDetail.halffullFlatBonus}}</div>
            </div>
          </div>
        </div>
          <div class="absolute-view column-flex center-flex-h c-86 f-28" v-if="awardDetailList.length < 1 && finished">
            <img class="empty-match-logo" src="../../../assets/default_page_lists@3x.png"/>
            <p class="text-center">亲，今日暂无开奖赛事</p>
          </div>
        </div>
      </div>
      <div class="wrapper" @touchmove.prevent v-show="showFilter">
        <div class="mask" @click.stop="hideFilterPopupHandler"></div>
        <div class="choose-wrapper" :class="{'show-choose-wrapper':showContnet}">
          <template v-for="(name,index) in filterDateList">
            <div class="center-flex-v m-t24 f-26 c-31" :key="index" v-if="index%3==0 && filterDateList.length>0">
              <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(index)" :class="{choosed: filterDateList[index].selected}">
                {{filterDateList[index].dateText}}
                <RBChoosed v-if="filterDateList[index].selected"></RBChoosed>
              </div>
              <div class="place-w24"></div>
              <div class="flex-full" v-if="!filterDateList[index + 1]"></div>
              <div  v-else class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(index + 1)" :class="{choosed: filterDateList[index+1].selected}">
                {{filterDateList[index + 1].dateText}}
                <RBChoosed v-if="filterDateList[index+1].selected"></RBChoosed>
              </div>
              <div class="place-w24"></div>
              <div class="flex-full" v-if="!filterDateList[index+2]"></div>
              <div v-else class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(index + 2)" :class="{choosed: filterDateList[index+2].selected}">
                {{filterDateList[index + 2].dateText}}
                <RBChoosed v-if="filterDateList[index+2].selected"></RBChoosed>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
import RBChoosed from 'quiz/components/footballlGame/rb-choosed.vue'
export default {
  name: 'Index',
  components: {
    RBChoosed
  },
  data () {
    return {
      awardDetailList: [],
      matchs: [
        {name: '竞猜足球'},
        {name: '竞猜足球'},
        {name: '竞猜足球'}
      ],
      showFilter: false,
      showContnet: false,
      matchNames: [1, 2, 3, 4],
      //  临时存放赛事过滤条件
      //  筛选过后赛事场数
      matchCount: 0,
      filterDateList: [],
      selectDateList: [],
      selectedDate: '',
      pageNo: 1,
      enableLoadMore: true,
      finished: false
    }
  },
  watch: {
    //  监听过滤弹窗显示与否
    showFilter: {
      immediate: true,
      handler: function (val) {
        //  控制动画
        let timer = requestAnimationFrame(() => {
          this.showContnet = val
          cancelAnimationFrame(timer)
        })
        // 初始化数据
        if (val) this.filterDateList = [...this.filterDateList]
      }
    }
  },
  beforeMount () {
    this.$trace('jczqkjxx_homepage')
    this.initFilterDateList()
    this.updatePublicAwardList()
  },
  mounted () {
  },
  methods: {
    updatePublicAwardList () {
      this.finished = false
      let matchDateList = this.selectDateList.toLocaleString()
      let requestParam = {
        traceId: '123123',
        matchDateList
      }
      get('lotterycenter.getFtMatchLotteryList', {matchLotteryQueryInfo: requestParam}).then(res => {
        if (res && res.content && res.content.length > 0 && res.content[0].ftLotteryRecordInfoList) {
          this.awardDetailList = res.content[0].ftLotteryRecordInfoList
          console.log(this.awardDetailList)
        } else {
          this.awardDetailList = []
        }
        this.finished = true
      })
    },
    initFilterDateList () {
      var curtimestamp = Date.now()
      this.filterDateList = []
      for (let i = 0; i < 10; i++) {
        let timestamp = curtimestamp - i * 24 * 3600 * 1000
        let time = new Date(timestamp)
        let month = time.getMonth() + 1
        let date = time.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        let selected = false
        if (i === 0) {
          selected = true
        }
        let dateText = time.getFullYear() + '-' + month + '-' + date
        let reqParam = time.getFullYear() + month + date
        this.filterDateList.unshift({timestamp, dateText, selected, reqParam})
      }
      this.selectedDate = this.filterDateList[9].dateText
      this.selectDateList.push(this.filterDateList[9].reqParam)
    },
    showFilterPopupHandler () {
      this.showFilter = !this.showFilter
    },
    hideFilterPopupHandler () {
      this.showFilter = false
    },
    //  点击具体某一项
    selectItem (sindex) {
      this.selectDateList = []
      this.filterDateList.map((date, index) => {
        if (index === sindex) {
          date.selected = true
          this.selectedDate = date.dateText
          this.selectDateList.push(date.reqParam)
        } else {
          date.selected = false
        }
        return date
      })
      this.updatePublicAwardList()
      this.hideFilterPopupHandler()
    }
  }
}
</script>
<style lang="stylus" scoped>
  /* 顶部高度 */
  .wrapper
    position absolute
    left 0
    right 0
    top 0
    bottom 0
  .mask
    position absolute
    left 0
    top 0
    bottom 0
    right 0
    background-color rgba(0, 0, 0, .6)
    z-index 1
  .choose-wrapper
    padding 22px 36px
    background-color #FFF
    position relative
    z-index 2
    transform scaleY(0)
    transition transform .2s linear
    transform-origin center top
  .show-choose-wrapper
    transform scaleY(1)
  .place-w24
    width 24px
  .choose-item
    height 60px
  .btn-item
    height 80px
    margin-top 20px
  .m-t24
    margin-top 24px
  .bg-f6
    background-color #F6F6F6
  .m-t20
    margin-top 20px
</style>

<style lang="scss" scoped>
  .width-33{
    width: 33.3%;
  }
  .choose-bor {
    position: relative;
    @include hairline(#DBDBDB, 4px);
  }
  .choosed {
    color: #F04A1E;
    position: relative;
    @include hairline(#F04A1E, 4px);
    background-color: #FFF;
  }
</style>
<style lang="scss" scoped>
  p{
    margin: 0px;
  }
  $hairline-color:#e8e8e8;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  $hairline-color-f:#ffffff;
  .hairline--bottom-f{
    position: relative;
    @include hairline-bottom($hairline-color-f)
  }
  .hairline--right-f{
    position: relative;
    @include hairline-right($hairline-color-f)
  }
  .award-detail-page{
    .hairline--bottom::after{
      border-width: 3px;
    }
    .hairline--bottom-f::after{
      border-width: 3px;
    }
    .hairline--right-f::after{
      border-width: 3px;
    }
    height: 100%;
    min-height: 100vh;
  }
  /*空开奖信息Icon*/
  .empty-match-logo{
    margin-top: -250px;
    height: 300px;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
  }
  .rule-notice{
    height: 56px;
    padding-left: 30px;
    background: #FEF2EF;
  }
  .filter-tab-caontain{
    height: 84px;
    padding: 0px 30px;
    .match-count{
      margin-left: 30px;
    }
    .select-dateicon{
      height: 28px;
      width: 34px;
    }
  }
  .tab-body-content{
    padding-bottom: 100px;
  }
  .award-detail-list-contain{
    position: relative;
    .tab-content-contain{
      z-index: 1;
      max-height: 100%;
      position: absolute;
      top: 0px;
      bottom: 0px;
      width: 100%;
      left: 0px;
    }
    .tab-title-item{
      height: 80px;
      padding: 0px 30px;
      p{
        height: 100%;
        width: 20%;
      }
    }
  }
  .width-20{
    width: 20%;
  }
  .width-40{
    width: 40%;
  }
  .c-d7{
    color: #D756FF;
  }
  .c-44{
    color: #449BFF;
  }
  .bg-f6{
    background-color: #f6f6f6;
  }
  .match-detail-item{
    height: 268px;
    padding: 0px 24px;
  }
  .title-info{
    height: 98px;
    .point{
      margin-left: 8px;
    }
  }
  .match-tab-t,.match-tab-info{
    div{
      height: 70px;
    }
  }
</style>
