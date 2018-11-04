<template>
  <div class="page-resource-detail">
    <div class="cover">
      <img />
    </div>
    <div class="item">
      <div class="title x-title">
        雪弗兰天地音乐寻求媒体合作
        <div class="sub"><span>张三三.运营总监</span> | 2014年11月10日</div>
      </div>
      <div class="content">
        简介：内容描述内容描述内容描述内容描述内容描述<br>资源：电视媒体、户外媒体、社区资源
      </div>
    </div>
    <div class="item">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        所需资源
      </div>
      <div class="content">
        简介：内容描述内容描述内容描述内容描述内容描述<br>资源：电视媒体、户外媒体、社区资源
      </div>
    </div>
    <div class="item">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        合作模式
      </div>
      <div class="content">
        简介：内容描述内容描述内容描述内容描述内容描述<br>资源：电视媒体、户外媒体、社区资源
      </div>
    </div>
    <share :showAdd="false" :showContact="true"/>
  </div>
</template>

<script>
  import Share from './share'
  export default {
    name: 'resource-detail',
    components: {Share},
    data () {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  .page-resource-detail {
    overflow: hidden;
    padding-bottom: 1.08rem;
  }
  .cover {
    height: 3.54rem;
    background-color: black;
  }
  .item {
    margin-bottom: .1rem;
    background-color: #fff;
    .x-title.title {
      border-bottom: 0 none;
      padding-bottom: 0;
      font-size: .32rem;
    }
    .title {
      padding: .225rem .28rem;
      border-bottom: .01rem solid #E5E5E5;
      img {
        width: .04rem;
        margin-right: .18rem;
        vertical-align: top;
      }
      font-size: .28rem;
      color: #333;
      .sub {
        margin-top: .25rem;
        font-size: .24rem;
        color: #666;
        span {
          color: #4B9EEA;
        }
      }
    }
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
      .content {
        display: flex;
        border-bottom: .01rem solid #E5E5E5;
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
    .content {
      padding: .28rem;
      line-height: .42rem;
      font-size: .24rem;
      color: #666;
    }
    .list-project {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        overflow: hidden;
        padding: .3rem .5rem .24rem;
        margin-top: .12rem;
        border-bottom: .01rem solid #E5E5E5;
        background-color: #fff;
        font-size: .24rem;
        &:first-child {
          margin-top: 0;
        }
        .user {
          position: relative;
          padding-right: .55rem;
          margin-bottom: .42rem;
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
          padding: 0;
          border-bottom: 0 none;
          font-size: .32rem;
        }
      }
    }
  }
</style>