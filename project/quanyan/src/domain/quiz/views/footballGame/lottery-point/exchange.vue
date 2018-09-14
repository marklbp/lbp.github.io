<template lang="html">
  <div class="exchange-lottery-point-page overflow-y">
    <div class="point-caontain bg-white">
      <div class="top-title f-26 center-flex-b">
        <span class="c-31 ">兑换金额</span>
        <span class="c-86" v-if="sign">可兑出为400积分</span>
        <span class="c-86" v-else>积分余额500，其中可兑出为400</span>
      </div>
      <div class="center-flex-b hairline--bottom exchange-point">
        <span class="f-60" v-if="sign">400积分</span>
        <span class="f-30 c-ad" v-else>100积分起</span>
        <span class="c-f0 f-26">全部兑换</span>
      </div>
      <div class="able-change-point f-26">
        <span class="c-86">可兑换余额：</span><span class="c-f0">0元</span>
      </div>
    </div>
    <div class="exchange-tip f-24 c-86">
      1. 积分可兑换平台余额，100积分起兑，100积分=1元。<br>
      2. 可兑出积分为竞猜中奖后返奖积分。
    </div>
    <button class="exchange-handle handle-botton-color text-center c-f f-32" @click.stop="exchangeHandler">兑换</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      sign: true,
      model: {}
    }
  },
  beforeMount () {
    this.$store.dispatch('getMyLotteryPointManageModel').then(res => {
      this.model = res
    })
  },
  mounted () {
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
  .exchange-lottery-point-page{
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
