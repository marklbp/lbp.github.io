<template>
  <div class="page-result">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="text">
      <slot name="text"></slot>
    </div>
    <div class="btns">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
  export default {name: 'page-result'}
</script>

<style lang="scss" scoped>
  .icon {
    padding-top: 259px;
    margin-bottom: 92px;
    text-align: center;
    img {
      width: 108px;
    }
  }
  .text {
    margin-bottom: 102px;
    line-height: 58px;
    font-size: 28px;
    color: #999;
    text-align: center;
  }
  .btns {
    margin-left: 55px;
    margin-right: 55px;
    font-size: 32px;
    color: #fff;
    font-weight: bold;
    .md-button {
      height: 88px;
      line-height: 88px;
      border-radius: 10px;
      background-color: #4B9EEA;
    }
  }
</style>