<template>
    <div class="page-me">
      <router-link v-for="(it, i) in items" :key="i" class="link" :class="{'avatar': i===0}" :to="it.url">
        <div class="icon"><img :src="it.icon"></div>
        <div v-if="i < 1" class="user">
          <span class="nick">{{it.nick}}</span>
          <span>.</span>
          <span class="job">{{it.job}}</span>
          <div class="company"><img src="./assets/img/me-location.png">{{it.company}}</div>
        </div>
        <div v-else class="text">{{it.text}}</div>
        <div class="desc">{{it.desc}}</div>
      </router-link>
      <Foot />
    </div>
</template>

<script>
  import IconPortrait from './assets/img/me-portrait.png'
  import IconProject from './assets/img/me-project.png'
  import IconRelationship from './assets/img/me-relationship.png'
  import IconResource from './assets/img/me-resource.png'
  import IconLove from './assets/img/me-love.png'
  import IconFeedback from './assets/img/me-feedback.png'
  import IconCfg from './assets/img/me-cfg.png'
  import Foot from './footer'
  export default {
    name: 'me',
    components: {Foot},
    data () {
      return {
        items: [
          {icon: IconPortrait, text: '', nick: '张三三', job: '客户经理', company: '北京字节跳动科技有限公司', desc: '', url: ''},
          {icon: IconProject, text: '项目', desc: '', url: ''},
          {icon: IconRelationship, text: '人脉', desc: '', url: ''},
          {icon: IconResource, text: '资源', desc: '', url: ''},
          {icon: IconLove, text: '收藏', desc: '', url: ''},
          {icon: IconFeedback, text: '反馈', desc: '', url: ''},
          {icon: IconCfg, text: '设置', desc: '', url: ''},
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
    height: .96rem;
    line-height: .96rem;
    border-bottom: .01rem solid #EEEEEE;
    text-decoration: none;
    background-color: #fff;
    font-size: .3rem;
    &.avatar {
      line-height: normal;
      background-color: #4B9EEA;
      margin-bottom: .16rem;
      color: #fff;
      padding-top: .27rem;
      padding-bottom: .4rem;
      height: auto;
      .icon {
        width: 1.42rem;
        padding-right: .48rem;
        img {
          width: 100%;
        }
      }
      .desc:after {
        border-color: #fff;
      }
    }
    .icon {
      width: .5rem;
      padding-left: .4rem;
      padding-right: .35rem;
      img {
        width: 80%;
        vertical-align: middle;
      }
    }
    .text, .user {
      flex: 1;
    }
    .user {
      padding-top: .29rem;
      font-size: .36rem;
      .company {
        margin-top: .34rem;
        font-size: .26px;
        opacity: .7;
        img {
          width: .21rem;
          margin-right: .13rem;
          vertical-align: middle;
        }
      }
    }
    .text {
      color: #333;
      font-size: .3rem;
    }
    .desc {
      position: relative;
      width: .5rem;
      padding-right: .4rem;
      color: #808080;
      &:after {
        content: " ";
        height: .2rem;
        width: .2rem;
        border-width: .02rem .02rem 0 0;
        border-color: #8C8C8C;
        border-style: solid;
        -webkit-transform: translateY(-50%) rotate(45deg);
        transform: translateY(-50%) rotate(45deg);
        position: relative;
        top: -.02rem;
        position: absolute;
        top: 50%;
        right: .4rem;
      }
    }
  }
</style>