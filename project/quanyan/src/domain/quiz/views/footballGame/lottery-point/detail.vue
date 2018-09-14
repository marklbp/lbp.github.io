<template lang="html">
  <div class="detail-lottery-point-page overflow-y">
    <div class="record-list margin-t-20">
      <div class="record bg-white" :class="index<recordList.length-1?'hairline--bottom':''" v-for="(record,index) in recordList" :key="index">
        <div class="handle-type c-31 f-30 center-flex-b">
          <span>
            竞猜足球返奖
          </span>
          <span class="" :class="record.type===2?'c-f0':''">+10</span>
        </div>
        <div class="handle-detail c-86 f-26 center-flex-b">
          <span class="">04-22 20:30</span>
          <span class="">订单编号: 100000000</span>
        </div>
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
      recordList: [1, 2]
    }
  },
  beforeMount () {
    this.$store.dispatch('getMyLotteryPointManageModel').then(res => {
      this.recordList = res
    })
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  $hairline-color:#f4f4f4;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .record-lottery-point-page{
    height: 100%;
    min-height: 100vh;
  }
  .record{
    padding-top: 30px;
    padding-bottom: 26px;
    padding: 30px 34px 26px 40px;
  }
  .handle-detail{
    margin-top: 16px;
  }
</style>
