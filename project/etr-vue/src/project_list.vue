<template>
    <div class="page-project-list">
      <div class="fixed-top">
        <search class="search" />
        <filterx class="filter" @filter-list="getList" />
      </div>
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
  import Filterx from './filter'
  import Search from './search'
  export default {
    name: 'project-list',
    components: {
      Search,
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
    padding: .14rem 0;
    background-color: #4B9EEA;
    .search {
      margin-left: .3rem;
      width: 77%;
    }
    .filter {
      position: absolute;
      top: .28rem;
      right: .36rem;
    }
  }

  .list {
    list-style: none;
    margin: 0;
    padding: .15rem;
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