<template>
  <div class="page-relationship">
    <result v-if="list.length <= 0">
      <img slot="icon" src="./assets/img/result-resource.png" />
      <span slot="text">您还没有添加任何资源<br>立即去寻找吧</span>
      <md-button slot="button" @click="$router.push('/resource')">找&nbsp;&nbsp;资&nbsp;&nbsp;源</md-button>
    </result>
    <template v-else>
      <div class="fixed-top">
        <search class="search" />
      </div>
      <ul class="list">
        <router-link tag="li" :to="'/resource/' + item.id + '/my-resource'" v-for="(item, i) in list" :key="i">
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
    </template>
  </div>
</template>

<script>
  let list = [{
    avatar: '',
    name: '今日头条',
    brand: '（品牌名称）',
    id: 1,
    resource: '资源：今日头条、西瓜视频、抖音等平台已先后上台相关政策',
    nick: '7人',
    company: '北京字节跳动有限公司'
  }]
  while (list.length < 10) {list.push(list[0])}
  import {Button} from 'mand-mobile'
  import Result from './components/result'
  import Search from './search'
  export default {
    name: 'my_resource',
    components: {
      [Button.name]: Button,
      Result,
      Search
    },
    data () {
      return {
        list
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
      margin-right: 30px;
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