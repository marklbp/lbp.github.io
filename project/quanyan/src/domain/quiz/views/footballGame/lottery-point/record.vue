<template lang="html">
  <div class="record-lottery-point-page overflow-y">
    <div class="record-list margin-t-20">
      <div class="record bg-white" :class="index<recordList.length-1?'hairline--bottom':''" v-for="(record,index) in recordList" :key="index">
        <div class="handle-type c-31 f-30 center-flex-b">
          <span>
            {{record.type===1?'充值':record.type===2?'兑出积分':'积分兑入'}}
          </span>
          <span class="" :class="record.type===2?'c-l1':''">+10</span>
        </div>
        <div class="handle-detail c-86 f-26 center-flex-b">
          <span class="">2018-10-12</span>
          <span class="">余额: 155.00</span>
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
  },
  methods: {}
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
