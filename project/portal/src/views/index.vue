<template>
  <home v-if="showHomePage === '/'" />
  <router-view v-else-if="!pageInit && message.length <= 0" />
  <page-init :loading="pageInit" :code="code" :message="message" v-else />
</template>
<script>
import { getQueryString } from '../utils/index'
export default {
  name: 'app',
  components: {
    'page-init': _ => import('~/components/page-init'),
    home: _ => import('~/components/home')
  },
  data() {
    return {
      pageInit: true,
      code: 0,
      message: '',
      showHomePage: window.location.pathname
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      let promise
      // 非首页和需要登录的内页，需要校验登录
      /**
       * route.meta.free // 免登录标识
       * 为了排除首次进入页面或者刷新时，初始路由为根路径情形：$route.path === '/'
       * 确保第一次能获取到当前路由的元数据配置，即 meta 属性
       */
      let route = this.$router.matcher.match(this.showHomePage)
      if (route.meta.free || this.showHomePage === '/') {
        this.pageInit = false
        this.code = 0
        this.message = ''
      } else {
        if (this.$cache.session.get('WX_INFO')) {
          promise = this.getUserInfo()
        } else {
          promise = this.checkLogin()
        }
        promise
          .then(r => {
            this.pageInit = false
            this.code = 0
            this.message = ''
          })
          .catch(e => {
            if (e.code == 30100) return
            this.pageInit = false
            this.code = e.code
            this.message = e.message || e.msg
          })
      }
    },
    async checkLogin() {
      try {
        await this.$api.login(null, { needToast: false })
        const storeList = await this.getUserInfo()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async getUserInfo() {
      let { data } = await this.$api.getUserInfo(null, { needToast: false })
      this.$cache.set('USER_INFO', data)
      if (data.groups) {
        let notAllowed = true
        let storeList = data.groups.map(s => {
          if (s.id == this.$route.params.storeId) {
            notAllowed = false
          }
          return {
            id: s.id,
            photo: s.photo,
            description: s.description,
            groupName: s.groupName,
            bzCode: s.bzCode,
            platformCode: s.platformCode,
            platformName: s.platformName
          }
        })
        this.$store.dispatch('setStoreList', storeList)
        if (
          notAllowed &&
          this.$route.params.storeId !== undefined &&
          this.$route.params.storeId != 0
        ) {
          let err = new Error('抱歉，您不是该店铺店员，无权访问该店铺')
          err.code = 403
          throw err
        }
        return storeList
      }
    }
  },
  watch: {
    $route: function(val) {
      const id = val.params.storeId
      id && this.$cache.set('CURRENT_STORE_ID', id)
    }
  }
}
</script>
<style lang="scss" scoped>
.page-init {
  height: 100%;
}
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  &.error {
    /deep/ {
      .circular {
        display: none !important;
      }
      .el-loading-text {
        color: #f56c6c !important;
      }
    }
  }
}
</style>
