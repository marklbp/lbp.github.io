<template lang="html">
  <div class="get-lottery-point-page overflow-y">
    <div class="point-caontain bg-white">
      <div class="top-title f-26">
        <span class="c-31">积分金额</span>
      </div>
      <div class="center-flex-b hairline--bottom exchange-point">
        <input class="f-60 f-31" placeholder="至少兑换100积分"/>
        <p class="c-31 f-26">元</p>
      </div>
      <div class="able-change-point f-26">
        <span class="c-86">余额：</span><span class="c-f0">500元</span>
      </div>
    </div>
    <div class="exchange-tip f-24 c-86">
      注意事项：<br>
      1. 余额兑换积分后，积分未消费不可兑出，1元=100积分。单次至少兑换100
      积分。<br>
      2. 中奖积分可兑换为余额，如有问题请随时拨打客服电话：<br>
      {{mobile}}
    </div>
    <button class="exchange-handle handle-botton-color text-center c-f f-32" @click.stop="exchangeHandler">兑换</button>
  </div>
</template>

<script>
import { LotteryServiceTel } from 'quiz/tools/contants/index'
export default {
  name: 'Index',
  data () {
    return {
      sign: true,
      mobile: '',
      pointModel: 0
    }
  },
  mounted () {
    this.mobile = LotteryServiceTel
  },
  methods: {
    exchangeHandler () {
      this.$store.dispatch('exchangeBalanceToPoint', {}).then(res => {
        console.log(res)
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
  .get-lottery-point-page{
    height: 100%;
    min-height: 100vh;
  }
  .point-caontain{
    margin:24px;
    padding: 36px  28px 28px 40px;
  }
  .top-title{
    margin-bottom: 50px;
  }
  .exchange-point{
    padding-bottom: 40px;
    width: 100%;
    input{
      border: none;
      max-width: 80%;
    }
    input::placeholder{
      color: #adadad;
      font-size: 26px;
      vertical-align: middle;
    }
  }
  .able-change-point{
    padding-top: 20px;
  }
  .exchange-tip{
    padding: 0px 24px;
    padding-bottom: 400px;
    line-height: 40px;
  }
  .exchange-handle{
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 100px;
    border: none;
  }
</style>
