<template>
  <div>
    <PageInit
      :loading="pageInit"
      :code="code"
      :message="message"
      v-if="!noStoreVisiblity"
    >
      <router-back :disableRoute="true" text="店铺管理" />
    </PageInit>
    <div class="error-page" v-else>
      <div class="img">
        <img src="~/assets/img/403.svg" />
      </div>
      <div class="text">
        <span>您的账号暂未开通该店铺权限~</span>
        <span>可联系管理员为您开通权限或切换店铺</span>
      </div>
    </div>
  </div>
</template>
<script>
import authStore from './authStore.mixin.js'
const { mapMutations } = Vuex
export default {
  name: 'StoreManagement',
  components: {
    RouterBack: _ => import('~/components/router-back'),
    PageInit: _ => import('~/components/page-init')
  },
  data() {
    return {
      storeOptions: [],
      pageInit: true,
      message: '',
      code: 0,
      noStoreVisiblity: false
    }
  },
  mixins: [authStore],
  created() {
    this.getStoreList()
  },

  methods: {
    async getStoreList() {
      try {
        const res = await this.$api.storeList.get()
        let storeList = (res.data || []).map(s => ({
          id: s.id,
          photo: s.photo,
          description: s.description,
          groupName: s.groupName,
          bzCode: s.bzCode,
          platformCode: s.platformCode,
          platformName: s.platformName
        }))
        // this.storeOptions = storeList
        this.$store.dispatch('setStoreList', storeList)
        // 店铺授权后跳转重定向地址或上次登陆的店铺首页
        const { authStoreId, redirectUrl } = this.$route.query
        const storeId = authStoreId || this.getLastStoreId(storeList)
        const authData = await this.authStore({ storeId, storeList })
        this.$store.commit('saveAuthDate', authData)
        if (!storeId || !authData.functionTree.length) {
          this.pageInit = false
          this.noStoreVisiblity = true
        } else {
          const authStoreMenus = getMenusList(
            authData.functionTree[0].children[0].children
          )
          this.$store.commit('saveStoreMenus', authStoreMenus)
          this.$router.replace(redirectUrl || `/${storeId}/dashboard`)
        }
      } catch (ex) {
        this.pageInit = false
        this.code = ex.code
        this.message = ex.message || ex.msg
      }
      function getMenusList(data) {
        let menus
        data.forEach(val => {
          if (val.type.code === 'PAGE') {
            ;(menus || (menus = [])).push({
              text: val.name,
              href: val.routeUri,
              children: getMenusList(val.children),
              icon: val.icon,
              showSelf: true,
              showChildren: false
            })
          }
        })
        return menus
      }
    },
    // 获取上次登陆的店铺，默认值为店铺列表第一个店铺
    getLastStoreId(storeList) {
      const lastStoreId = +this.$cache.get('CURRENT_STORE_ID')
      let storeId
      if (!storeList || !storeList.length) {
        return false
      }
      if (storeList.some(val => val.id === lastStoreId)) {
        storeId = lastStoreId
      } else {
        storeId = storeList[0].id
      }
      return storeId
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  background: #fff;
  padding: 24px 32px;
  .panel__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
  }

  .el-row {
    margin-top: 24px;
    .el-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
  .store {
    display: flex;
    padding: 10px 16px;
    border-radius: 2px;
    &:hover {
      cursor: pointer;
      background: #f5f5f5;
    }

    .store__logo {
      width: 56px;
      height: 56px;
      margin-right: 16px;
    }

    .store__info {
      flex: 1;

      .store__name {
        display: block;
        font-size: 14px;
        color: #333;
        line-height: 30px;
      }

      .store__desc {
        display: block;
        font-size: 12px;
        color: #999;
        line-height: 20px;
      }
    }
  }
}
.error-page {
  display: flex;
  height: 70vh;
  justify-content: center;
  align-items: center;
  &:after {
    display: none !important;
  }
}
.img {
  width: 330px;
  height: 330px;
}
.text {
  display: flex;
  margin-left: 80px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  color: #333;
  > span:first-child {
    font-weight: bold;
    margin-bottom: 20px;
  }
  > span:last-child {
    color: #666;
  }
}
.btn-back {
  display: block;
  width: 118px;
  height: 40px;
  line-height: 40px;
  margin-top: 32px;
  text-align: center;
  border: 1px solid $--color-primary;
  color: $--color-primary;
  cursor: pointer;
}
</style>
