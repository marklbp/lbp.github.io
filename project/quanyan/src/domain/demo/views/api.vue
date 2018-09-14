<template lang="html">
  <div class="">
  </div>

</template>

<script>
import {get} from '@/services/request'

export default {
  mounted () {
    var codes = ['YHY_JFSC_LBT', 'YHY_JFSC_YYW', 'YHY_JFSC_WLM']
    get('resourcecenter.getMultiBooths', { boothCodes: JSON.stringify(codes) }).then(res => {
      console.log('resourcecenter.getMultiBooths: ', res)
    })

    get('user.getSelfPhone').then(res => {
      console.log('user.getSelfPhone: ', res)
    })
  }
}
</script>

<style lang="css">
</style>
