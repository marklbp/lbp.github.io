<template lang="html">
  <div class="my-lottery-point-page overflow-y">
    <p class="c-86 f-24 top-tip">货币汇率：1元余额=10积分=100积分</p>
    <div class="order-content bg-white">
      <div class="top-line handle-botton-color"></div>
      <div class="content-contain">
        <div class="center-flex-b c-31 p-b-30 hairline--bottom">
          <span class="f-28">订单金额</span>
          <span class="f-26">200 积分</span>
        </div>
        <div class="content-detail hairline--bottom">
          <div class="center-flex-b balance">
            <span class="c-31 f-28 center-flex-v">积分余额<span class="c-86 f-24 margin-r-16">(90积分)</span></span>
            <span class="c-f0 f-26">-90 积分</span>
          </div>
          <div class="center-flex-b discount">
            <span class="c-31 f-28 center-flex-v">积分抵扣<span class="c-86 f-24 margin-r-16">(积分可抵扣订单金额10%)</span></span>
            <span class="c-f0 f-26">-90 积分</span>
          </div>
        </div>
        <div class="center-flex-v c-31 apply-count">
          <span class="f-28">还需支付：</span>
          <span class="f-40">90</span>
          <span class="f-28">积分</span>
        </div>
      </div>
    </div>
    <div class="center-flex-b apply-contain bg-white">
      <div class="left c-31 center-flex-v">
        <span class="f-40">90</span>
        <span class="f-26 point">积分</span>
      </div>
      <button class="handle-botton-color center-flex c-f f-32" @click.stop="confirmApply">确认支付</button>
    </div>
    <div class="apply-success-toast center-flex absolute-view" v-if="showApplySuccess">
      <div class="toast-contain column-flex center-flex-v">
          <img class="success-icon"/>
          <span class="f-34 c-f text">支付成功</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      sign: true,
      recordList: [1, 2],
      showApplySuccess: false
    }
  },
  mounted () {
  },
  methods: {
    confirmApply () {
      this.$store.dispatch('applyLotteryPoint', {}).then(res => {
        this.showApplySuccess = true
        setTimeout(() => {
          this.showApplySuccess = false
        }, 3000)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  $hairline-color:#e0e0e0;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .my-lottery-point-page{
    height: 100%;
    min-height: 100vh;
  }
  .top-tip{
    margin: 0px;
    padding-left: 56px;
    padding-top: 28px;
  }
  .p-b-30{
    padding-bottom: 30px;
  }
  .margin-r-16{
    margin-left: 16px;
  }
  .order-content{
    margin: 0px 28px;
    margin-top: 22px;
    background: #FFFFFF;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.12);
    border-radius: 2px;
    margin-bottom: 300px;
  }
  .top-line{
    height: 6px;
    border-radius: 2px 2px 0px 0px;
  }
  .content-contain{
    padding: 30px;
  }
  .content-detail{
    padding-top: 20px;
    padding-bottom: 30px;
  }
  .balance{
    padding-bottom: 40px;
  }
  .apply-count{
    margin-top: 22px;
    justify-content: flex-end;
  }
  .apply-contain{
    height: 100px;
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: 0px;
    .left{
      padding-left: 30px;
    }
    .point{
      margin-left: 10px;
    }
    button{
      border: none;
      width: 240px;
      height: 100%;
    }
  }
  .toast-contain{
    height: 224px;
    width: 232px;
    opacity: 0.7;
    background: #000000;
    border-radius: 20px;
    .text{
      margin-top: 30px;
    }
  }
  .success-icon{
    margin-top: 40px;
    height: 80px;
    width: 80px;
  }
</style>
