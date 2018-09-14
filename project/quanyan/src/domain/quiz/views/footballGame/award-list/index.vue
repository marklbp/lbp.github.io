<template lang="html">
  <div class="award-list-page overflow-y">
    <div class="award-list-contain margin-t-20 bg-white">
      <div class="result center-flex-b" :class="index<awardList.length-1?'hairline--bottom':''" v-for="(award,index) in awardList" :key="index"
      @click.stop="gotoAwardDetail(award)">
        <div class="flex-full column-flex-b">
          <div class="type">
            <span class="guess-name c-31 f-32">竞猜足球</span>
            <span class="competition-time c-ad f-26">比赛日：2018-10-13</span></div>
          <div class="center-flex-v f-30 c-31 info">
            <div class="center-flex-v"><img class="team-icon" /><span class="team-name">西汉姆联</span></div>
            <span class="grade c-f0">1:0</span>
            <div class="center-flex-v"><img class="team-icon" /><span class="team-name">西汉姆联</span></div>
          </div>
        </div>
        <div class=""><div class="right-icon"></div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/services/request.js'
export default {
  name: 'Index',
  data () {
    return {
      awardList: [
        {name: '竞猜足球'},
        {name: '竞猜足球'},
        {name: '竞猜足球'}
      ]
    }
  },
  beforeMount () {
    get('lotterycenter.getFtMatchLotteryList').then(res => {
      this.awardList = res
    })
  },
  mounted () {
  },
  methods: {
    gotoAwardDetail (award) {
      console.log('1123')
      this.$router.push({
        name: 'AwardDetail',
        params: { id: 1 }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  p{
    margin: 0px;
  }
  $hairline-color:#e8e8e8;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .latest-explosion-page{
    height: 100%;
    min-height: 100vh;
  }
  .award-list-contain{
    margin-bottom: 50px;
    .result{
      height: 160px;
      padding: 24px 32px;
    }
    .type{
      display: flex;
      align-items: flex-end;
    }
    .info{
      margin-top: 20px;
    }
    .team-icon{
      width: 38px;
      height: 38px;
      margin-right: 24px;
    }
    .competition-time{
      margin-left: 24px;
    }
    .grade{
      margin: 0px 30px;
    }
  }
</style>
