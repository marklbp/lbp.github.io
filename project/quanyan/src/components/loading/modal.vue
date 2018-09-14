<template lang="html">
  <transition name="fade">
    <div class="loading-backdrop" v-show="visible">
      <div class="loading-box loading-default loading-middle">
        <bln-loading color="white" />
        <span class="loading-text">加载中...</span>
      </div>
    </div>
  </transition>
</template>

<script>
import Loading from './loading.vue'
export default {
  components: {
    [Loading.name]: Loading
  },
  props: {
    visible: {
      default: false
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.overflowHidden {
  overflow: hidden;
}
.loading-default {
  width: 240px;
  min-height: 240px;
  padding: 30px;
}
.loading-box {
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  color: #fff;
  font-size: 24px;
  line-height: 1.2;
  border-radius: 10px;
  word-break: break-all;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  transform: translate3d(-50%, -50%, 0);
  background-color: rgba(0, 0, 0, .7);
  z-index: 999999;
}
.loading-text {
  margin-top: 40px;
  display: inline-block;
  text-align: center;
}
.loading-backdrop {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: none;
  z-index: 999998;
}
</style>
