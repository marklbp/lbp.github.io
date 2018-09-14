<template lang="html">
  <div class="head">
    home 1127

    <img class="banner" src="//imgdatabasetest.yingheying.com/80829b57ab0a4106b9c9825c63d6e065.jpeg?x-oss-process=image/format,webp" />
    <div class="">
      <img src="../assets/alipay.png" />
      <img src="../assets/canlendar.png" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import lazi from 'lazi'
import validator from '@jiubao/vue-validator/dist/vue-validator.es'

export default {
  mounted () {
    console.log('aaa.bbb')
    console.log('lodash: ', _)
    console.log(lazi)
    var o1 = Object.assign({}, {a: 2}, {b: 3})
    console.log(o1)
    console.log([1, 2, 3].includes(1))
    console.log(validator)
  }
}
</script>

<style lang="scss">
img.banner {
  width: 750px;
}
.head {
  color: $color-f2;
}

</style>
