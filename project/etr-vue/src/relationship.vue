<template>
  <div class="page-relationship">
    <result v-if="list.length <= 0">
      <img slot="icon" src="./assets/img/result-relationship.png" />
      <span slot="text">您还没有添加任何人脉<br>立即去寻找吧</span>
      <md-button slot="button" @click="$router.push('/search')">找&nbsp;&nbsp;人&nbsp;&nbsp;脉</md-button>
    </result>
    <template v-else>
      <div class="fixed-top">
        <search class="search" />
      </div>
      <ul class="list">
        <router-link tag="li" class="content" v-for="(m, i) in list" :key="i" :to="'/bcard/' + m.id + '/relationship'">
          <div class="avatar"></div>
          <div class="text">
            <span class="nick">{{m.nick}}</span>
            <span>|</span>
            <span class="job">{{m.job}}</span>
            <div class="company">{{m.company}}</div>
          </div>
        </router-link>
      </ul>
    </template>
  </div>
</template>

<script>
  let list =  [
    {
      id: 0,
      nick: '里斯本',
      job: '前端',
      company: '蚂蚁金服'
    }
  ]
  while (list.length < 10) {list.push(list[0])}
  import {Button} from 'mand-mobile'
  import Result from './components/result'
  import Search from './search'
  export default {
    name: 'relationship',
    components: {
      [Button.name]: Button,
      Search,
      Result
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
    padding: 13px 13px 0;
    margin: 0;
    .content {
      display: flex;
      padding: .28rem;
      margin-bottom: 10px;
      line-height: .42rem;
      border-radius: 14px;
      background-color: #fff;
      font-size: .28rem;
      color: #999;
      &:after {
        content: "";
        height: 0.2rem;
        width: 0.2rem;
        border-width: 0.02rem 0.02rem 0 0;
        border-color: #8C8C8C;
        border-style: solid;
        transform: rotate(45deg);
        float: right;
        margin-top: 30px;
      }
      .avatar {
        width: .88rem;
        height: .88rem;
        background-color: #ccc;
        border-radius: 50%;
        overflow: hidden;
        margin-right: .23rem;
      }
      .text {
        flex: 1;
      }
      .nick {
        color: #333;
      }
      .company {
        margin-top: .22rem;
        line-height: 1;
        font-size: .24rem;
      }
    }
  }
</style>