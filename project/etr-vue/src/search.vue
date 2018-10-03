<template>
  <form class='search-form' :class="{'focus': isFocus}">
    <div class="input-item" @click="isFocus = !isFocus">
      <img src="./assets/img/search.png">
      <input placeholder="搜项目 | 搜公司 | 搜人">
    </div>
  </form>
</template>

<script>
  export default {
    name: 'search',
    data () {
      return {
        isFocus: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-form {
    &.focus {
      .input-item {
        opacity: 1;
      }
    }
    font-size: .24rem;
    .input-item {
      position: relative;
      height: .24rem;
      padding: .18rem .18rem .18rem .74rem;
      opacity: .4;
      border-radius: .1rem;
      background: rgba(235,240,252,1);
      transition: .1s;
    }
    img {
      position: absolute;
      left: .17rem;
      top: .14rem;
      width: .32rem;
      z-index: 1;
    }
    input {
      border: 0;
      height: 100%;
      padding: 0;
      outline: none;
      background: transparent;
      &::-webkit-input-placeholder{
          color: #fff;
      }
      &::-moz-placeholder{
          color: #fff;
      }
      &:-moz-placeholder{
          color: #fff;
      }
      &:-ms-input-placeholder{
          color: #fff;
      }
    }
  }
</style>