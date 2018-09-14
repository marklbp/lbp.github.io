<template lang="html">
  <div class="latest-explosion-detail-page overflow-y">
    <div>资讯详情页</div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      model: {}
    }
  },
  beforeMount () {
    this.$store.dispatch('getExplosionDetail').then(res => {
      this.entranceList = res
    })
  },
  mounted () {
  },
  methods: {
    gotoExplosionDetailPage () {
      console.log(123)
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
  .latest-explosion-detail-page{
  }
</style>
