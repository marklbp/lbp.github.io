<template lang="html">
  <div class="">
    clearing...
  </div>
</template>

<script>
import cookie from 'js-cookie'

export default {
  mounted () {
    cookie.remove('_uid')
    cookie.remove('_wtk')
    cookie.remove('_openId')
  }
}
</script>

<style lang="css">
</style>
