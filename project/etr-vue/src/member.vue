<template>
  <div class="page-member">
    <div class="fixed-top">
      <search class="search" />
      <filterx class="filter" @filter-list="getList" />
    </div>
    <ul class="list">
      <router-link tag="li" class="content" v-for="(m, i) in list" :key="i" :to="'/bcard/' + m.id">
        <div class="avatar"></div>
        <div class="text">
          <span class="nick">{{m.nick}}</span>
          <span>|</span>
          <span class="job">{{m.job}}</span>
          <div class="company">{{m.company}}</div>
        </div>
      </router-link>
    </ul>
    <foot focusIndex="resource" />
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
  import Filterx from './filter'
  import Search from './search'
  import Foot from './footer'
  export default {
    name: 'member',
    components: {Search, Filterx, Foot},
    data () {
      return {
        list,
      }
    },
    methods: {
      getList () {}
    }
  }
</script>

<style lang="scss" scoped>
.fixed-top {
  padding: .14rem 0;
  background-color: #4B9EEA;
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
.list {
  list-style: none;
  padding: 13px 13px 98px;
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