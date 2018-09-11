<template lang="html">
  <div class="loading-page" v-if="loading">
    <!-- <div style='width:100px;height:200px;background:red;'></div> -->
    <p>Loading<span class="text-loading">...</span></p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
.text-loading{
  display: inline-block;
}
.text-loading:after{
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis 3s infinite;
  -moz-animation: ellipsis 3s infinite;
  -o-animation: ellipsis 3s infinite;
  animation: ellipsis 3s infinite;
  content: "\2026";
}
@-webkit-keyframes ellipsis {
  0%{
    width: 0px;
  }
  100%{
    width: 100%;
  }
}
@-moz-keyframes ellipsis {
  0%{
    width: 0px;
  }
  100%{
    width: 100%;
  }
}
@-o-keyframes ellipsis {
  0%{
    width: 0px;
  }
  100%{
    width: 100%;
  }
}
@keyframes ellipsis {
  0%{
    width: 0px;
  }
  100%{
    width: 100%;
  }
}
</style>