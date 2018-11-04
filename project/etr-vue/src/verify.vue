<template>
  <div class="page-verify">
    <result v-if="verify === -1">
      <img slot="icon" src="./assets/img/result-wait.png" />
      <span slot="text">您的资料已提交<br>现在审核中，请耐心等待'</span>
      <md-button slot="button" @click="go">{{text}}</md-button>
    </result>
    <result v-if="verify === 0">
      <img slot="icon" src="./assets/img/result-ok.png" />
      <span slot="text">恭喜您！<br>您已通过企业认证</span>
      <md-button slot="button" @click="go">{{text}}</md-button>
    </result>
    <result v-if="verify === 1">
      <img slot="icon" src="./assets/img/result-err.png" />
      <span slot="text">很抱歉！<br>您未通过企业认证，请重新提交材料</span>
      <md-button slot="button" @click="go">{{text}}</md-button>
    </result>
  </div>
</template>

<script>
  import {Button} from 'mand-mobile'
  import Result from './components/result'
  export default {
    name: 'verify',
    components: {
      [Button.name]: Button,
      Result
    },
    data () {
      return {
        verify: -1
      }
    },
    computed: {
      text () {
        return this.verify <= 0 ? '确    定' : '认    证'
      }
    },
    methods: {
      go () {
        if (this.verify <= 0) return this.$router.go(-1)
        return this.$router.go('/identify')
      }
    }
  }
</script>