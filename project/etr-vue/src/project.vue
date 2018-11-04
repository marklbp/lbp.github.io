<template>
    <div class="page-project">
      <div class="fixed-top">
        <search class="search" />
        <filterx class="filter" @filter-list="getList" />
      </div>
      <swipe class="my-swipe">
        <swipe-item class="slide1"></swipe-item>
        <swipe-item class="slide2"></swipe-item>
        <swipe-item class="slide3"></swipe-item>
      </swipe>
      <div class="project">
        <ul class="list">
          <router-link tag="li" v-for="(item, i) in items" :key="i" :to="'/cooperate/' + item.id">
            <div class="title">
              <span>【{{item.title}}】</span>
              <span>{{item.text}}</span>
            </div>  
            <div class="user">
              <span>{{item.nick}}&nbsp;.&nbsp;</span>
              <span>{{item.company + item.job}}</span>
              <router-link :to="'/contact/' + item.id"><img src="./assets/img/contact.png">联系</router-link>
            </div>          
          </router-link>
        </ul>
      </div>
      <foot />
    </div>
</template>

<script>
  var item = {
    nick: '张三三',
    company: '北京字节跳动有限公司',
    job: '客户经理',
    id: 1,
    title: '雪弗兰音乐节',
    text: '招募媒体合作资源，场地赞助'
  }
  require('vue-swipe/dist/vue-swipe.css');
  // in ES6 modules
  import { Swipe, SwipeItem } from 'vue-swipe'
  import Filterx from './filter'
  import Search from './search'
  import Foot from './footer'
  export default {
    name: 'project',
    components: {
      Foot, Search,
      Swipe, SwipeItem,
      Filterx
    },
    data () {
      return {
        items: []
      }
    },
    created () {
      this.parseItems();
    },
    methods: {
      parseItems () {
        let i = 0
        while (i < 10) {
          i++;
          this.items.push(item)
        }
      },
      getList (filterParams) {
        console.log(filterParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fixed-top {
    position: fixed;
    z-index: 2;
    width: 100%;
    top: 0;
    padding: .14rem 0;
    .search {
      margin-left: .3rem;
      width: 78%;
    }
    .filter {
      position: absolute;
      top: .28rem;
      right: .36rem;
    }
  }
  .my-swipe {
    height: 2.62rem;
    .slide1 {
      background-color: red;
    }
    .slide2 {
      background-color: green;
    }
    .slide3 {
      background-color: blue;
    }
  }
  :global(.mint-swipe-indicators) {
    font-size: .24rem;
  }
  :global(.mint-swipe-indicator) {
    width: .16rem;
    height: .16rem;
    margin: 0 .14rem;
    background-color: rgba(235,240,252,1);
  }
  :global(.mint-swipe-indicator.is-active) {
    opacity: .8;
    background-color: #fff;
  }
  .list {
    list-style: none;
    margin: 0;
    padding: .15rem;
    padding-bottom: 1.13rem;
    background-color: #eee;
    li {
      overflow: hidden;
      padding: .23rem .32rem;
      margin-top: .12rem;
      border-radius: .14rem;
      background-color: #fff;
      font-size: .24rem;
      &:first-child {
        margin-top: 0;
      }
      .user {
        position: relative;
        padding-right: .55rem;
        margin-top: .42rem;
        span:first-child {
          color: #666;
        }
        span:nth-child(2) {
          color: #F76260;
        }
        a {
          position: absolute;
          right: 0;
          top: -.06rem;
          color: #4B9EEA;
          text-decoration: none;
        }
        img {
          width: .42rem;
          margin-right: .12rem;
          vertical-align: text-bottom;
        }
      }
      .title {
        font-size: .32rem;
        color: #333;
      }
    }
  }
</style>