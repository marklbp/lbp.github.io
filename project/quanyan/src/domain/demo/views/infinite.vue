<template lang="html">
  <div class="demo-infinite">
    <div class="box" v-for="item in list">{{item}}</div>
    <div class="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <bln-loading color="black" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import Loading from '@/components/loading/loading'

Vue.use(infiniteScroll)

const push = list => list.push(list.length)

export default {
  components: {
    [Loading.name]: Loading
  },
  data () {
    return {
      list: [0, 1, 2, 3]
    }
  },
  methods: {
    loadMore () {
      return new Promise(resolve => {
        setTimeout(() => {
          push(this.list)
          push(this.list)
          push(this.list)
          push(this.list)
          resolve(true)
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss">
.demo-infinite {
  .box {
    width: 690px;
    height: 300px;
    background: #eee;
    margin: 30px;
  }
  .loading {
    .bln-loading {
      display: inline-block;
    }
    text-align: center;
  }
}
</style>
