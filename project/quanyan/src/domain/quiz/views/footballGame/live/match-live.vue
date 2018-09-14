<template lang="html">
  <div class="lottery-match-live-page absolute-view column-flex">
    <div class="fiter-bar-contain center-flex-b f-30 bg-white">
      <div class="title c-0">竞猜足球</div>
      <div class="is-live c-f0 center-flex-v" @click.stop="showLivingDialog">
        {{matchStatus==1?'未结束':'已结束'}}
        <div class="updown-icon" :class="showContentType==='isLiving'&&showFilter?'up':''">
        </div>
      </div>
      <div class="right center-flex-v c-31">
        <span class="" @click.stop="showTeamDialog">筛选</span>
        <span class="time" @click.stop="showTimeDialog">时间</span>
      </div>
    </div>
    <div class="live-list-contain flex-full overflow-y">
      <div class="">
        <div class="date-live-item" v-for="(liveList,indexDate) in matchLiveList" :key="indexDate">
        <p class="date-matchs-text center-flex-v f-28 c-86">
          {{liveList.dateStr}} <span class="total-match p-lr-30"> 共{{liveList.realMatchCount}}场比赛</span>
        </p>
        <div v-for="(live,index) in liveList.scoreLiveItemList" :key="index">
          <div class="live-list-item-detail bg-white center-flex"
             :class="index<liveList.scoreLiveItemList.length-1?'hairline--bottom':''" v-if="live.show">
            <div class="center-flex-b flex-full">
              <div class="left team-info column-flex center-flex-v">
                <img class="team-logo" :src="live.hostTeamLogo" v-if="live.hostTeamLogo"/>
                <p class="team-name f-28 c-31">{{live.hostTeam}}</p>
              </div>
              <div class="center match-info column-flex center-flex-h c-86 f-24">
                <p class="text-center">{{live.matchCode}} {{live.matchTime.substring(0,live.matchTime.length-3)}} {{live.leagueName}}</p>
                <p class="text-center match-point f-40 c-31">{{live.matchScore}}</p>
                <p class="text-center" :class="live.status==1?'c-f0':''">{{live.statusText}}</p>
              </div>
              <div class="right team-info column-flex center-flex-v">
                <img class="team-logo" :src="live.guestTeamLogo" v-if="live.guestTeamLogo"/>
                <p class="team-name f-28 c-31">{{live.guestTeam}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-live-list-contain c-86 center-flex p-tb-20 f-28" v-if="liveList.realMatchCount === 0">
          亲，当日无满足筛选条件的比赛直播
        </div>
      </div>
      </div>
      <div class="wrapper" @touchmove.prevent v-show="showFilter&&showContentType!=='team'">
        <div class="mask" @click.stop="hideFilterPopupHandler"></div>
        <div class="choose-wrapper" :class="{'show-choose-wrapper':showContnet}">
          <div v-if="showContentType==='time'">
            <template v-for="(name,index) in filterDateList">
              <div class="center-flex-v m-t24 f-26 c-31" :key="index" v-if="index%3==0 && filterDateList.length>0">
                <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectLiveDate(index)" :class="{choosed: filterDateList[index].selected}">
                  {{filterDateList[index].dateText}}
                  <RBChoosed v-if="filterDateList[index].selected"></RBChoosed>
                </div>
                <div class="place-w24"></div>
                <div class="flex-full" v-if="!filterDateList[index + 1]"></div>
                <div  v-else class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectLiveDate(index + 1)" :class="{choosed: filterDateList[index+1].selected}">
                  {{filterDateList[index + 1].dateText}}
                  <RBChoosed v-if="filterDateList[index+1].selected"></RBChoosed>
                </div>
                <div class="place-w24"></div>
                <div class="flex-full" v-if="!filterDateList[index+2]"></div>
                <div v-else class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectLiveDate(index + 2)" :class="{choosed: filterDateList[index+2].selected}">
                  {{filterDateList[index + 2].dateText}}
                  <RBChoosed v-if="filterDateList[index+2].selected"></RBChoosed>
                </div>
              </div>
            </template>
          </div>
          <div class="living-dialog center-flex-b f-26" v-else-if="showContentType==='isLiving'">
            <div class="live-state center-flex choose-bor choose-item bg-f6 relative-view" @click="selectLiveState(['1','2'])" :class="{choosed: matchStatus==1}">
              未结束
              <RBChoosed v-if="matchStatus==1"></RBChoosed>
            </div>
            <div class="live-state center-flex choose-bor choose-item bg-f6 relative-view" @click="selectLiveState(['3'])" :class="{choosed: matchStatus==3}">
              已结束
              <RBChoosed v-if="matchStatus==3"></RBChoosed>
            </div>
          </div>
          <div v-else-if="showContentType==='team'">
            <div class="center-flex-v">
              <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="selectAll">全&ensp;选</div>
              <div class="place-w24"></div>
              <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="reverseSelect">反&ensp;选</div>
              <div class="place-w24"></div>
              <div class="center-flex flex-full f-26 c-ad choose-bor choose-item" @click="selectFiveLeagues">五大联赛</div>
            </div>
            <template v-for="i in matchRows">
              <div class="center-flex-v m-t24 f-26 c-31" :key="i">
                <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3]) > -1}">
                  {{matchNames[(i - 1) * 3]}}
                  <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3]) > -1"></RBChoosed>
                </div>
                <div class="place-w24"></div>
                <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3 + 1])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 1]) > -1, 'black-item': matchNames.length < (i - 1) * 3 + 2}">
                  {{matchNames[(i - 1) * 3 + 1]}}
                  <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 1]) > -1"></RBChoosed>
                </div>
                <div class="place-w24"></div>
                <div class="center-flex flex-full choose-bor choose-item bg-f6 relative-view" @click="selectItem(matchNames[(i - 1) * 3 + 2])" :class="{choosed: temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 2]) > -1, 'black-item': matchNames.length < (i - 1) * 3 + 3}">
                  {{matchNames[(i - 1) * 3 + 2]}}
                  <RBChoosed v-if="temFilterMatchNames.indexOf(matchNames[(i - 1) * 3 + 2]) > -1"></RBChoosed>
                </div>
              </div>
            </template>
            <div class="text-center f-24 c-86 m-t20">
              共<span class="f-24 c-f0">{{matchCount}}</span>场比赛
            </div>
            <!-- 底部button -->
            <div class="center-flex-v">
              <div class="center-flex flex-full f-26 c-ad choose-bor btn-item" @click="clickCancel">取&ensp;消</div>
              <div class="place-w24"></div>
              <div class="center-flex flex-full f-26 choosed choose-ok-bor btn-item" @click="clickConfirm">确&ensp;认</div>
            </div>
          </div>
        </div>
      </div>
      <popup-filter class="index-101" @filterMatch="filterMatch" @hidePopup="hidePopup" v-model="showTeamFilter" :filterMatchNames="filterMatchNames" :matchNames="matchNames" :matchs="matchs"></popup-filter>
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
import RBChoosed from 'quiz/components/footballlGame/rb-choosed.vue'
import { showTip } from 'quiz/tools/utils/index.js'
import { FiveLeagues } from 'quiz/tools/contants/index.js'
export default {
  name: 'Index',
  components: {
    RBChoosed,
    PopupFilter: () => import('quiz/components/footballlGame/play/popup-filter.vue')
  },
  data () {
    return {
      showFilter: false,
      showTeamFilter: false,
      showContnet: true,
      showContentType: '',
      filterDateList: [],
      selectDateList: [],
      matchLiveList: [],
      matchs: [],
      matchCount: 0,
      //  赛事类型matchName
      matchNames: [],
      filterMatchCount: 20,
      //  筛选的赛事类型
      temFilterMatchNames: [],
      filterMatchNames: [],
      matchStatus: ['1', '2']
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
    },
    temFilterMatchNames: {
      immediate: true,
      handler: function (val) {
        let count = 0
        this.matchs.forEach(item => {
          let { matchName } = item
          if (val.includes(matchName)) count++
        })
        this.matchCount = count
      }
    }
  },
  created () {
    //  获取赛事列表数据
  },
  computed: {
    matchRows () {
      console.log(this.matchNames)
      let count1 = parseInt(this.matchNames.length / 3)
      let count2 = this.matchNames.length % 3 > 0 ? 1 : 0
      return count1 + count2
    }
  },
  beforeMount () {
    // this.updateOrderRecordList()
    this.initFilterDateList()
    this.initFilterTeamsList()
  },
  mounted () {
  },
  methods: {
    fromateLiveTime (state, date, time) {
      let text = ''
      if (state === 1) {
        let datetext = date + ' ' + time
        time = new Date(datetext)
        let second = parseInt(time.getTime() / 1000)
        let nowsecond = parseInt(Date.now() / 1000)
        let liveSecond = nowsecond - second
        let munites = parseInt(liveSecond / 60)
        if (munites < 1) {
          text = liveSecond + '″'
        } else {
          text = munites + '′' + (liveSecond - munites * 60) + '″'
        }
      } else if (state === 2) {
        text = '未开始'
      } else if (state === 3) {
        text = '已结束'
      } else if (state === 4) {
        text = '其他'
      }
      return text
    },
    showLivingDialog () {
      this.showFilter = true
      this.showTeamFilter = false
      this.showContentType = 'isLiving'
    },
    showTeamDialog () {
      this.showTeamFilter = true
      this.showFilter = false
      this.showContentType = 'team'
    },
    showTimeDialog () {
      this.showFilter = true
      this.showTeamFilter = false
      this.showContentType = 'time'
    },
    selectAll () {
      this.temFilterMatchNames = [...this.matchNames]
    },
    //  反选
    reverseSelect () {
      let arr = []
      this.matchNames.forEach(item => {
        if (!this.temFilterMatchNames.includes(item)) arr.push(item)
      })
      this.temFilterMatchNames = arr
    },
    //  选中五大联赛
    selectFiveLeagues () {
      let arr = []
      FiveLeagues.forEach(item => {
        if (this.matchNames.includes(item)) arr.push(item)
      })
      this.temFilterMatchNames = arr
    },
    //  取消
    clickCancel () {
      this.$emit('filterMatch', this.filterMatchNames)
    },
    //  确定
    clickConfirm () {
      if (this.matchCount < 1) {
        showTip('请至少选择一场比赛')
        return false
      }
      this.$emit('filterMatch', this.temFilterMatchNames)
    },
    initFilterDateList () {
      var curtimestamp = Date.now()
      this.filterDateList = []
      for (let i = 0; i < 5; i++) {
        let timestamp = curtimestamp + i * 24 * 3600 * 1000
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
        this.filterDateList.push({timestamp, dateText, selected, reqParam})
      }
      this.selectDateList.push(this.filterDateList[0].dateText)
    },
    initFilterTeamsList () {
      get('lotterycenter.getLeagueInfo', { leagueInfoQueryInfo: { traceId: '123' } }).then(res => {
        if (res && res.content && res.content.length > 0 && res.content[0].leagueList) {
          res.content[0].leagueList.forEach(item => {
            this.matchNames.push(item.leagueName)
            this.filterMatchNames = this.matchNames
          })
          this.updateMatchLiveList()
          console.log(this.matchNames)
        }
      })
    },
    updateMatchLiveList () {
      let matchDates = []
      this.filterDateList.forEach(date => {
        if (date.selected) {
          matchDates.push(date.dateText)
        }
      })
      let scoreLiveQuery = {
        matchStatus: this.matchStatus,
        matchDates,
        leagues: []
      }
      get('lotterycenter.getScoreLive', {scoreLiveQuery}).then(res => {
        this.matchs = []
        this.matchLiveList = []
        if (res && res.content && res.content.length > 0 && res.content[0].scoreLiveInfoList) {
          let list = res.content[0].scoreLiveInfoList.map(livelist => {
            livelist.scoreLiveItemList.map(live => {
              live.matchName = live.leagueName
              this.matchs.push(live)
              live.statusText = this.fromateLiveTime(live.status, livelist.dateStr, live.matchTime)
              return live
            })
            return livelist
          })
          this.matchLiveList = list
          console.log(list, this.matchs)
          this.filterOriginMatchList()
        }
      })
    },
    gotoGuessDetail (record) {
      this.$router.push({
        name: 'GuessDetail',
        params: {
          id: record.id
        }
      })
    },
    showFilterPopupHandler () {
      this.showFilter = !this.showFilter
    },
    hideFilterPopupHandler () {
      this.showFilter = false
    },
    //  点击具体某一项
    selectLiveDate (sindex) {
      this.filterDateList.map((date, index) => {
        if (index === sindex) {
          date.selected = !date.selected
        }
        return date
      })
      this.updateMatchLiveList()
      this.hideFilterPopupHandler()
    },
    selectLiveState (index) {
      this.matchStatus = index
      this.hideFilterPopupHandler()
      this.updateMatchLiveList()
    },
    selectItem (matchName) {
      let index = this.temFilterMatchNames.indexOf(matchName)
      if (index > -1) {
        this.temFilterMatchNames.splice(index, 1)
      } else {
        this.temFilterMatchNames.push(matchName)
      }
    },
    filterMatch (filters) {
      //  捕捉子组件提交的过滤赛事条件
      this.filterMatchNames = filters
      this.showTeamFilter = false
      this.filterOriginMatchList()
    },
    filterOriginMatchList () {
      this.matchLiveList.map(livelist => {
        let count = 0
        livelist.scoreLiveItemList.map(live => {
          if (this.filterMatchNames.includes(live.matchName)) {
            live.show = true
            count++
          } else if (this.filterMatchNames.length === 0) {
            live.show = true
            count++
          } else {
            live.show = false
          }
          return live
        })
        livelist.realMatchCount = count
        return livelist
      })
    },
    hidePopup () {
      this.showTeamFilter = false
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
  $hairline-color:#e0e0e0;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .updown-icon{
    margin-left: 20px;
    border-width: 10px 16px 0px 16px;
    border-color: #666666 #ffffff #ffffff #ffffff;
    border-style: solid;
  }
  .updown-icon.up{
    transform: rotate(180deg);
  }
  .lottery-match-live-page{
    max-height: 100vh;
    min-height: 100vh;
  }
  .fiter-bar-contain{
    height: 92px;
    padding-left: 40px;
    padding-right: 24px;
    .time{
      margin-left: 26px;
    }
  }
  .living-dialog{
    .live-state{
      height: 60px;
      width: 46%;
    }
  }
  .date-matchs-text{
    height: 78px;
    padding-left: 32px;
  }
  .live-list-contain{
    position: relative;
  }
  .live-list-item-detail{
    height: 180px;
    padding: 0px 80px;
    .team-logo{
      width: 80px;
      height: 56px;
      margin-bottom: 30px;
    }
  }
  .match-info{
    .match-point{
      padding: 4px 0px;
    }
  }
  .team-info{
    text-align: center;
    width: 120px;
    .team-name{
      width: 100%;
      text-align: center;
    }
  }
  .p-b-30{
    padding-bottom: 30px;
  }
  .p-lr-30{
    padding-left: 30px;
    padding-right: 30px;
  }
  .p-tb-20{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .margin-r-16{
    margin-left: 16px;
  }
  .empty-live-list-contain{
    width: 100%;
    height: 150px;
  }
</style>
