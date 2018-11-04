<template>
  <div class="page-business-card">
    <div class="cover">
      <img />
    </div>
    <div class="item">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        联系
      </div>
      <div class="content">
        <div v-for="(c, i) in contact" :key="i">{{c.type + "： " + c.value}}</div>
      </div>
    </div>
    <div class="item">
      <div class="title">
        <img src="./assets/img/rd-rect.png" >
        项目
      </div>
      <ul class="list-project">
        <router-link :to="'/cooperate/' + p.id" tag="li" v-for="(p, i) in projects" :key="i">     
          <div class="title">
            <span>【{{p.title}}】</span>
            <span>{{p.text}}</span>
          </div>  
          <div class="user">
            <span>{{p.nick}}&nbsp;.&nbsp;</span>
            <span>{{p.company + p.job}}</span>
            <router-link :to="'/contact/' + p.id"><img src="./assets/img/contact.png">联系</router-link>
          </div>       
        </router-link>
      </ul>
    </div>
    <md-button class="btn-fixed-bottom" v-if="$route.params.from !== 'relationship'" @click="btnAction">编&nbsp;&nbsp;&nbsp;&nbsp;辑</md-button>
    <div class="btn-fixed-bottom" v-else>
      <md-button class="btn-del" @click="btnAction('del')">删除</md-button>
      <md-button class="btn-call" @click="btnAction('call')">联系</md-button>
    </div>
  </div>
</template>

<script>
  let projects = [
    {
      nick: '张三三',
      company: '北京字节跳动有限公司',
      job: '客户经理',
      id: 1,
      title: '雪弗兰音乐节',
      text: '招募媒体合作资源，场地赞助'
    }
  ]
  while (projects.length < 10) {projects.push(projects[0])}
  import {Button, Dialog} from 'mand-mobile'
  export default {
    name: 'resource-detail',
    components: {
      [Button.name]: Button,
      [Dialog.name]: Dialog
    },
    data () {
      return {
        contact: [
          {type: '手机', value: '18717111254'},
          {type: '微信', value: 'marklbp'}
        ],
        projects
      }
    },
    methods: {
      btnAction (act) {
        if (act === 'del') {
          Dialog.confirm({
            title: '提示',
            content: '您确定要删除这个名片吗？',
            confirmText: '删除',
            onConfirm: () => this.deleteBrd(),
          })
        }
      },
      deleteBrd () {}
    }
  }
</script>

<style lang="scss" scoped>
  .page-business-card {
    overflow: hidden;
    padding-bottom: 1.08rem;
    .btn-fixed-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 98px;
      line-height: 98px;
      background-color: #4B9EEA;
      .btn-del {
        float: left;
        width: 40%;
        height: 98px;
        line-height: 98px;
        background-color: #BFBFBF;
      }
      .btn-call.md-button {
        float: left;
        width: 60%;
        height: 98px;
        line-height: 98px;
        background-color: #4B9EEA;
      }
    }
  }
  .cover {
    height: 3.54rem;
    background-color: black;
  }
  .item {
    margin-bottom: .1rem;
    background-color: #fff;
    .title {
      padding: .225rem .28rem;
      border-bottom: .01rem solid #E5E5E5;
      img {
        width: .04rem;
        margin-right: .18rem;
        vertical-align: top;
      }
      font-size: .28rem;
      color: #333
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
          padding: 0;
          border-bottom: 0 none;
          font-size: .32rem;
        }
      }
    }
  }
</style>