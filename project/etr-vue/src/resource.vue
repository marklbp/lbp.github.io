<template>
    <div class="page-resource">
      <div class="resource">
        <div class="fixed-top">
          <search class="search" />
          <filterx class="filter" @filter-list="getList" />
        </div>
        <ul class="list">
          <router-link tag="li" :to="'/resource/' + item.id" v-for="(item, i) in items" :key="i">
            <div class="avatar"><img :src="item.avatar"></div>
            <div class="content">
              <div class="title">
                <span>{{item.name}}</span>
                <span>{{item.brand}}</span>
              </div>
              <div class="text">{{item.resource}}</div>
              <div class="user">{{item.nick}}|{{item.company}}</div>
            </div>
          </router-link>
        </ul>
      </div>
      <foot />
    </div>
</template>

<script>
  var item = {
    avatar: '',
    name: '今日头条',
    brand: '（品牌名称）',
    id: 1,
    resource: '资源：今日头条、西瓜视频、抖音等平台已先后上台相关政策',
    nick: '7人',
    company: '北京字节跳动有限公司'
  }
  import Filterx from './filter'
  import Foot from './footer'
  import Search from './search'
  export default {
    name: 'resource',
    components: {Foot, Filterx, Search},
    data () {
      return {
        items: []
      }
    },
    created () {
      this.parseItems()
    },
    methods: {
      getList (filterParams) {},
      parseItems () {
        let i = 0
        while ( i < 10) {
          i++
          this.items.push(item)
        }
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
      width: 5.76rem;
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
    padding-bottom: 1.13rem;
    background-color: #eee;
    li {
      overflow: hidden;
      margin-top: .12rem;
      padding: .23rem 0;
      border-radius: .14rem;
      background-color: #fff;
      &:first-child {
        margin-top: 0;
      }
      .avatar {
        float: left;
        width: 1.45rem;
        height: 1.45rem;
        margin-left: .21rem;
        background-color: #ccc;
        overflow: hidden;
      }
      .content {
        margin-left: 2.05rem;
        margin-right: .72rem;
        font-size: .24rem;
        .title {
          color: #F07979;
          font-size: .28rem;
        }
        .text {
          height: .24rem;
          overflow: hidden;
          margin-top: .25rem;
          margin-bottom: .25rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #666;
        }
        .user {
          color: #999;
        }
      }
    }
  }
</style>