<template lang="html">
  <div class="guess-world-cup-detail-page column-flex">
    <div class="overflow-y flex-full">
      <div class="order-status-contain">
        <div class="bg-white">
          <div class="top-line handle-botton-color"></div>
          <div class="f-30 c-31 center-flex order-name">世界杯猜冠军</div>
          <div class="s-line center-flex-v">
            <div class="left-radus"></div>
            <div class="hairline--bottom-f1-d sline-contain"></div>
            <div class="right-radus"></div>
          </div>
          <div class="center-flex-h order-status-text center-flex">
            <div class="column-flex">
              <div class="center-flex-v">
                <img class="order-status-icon"/>
                <span :class="c-f0" v-if="orderStatusText=='恭喜中奖'||orderStatusText=='再接再厉'||orderStatusText=='待支付'">
                  {{orderStatusText}}
                </span>
                <span :class="c-ad" v-if="orderStatusText=='待开奖'">
                  {{orderStatusText}}
                </span>
              </div>
              <div class="status-time text-center">
              <span class="time c-31 f-30">
                <span class="f-26 text">剩余</span>24:10:04
              </span>
              </div>
            </div>
          </div>
        </div>
        <div class="order-apply-award center-flex-v">
          <div class="f-28 c-31 apply"><span class="apply-count c-86">订单金额</span>200积分</div>
          <div class="f-28 award" :class="win?'c-f0':'c-31'"><span class="award-count c-86">中奖金额</span>{{apply?win?'500积分':'未中奖':'---'}}</div>
        </div>
      </div>
      <p class="guess-info-title c-86 f-26">
        投注信息：<span class="type-name c-31">过关二串一</span>
      </p>
      <div class="order-detail-info-contain bg-white">
        <div class="tab-title -detial-item c-86 f-26 center-flex-b hairline--bottom-f6">
          <p class="width-40">球队</p>
          <p class="width-20">奖金</p>
          <p class="width-20">概率</p>
          <p class="width-20">彩票</p>
        </div>
        <div class="center-flex-b -guess-item" :class="index<recordList.length-1?'hairline--bottom-f1-d':''" v-for="(item,index) in recordList" :key="index">
          <div class="width-40 teams c-86 f-24">
            <p>巴西</p>
          </div>
          <div class="width-20 play-type c-31 f-24">
            <p>2.95</p>
          </div>
          <div class="width-20 guess-rate f-24" :class="win?'c-f0':'c-31'">
            <p>12.95%</p>
          </div>
          <div class="width-20 guess-rate f-24">
            <p class="c-ad" v-if="end">未开出</p>
            <p class="c-31" v-else-if="!win">8强</p>
            <p class="c-f0" v-else>冠军</p>
          </div>
        </div>
      </div>
      <div class="order-base-info bg-white f-26 c-ad margin-t-20">
        <p class="order-no">订单编号<span>10000000043523</span></p>
        <p class="create-time">下单时间<span>2017-04-18 18:00</span></p>
        <p class="end-time">截止时间<span>2017-04-18 18:00</span></p>
      </div>
    </div>
    <button class="handle-botton-color continue-apply c-f f-32 center-flex" @click.stop="clickBtnHandler">{{!end?'继续支付':'继续投注'}}</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      sign: true,
      win: true,
      end: true,
      apply: true,
      recordList: [1, 2, 3],
      detailModel: null
    }
  },
  computed: {
    isApply () {
      return false
    },
    openAward () {
      return false
    },
    orderStatusText () {
      let result = false
      let isApply = this.isApply && this.openAward
      if (isApply) {
        if (result === 1) {
          return '恭喜中奖'
        } else if (result === 2) {
          return '再接再厉'
        } else if (result === 3) {
          return '待开奖'
        }
      }
      return '待支付'
    },
    resultText () {
      let result = false
      let isApply = this.isApply && this.openAward
      if (isApply && result === 1) {
        return '500积分'
      } else if (isApply && result === 2) {
        return '未中奖'
      }
      return '---'
    }
  },
  beforeMount () {
    this.$store.dispatch('getWorldCupModel').then((res) => {
      this.detailModel = res
    })
  },
  mounted () {
  },
  methods: {
    clickBtnHandler (order) {
      console.log(11)
    }
  }
}
</script>
<style lang="scss" scoped>
  $hairline-color-f6:#f6f6f6;
  .hairline--bottom-f6{
    position: relative;
    @include hairline-bottom($hairline-color-f6,dashed)
  }
  $hairline-color-f1:#f1f1f1;
  .hairline--bottom-f1{
    position: relative;
    @include hairline-bottom($hairline-color-f1)
  }
  .hairline--bottom-f1-d{
    position: relative;
    @include hairline-bottom($hairline-color-f1,dashed)
  }
  .guess-world-cup-detail-page{
    height: 100%;
    max-height: 100vh;
  }
  .top-line{
    height: 6px;
    border-radius: 2px 2px 0px 0px;
  }
  .order-status-contain{
    margin:30px 24px 0px 24px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
    border-radius: 2px;
  }
  .order-name{
    height: 110px;
  }
  .order-timer{
    padding-bottom: 16px;
  }
  .s-line{
    height: 1px;
    .sline-contain{
      flex: 1;
      height: 1px;
    }
    .left-radus,.right-radus{
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 100%;
      background-color: #f4f4f4;
    }
    .left-radus{
      position: relative;
      left: -14px;
    }
    .right-radus{
      position: relative;
      left: 14px;
    }
  }
  .order-status-text{
    height: 160px;
    .order-status-icon{
      height: 42px;
      width: 38px;
      margin-right: 20px;
      border: none;
    }
  }
  .status-time{
    margin-top: 10px;
    .text{
      margin-right: 14px;
    }
  }
  .order-apply-award{
    height: 80px;
    .apply{
      margin-left: 34px;
      margin-right: 150px;
    }
    .apply-count,.award-count{
      margin-right: 20px;
    }
  }
  .guess-info-title{
    margin-top: 38px;
    margin-left: 24px;
  }
  .order-detail-info-contain{
    margin-top: 14px;
  }
  .tab-title{
    height: 74px;
    padding-left: 46px;
    padding-right: 56px;
    p{
      margin: 0px;
      text-align: center;
    }
  }
  .-guess-item{
    padding-left: 46px;
    padding-right: 56px;
    height: 100px;
    p{
      text-align: center;
      margin: 0px;
    }
  }
  .width-20{
    width: 20%;
  }
  .width-40{
    width: 40%;
  }
  .order-base-info{
    padding-top: 24px;
    padding-bottom: 34px;
    padding-left: 46px;
    margin-bottom: 110px;
    p{
      margin: 0px;
    }
    span{
      margin-left: 28px;
    }
  }
  .create-time{
    margin-top: 8px;
  }
  .continue-apply{
    height: 100px;
    width: 100%;
    border: none;
  }
</style>
