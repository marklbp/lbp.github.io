<template lang="html">
  <div class="lottery-order-record-page column-flex absolute-view">
    <md-tab-bar
            :titles="tabTextList"
            :show-ink-bar="true"
            :ink-bar-length="40"
            @indexChanged="selectTabContent"
            :default-index="defaultSelectTabIndex"
    ></md-tab-bar>
    <div class="order-tab-content margin-t-20 bg-gray overflow-y flex-full p-b-30"
         v-infinite-scroll="loadMore" infinite-scroll-distance="400">
      <div class="order-item center-flex-b bg-white" :class="index<recordList.length-1?'hairline--bottom':''"
           v-for="(record,index) in recordList" :key="index" @click.stop="gotoGuessDetail(record)" >
        <div class="left">
          <p class="f-30 c-31">{{record.buyDesc}}</p>
          <p class="c-86 f-26 desc">{{record.buyDateText}}<span class="text">自购 {{record.usePoint}}积分</span></p>
        </div>
        <div class="right center-flex-v">
          <div class="f-26 c-86 center-flex-b column-flex">
            <p class="state">
              <!--<span v-if="record.status==0">全部</span>-->
              <span v-if="record.status==1">待开奖</span>
              <span class="c-f0" v-if="record.status==2">已中奖</span>
              <span v-if="record.status==3">未中奖</span>
            </p>
            <p class="c-f0" v-if="record.status==2">{{record.winPoint}}积分</p>
          </div>
          <div class="right-icon c-ad"></div>
        </div>
      </div>
      <div class="absolute-view center-flex f-28 c-86" v-if="recordList.length<1 && finished">
        <div class="column-flex" v-if="searchStatus<2">
          <span class="text-center">暂无投注记录</span>
          <span>请前往选择喜欢的彩种玩法</span>
        </div>
        <div class="column-flex" v-else>
          <span class="text-center">暂无{{searchStatus === 3?'未':''}}中奖订单</span>
          <span v-if="searchStatus === 2">再接再励下一个大奖就是你</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
import { TabBar } from 'mand-mobile'
export default {
  name: 'Index',
  components: {
    [TabBar.name]: TabBar
  },
  data () {
    return {
      tabTextList: ['全部', '待开奖', '已中奖', '未中奖'],
      sign: true,
      recordList: [],
      showApplySuccess: false,
      searchStatus: 0,
      pageNo: 1,
      enableLoadMore: true,
      finished: false,
      defaultSelectTabIndex: 0
    }
  },
  beforeMount () {
    this.$store.dispatch('getSelectTabIndex').then(res => {
      this.defaultSelectTabIndex = res
      this.searchStatus = res
      this.pageNo = 1
      this.updateOrderRecordList()
      this.$store.dispatch('saveSelectTabIndex', {selectTabIndex: 0})
    })
    this.$trace('jcorder_homepage')
  },
  mounted () {
  },
  methods: {
    loadMore () {
      console.log('loading more -------')
      if (this.enableLoadMore) {
        this.pageNo++
        this.updateOrderRecordList()
      }
    },
    selectTabContent (index) {
      if (this.searchStatus !== index) {
        this.recordList = []
        this.enableLoadMore = true
        this.pageNo = 1
        this.finished = false
        this.searchStatus = index
        this.updateOrderRecordList()
      }
      this.$store.dispatch('saveSelectTabIndex', {selectTabIndex: index})
    },
    updateOrderRecordList () {
      let requestParam = {
        status: this.searchStatus,
        pageNo: this.pageNo,
        pageSize: 10
      }
      this.enableLoadMore = true
      get('lotterycenter.getUserBuyRecordList', requestParam).then(res => {
        if (res && res.content && res.content.length > 0 && res.content[0].lotteryBuyRecordList) {
          let list = res.content[0].lotteryBuyRecordList.map(record => {
            let time = new Date(record.buyDate)
            let month = time.getMonth() + 1
            let date = time.getDate()
            let hour = time.getHours()
            let min = time.getMinutes()
            if (month < 10) {
              month = '0' + month
            }
            if (date < 10) {
              date = '0' + date
            }
            if (hour < 10) {
              hour = '0' + hour
            }
            if (min < 10) {
              min = '0' + min
            }
            let buyDateText = month + '-' + date + ' ' + hour + ':' + min
            record.buyDateText = buyDateText
            record.buyDesc = record.buyDesc.replace(/竞彩/, '竞猜')
            return record
          })
          this.recordList = this.recordList.concat(list)
          // this.recordList = this.recordList.concat(this.recordList)
        } else {
          this.enableLoadMore = false
        }
        this.finished = true
      })
    },
    gotoGuessDetail (record) {
      this.$router.push({
        name: 'lotteryOrderDetail',
        params: {
          id: record.id
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .lottery-order-record-page{
    .md-tab-title{
      font-size: 30px;
      color: #313131;
    }
    .active{
      color: #F04A1E !important;
    }
    .ink-bar{
      background-color: #F04A1E;
    }
  }
</style>
<style lang="scss" scoped>

  $hairline-color:#e0e0e0;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .lottery-order-record-page{
    .hairline--bottom::after{
      border-width: 3px;
    }
  }
  .p-b-30{
    padding-bottom: 30px;
  }
  .p-lr-30{
    padding-left: 30px;
    padding-right: 30px;
  }
  .margin-r-16{
    margin-left: 16px;
  }
  .order-item{
    p{
      margin: 0px;
    }
    height: 140px;
    padding: 30px 34px 22px 40px;
  }
  .left{
    .desc{
      margin-top: 16px;
    }
    .text{
      margin-left: 10px;
    }
  }
</style>
