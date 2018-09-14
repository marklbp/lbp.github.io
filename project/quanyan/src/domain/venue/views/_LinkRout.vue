<template lang="html">
    <div class="linkRout">
        <cityChoose :catchData="catchData" :data="cityData"></cityChoose>
    </div>
</template>
<script>
import { WEB_ROOT } from '@/constants'
export default {
  name: 'linkRout',
  data () {
    return {
    }
  },
  mounted () {
    const cityCode = this.$route.params.cityCode
    const categoryId = this.$route.params.categoryId
    const isPublic = this.$route.params.ispublic
    if (isPublic.toString() === '0') {
      this.$router.replace(
        {
          path: '/home/' + cityCode + '/' + categoryId
        })
    } else if (isPublic.toString() === '1') {
      window.location.replace(WEB_ROOT + '/alauda/#/recommendPlaceList/' + cityCode + '/' + categoryId)
    }
  }
}
</script>

<style lang="scss">
    /*@import "../common/common";*/
    .linkRout{
        background: #ffffff;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
    }
</style>
