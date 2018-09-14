<template lang="html">
  <div class="back-color font wrap">
    demo page
    <button type="button" name="button" @click="$trace('demo-event-trace', {a: 'asfs', b: 2})">trigger a trace</button>
    <button type="button" name="mask" @click="openLoading">loading</button>
    <div class="" @click="goto()">
      count-down
    </div>
  </div>

</template>

<script>
import toggleLoading from '@/components/loading'

export default {
  methods: {
    openLoading () {
      console.log('xxx...')
      toggleLoading(true)
    },
    goto () {
      this.$router.push({name: 'count-down'})
    }
  }
}
</script>

<style lang="less">
.back-color {
  background: @B2;
}
.wrap {
  height: 200px;
}
</style>

<style lang="scss">
.font {
  color: $color-l1;
  font-size: 50px;
}

</style>
