<template lang="html">
  <div class="list">
    list
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  mounted () {
    console.log('lodash: ', _)
  }
}
</script>

<style lang="css">
.list {
  font-size: 50px;
  color: #aaa;
}
</style>
