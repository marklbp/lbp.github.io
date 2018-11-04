<template>
  <form class='search-form' :class="{'focus': isFocus}">
    <div class="input-item">
      <img src="./assets/img/search.png">
      <input v-model="searchVal" @focus="focus" @blur="blur" placeholder="搜项目 | 搜公司 | 搜人">
      <img v-show="searchVal.length > 0" @click="clear" class="clear" src="./assets/img/search-times.png">
    </div>
  </form>
</template>

<script>
  export default {
    name: 'search',
    props: {
      value: {
        default: '',
        type: String
      }
    },
    data () {
      return {
        isFocus: false,
        searchVal: ''
      }
    },
    created () {
      this.searchVal = this.value
    },
    methods: {
      focus () {
        this.isFocus = true
        if (this.$route.path === 'search') return
        this.$router.push('/search')
      },
      blur () {
        this.isFocus = false
        this.$emit('input', this.searchVal)
      },
      clear () {
        this.searchVal = ''
        this.$emit('clear')
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
      &.clear {
        left: auto;
        right: .17rem;
      }
    }
    input {
      width: 100%;
      height: .6rem;
      padding: .18rem .74rem;
      opacity: .4;
      box-sizing: border-box;
      border: 0 none;
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