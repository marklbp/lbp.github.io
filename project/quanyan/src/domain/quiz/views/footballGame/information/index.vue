<template lang="html">
  <div class="latest-explosion-page overflow-y">
    <div class="latest-explosion-contain margin-t-20 bg-white padding-lr-30">
      <div class="explosion center-flex-b" :class="index<entranceList.length-1?'hairline--bottom':''" v-for="(explosion,index) in entranceList.length" :key="index"
      @click.stop="gotoExplosionDetailPage(explosion)">
        <div class="flex-full column-flex-b explosion-text">
          <p class="ellipsis2 f-30 c-31">按属地阿斯蒂阿金斯欧戴斯对爱USD欧艾斯藕带实地拉斯断丝UIuaiosduioasudioa</p>
          <div class="flex-b">
            <p class="author f-24 c-ac">中呗</p>
            <p class="time f-24 c-ac">12-05 12:23</p>
          </div>
        </div>
        <img class="explosion-icon"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      entranceList: [
        {name: '竞猜足球'},
        {name: '竞猜足球'},
        {name: '竞猜足球'}
      ],
      pageNo: 1,
      enableLoadMore: true
    }
  },
  beforeMount () {
    this.$store.dispatch('getExplosionList').then(res => {
      this.entranceList = res
    })
  },
  mounted () {
  },
  methods: {
    loadMore () {
      if (this.enableLoadMore) {
        this.pageNo++
        this.updateExplosionList()
      }
    },
    updateExplosionList () {
      let requestParam = {
        pageNo: this.pageNo,
        pageSize: 10
      }
      this.$store.dispatch('getExplosionList', requestParam).then(res => {
        if (res && res.content && res.content.length > 0) {
          this.entranceList = this.entranceList.concat(res.content[0])
        } else {
          this.enableLoadMore = false
        }
      })
    },
    gotoExplosionDetailPage () {
      this.$router.push({
        name: 'LastestInformationDetail',
        params: { id: 1 }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .padding-lr-30{
    padding-right: 30px;
    padding-left: 30px;
  }
  p{
    margin: 0px;
  }
  $hairline-color:#e8e8e8;
  .hairline--bottom{
    position: relative;
    @include hairline-bottom($hairline-color)
  }
  .latest-explosion-page{
  }
  .latest-explosion-contain{
    margin-bottom: 50px;
    .explosion{
      height: 220px;
      padding: 24px 0px;
    }
    .explosion-text{
      height: 100%;
    }
    .explosion-icon{
      margin-left: 30px;
      width: 220px;
      height: 160px;
    }
  }
</style>
