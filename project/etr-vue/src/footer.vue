<template>
    <div class="footer">
      <router-link v-for="(r, i) in navs" :to="'/' + r.url" :class="{'focus': activeIndex === r.url}">
        <img :src="r.icons[activeIndex === r.url || r.url === 'publish' ? 0 : 1]" />
        <span v-if="r.text">{{r.text}}</span>
      </router-link>
    </div>
</template>

<script>
  import IconLProject from './assets/img/nav-light-project.png'
  import IconProject from './assets/img/nav-project.png'
  import IconLResource from './assets/img/nav-light-resource.png'
  import IconResource from './assets/img/nav-resource.png'
  import IconAdd from './assets/img/nav-add.png'
  import IconLMsg from './assets/img/nav-light-msg.png'
  import IconMsg from './assets/img/nav-msg.png'
  import IconLMe from './assets/img/nav-light-my.png'
  import IconMe from './assets/img/nav-my.png'

  export default {
    name: 'foot',
    props: {
      focusIndex: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        activeIndex: this.focusIndex || 'project',
        prefix_icon: './assets/img/',
        navs: [
          {text: '项目', icons: [IconLProject, IconProject], url: 'project'},
          {text: '资源', icons: [IconLResource, IconResource], url: 'resource'},
          {icons: [IconAdd], url: 'publish'},
          {text: '消息', icons: [IconLMsg, IconMsg], url: 'messages'},
          {text: '我的', icons: [IconLMe, IconMe], url: 'me'}
        ]
      }
    },
    created () {
      this.activeIndex = this.focusIndex || this.$route.path.match(/^\/(\w+)\/*.*/)[1]
    }
  }
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: .98rem;
  background:linear-gradient(0deg,rgba(235,236,236,1),rgba(247,247,247,1));
  box-shadow:0px -2px 2px 0px rgba(41,41,41,0.07);
  a {
    float: left;
    margin-top: .21rem;
    width: .4rem;
    text-decoration: none;
    font-size: .2rem;
    color: #ccc;
    white-space: nowrap;
    text-align: center;
    &:hover { 
      text-decoration: none;
    }
    &.focus {
      color: #4B9EEA;
    }
    &:first-child {
      margin-left: .88rem;
      margin-right: .93rem;
    } 
    &:last-child {
      margin-left: .92rem;
      margin-right: .86rem;
    }
    &:nth-child(3) {
      width: .68rem;
      height: .68rem;
      margin-top: .17rem;
      margin-left: .79rem;
      margin-right: .79rem;
    }
  }
  img {
    width: 100%;
  }
  span {
    display: block;
    margin-left: - .015rem;
  }
}
</style>