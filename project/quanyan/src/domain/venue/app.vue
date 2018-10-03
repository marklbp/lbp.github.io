<template lang="html">
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    console.log('app mounted...')
  }
}
</script>

<style lang="scss">
* {padding: 0; margin: 0;}

::placeholder {
  color: #ccc;
}
.head {
  font-size: 40px; /* no */
  background: $color-b2;
}

</style>
