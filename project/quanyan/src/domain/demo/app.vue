<template lang="html">
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'yhy-h5-demo',
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

img {
  width: 750px;
}
</style>
