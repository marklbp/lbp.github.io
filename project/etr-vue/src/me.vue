<template>
    <div class="page-me">
      <router-link v-for="(it, i) in items" :key="i" class="link" :class="{'avatar': i===0, 'last': i === items.length - 1}" :to="it.url">
        <div class="icon"><img :src="it.icon"></div>
        <div v-if="i < 1" class="user">
          <span class="nick">{{it.nick}}</span>
          <span>|</span>
          <span class="job">{{it.job}}</span>
          <div class="company"><img src="./assets/img/me-location.png">{{it.company}}</div>
        </div>
        <div v-else class="text">{{it.text}}</div>
        <div class="desc"><span>{{it.desc}}</span></div>
      </router-link>
      <Foot />
    </div>
</template>

<script>
  import IconPortrait from './assets/img/me-portrait.png'
  import IconPublish from './assets/img/me-publish.png'
  import IconBrand from './assets/img/me-brand.png'
  import IconRelationship from './assets/img/me-relationship.png'
  import IconResource from './assets/img/me-resource.png'
  import IconFeedback from './assets/img/me-feedback.png'
  import Foot from './footer'
  import {tipText} from './plugins/utils'
  export default {
    name: 'me',
    components: {Foot},
    beforeRouteEnter (now, prev, next) {
      if (!localStorage.login) {
        tipText('请先登录')
        return setTimeout(()=>next ('/login'), 1000)
      }
      next()
    },
    data () {
      return {
        items: [
          {icon: IconPortrait, text: '', nick: '张三三', job: '客户经理', company: '北京字节跳动科技有限公司', desc: '', url: '/profile'},
          {icon: IconPublish, text: '发布', desc: '6条', url: ''},
          {icon: IconBrand, text: '品牌', desc: '', url: ''},
          {icon: IconRelationship, text: '人脉', desc: '', url: '/relationship'},
          {icon: IconResource, text: '资源', desc: '', url: '/my-resource'},
          {icon: IconFeedback, text: '反馈', desc: '', url: ''},
        ]
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .page-me {
    background-color: #eee;
  }
  .link {
    display: flex;
    height: 96px;
    line-height: 96px;
    border-bottom: 1px solid #EEEEEE;
    text-decoration: none;
    background-color: #fff;
    font-size: 30px;
    &.last {
      margin-top: 20px;
    }
    &.avatar {
      line-height: normal;
      background-color: #4B9EEA;
      margin-bottom: 16px;
      color: #fff;
      padding-top: 27px;
      padding-bottom: 40px;
      height: auto;
      .icon {
        width: 142px;
        padding-right: 48px;
        img {
          margin-top: 16px;
        }
      }
      .desc{
        flex: none;
        &:after {
          border-color: #fff;
        }
      }
    }
    .icon {
      width: 40px;
      padding-left: 40px;
      padding-right: 21px;
      img {
        width: 100%;
        float: left;
        margin-top: 26px;
      }
    }
    .text, .user {
      flex: 1;
    }
    .user {
      padding-top: 29px;
      font-size: 36px;
      .job {
        font-size: 28px;
      }
      .company {
        margin-top: 30px;
        &, .job {
          font-size: 26px;
        }
        opacity: .7;
        img {
          width: 21px;
          margin-right: 13px;
          vertical-align: middle;
        }
      }
    }
    .text {
      color: #333;
      font-size: 30px;
    }
    .desc {
      position: relative;
      flex: 2;
      padding-right: 70px;
      color: #808080;
      text-align: right;
      &:after {
        content: " ";
        height: 20px;
        width: 20px;
        border-width: 2px 2px 0 0;
        border-color: #8C8C8C;
        border-style: solid;
        -webkit-transform: translateY(-50%) rotate(45deg);
        transform: translateY(-50%) rotate(45deg);
        position: relative;
        top: -2px;
        position: absolute;
        top: 50%;
        right: 40px;
      }
    }
  }
</style>