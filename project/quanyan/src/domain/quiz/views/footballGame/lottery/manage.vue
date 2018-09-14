<template lang="html">
  <div class="lottery-manage-page overflow-y f-28 column-flex">
    <div class="manage-contain bg-white">
      <div class="my-point handle-botton-color center-flex-b">
        <div class="c-f">
          <span class="f-28 my">我的积分</span>
          <br>
          <span class="point-amount f-60">1,000</span>
        </div>
        <span class="f-28 c-f exchange center-flex">兑换</span>
      </div>
      <div class="manage-handle center-flex-b">
        <div class="left center-flex-v" @click.stop="gotoPointRecordPage()">
          <img class="handle-icon"/>
          <div class="text">
            <p class="f-30 c-31">竞猜记录</p>
            <p class="c-ad f-24">查看全部记录</p>
          </div>
        </div>
        <div class="line hairline--right"></div>
        <div class="right center-flex-v" @click.stop="gotoPointDetailPage()">
          <img class="handle-icon"/>
          <div class="text">
            <p class="f-30 c-31">积分明细</p>
            <p class="c-ad f-24">查看资金流向</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rule',
  data () {
    return {
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
    gotoPointDetailPage () {
      this.$router.push({
        name: 'lotteryPointDetail'
      })
    },
    gotoPointRecordPage () {
      this.$router.push({
        name: 'lotteryPointRecord'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  $hairline-color:#D7D7D7;
  .hairline--right{
    position: relative;
    @include hairline-right($hairline-color)
  }
  .lottery-manage-page{
    height: 100%;
    width: 100%;
    min-height: 100vh;
    padding-top: 20px;
  }
   .my-point{
     margin: 12px 30px 0px 30px;
     padding-left: 46px;
     padding-right: 38px;
     padding-top: 32px;
     box-shadow: 0 2px 10px 0 rgba(229,0,17,0.35);
     border-radius: 4px;
     height: 200px;
   }
  .point-amount{
    margin-top: 6px;
  }
  .exchange{
    margin-top: 106px;
    margin-bottom: 44px;
    width: 106px;
    height: 50px;
    border: 1px solid #FFFFFF;
    border-radius: 2px;
  }
  .manage-handle{
    padding: 60px 30px 44px 30px;
  }
  .line{
    width: 2px;
    height: 70px;
  }
  .handle-icon{
    width: 70px;
    height: 70px;
    background: #D8D8D8;
    border: none;
    border-radius: 100%;
  }
  .text{
    margin-left: 30px;
    p{
      margin: 0px;
      margin-top: 4px;
    }
  }
</style>
