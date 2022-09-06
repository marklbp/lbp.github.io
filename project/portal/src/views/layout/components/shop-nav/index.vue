<template>
  <el-select
    :title="parseGroupName()"
    class="shop-nav"
    v-model="shopName"
    filterable
    placeholder="切换店铺"
    popper-class="shop-nav-dropdown"
    @change="go"
  >
    <img slot="prefix" class="shop-logo" :src="currentShopType" />
    <el-option
      class="shop-nav-dropdown-item"
      v-for="item in shops"
      :key="item.id"
      :label="item.groupName"
      :value="item.id"
      :title="item.groupName"
      :disabled="item.id == $route.params.storeId"
    >
      <img class="shop-logo" :src="parseTypeIcon(item)" />
      <div>{{ item.groupName }}</div>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'shop-nav',
  props: {
    host: {
      type: String,
      default: _ => ''
    }
  },
  computed: {
    shops() {
      return this.$store.state.STORE_LIST
    },
    currentShopType() {
      let shop =
        this.$store.state.STORE_LIST.find(s => s.id == this.shopName) || {}
      return this.parseTypeIcon(shop)
    },
    shopName: {
      get: function() {
        return (
          Number(this.$route.params.storeId || this.$route.query.authStoreId) ||
          ''
        )
      },
      set: function(val) {
        return val
      }
    }
  },
  methods: {
    parseGroupName() {
      let s = this.shops.find(s => s.id == this.$route.params.storeId)
      if (s) {
        return s.groupName
      } else {
        return ''
      }
    },
    parseTypeIcon(shop) {
      switch ((shop.platformCode + '').toLowerCase()) {
        case 'tmall':
          //return 'icontianmao'
          return require('./assets/img/tmall.svg')
        case 'jd':
          // return 'iconjingdong'
          return require('./assets/img/jd.svg')
        case 'pinduoduo':
          // return 'iconpinduoduo'
          return require('./assets/img/pinduoduo.svg')
        case 'douyin':
          // return 'icondouyin'
          return require('./assets/img/douyin.svg')
        case 'xiaohongshu':
          // return 'iconxiaohongshuicon'
          return require('./assets/img/xiaohongshu.svg')
        case 'vip':
          return require('./assets/img/vip.svg')
        case 'kaola':
          return require('./assets/img/kaola.svg')
        case 'juhuasuan':
          return require('./assets/img/juhuasuan.svg')
        case 'weitao':
          return require('./assets/img/weitao.svg')
        case 'tmallsupermarket':
          return require('./assets/img/tmallsupermarket.svg')
        default:
          return require('./assets/img/officalwebsite.svg')
        // return 'iconofficalwebsite'
      }
    },
    go(v) {
      /*if (!this.host) {
        return this.$router.push(`${this.host}/${v}/dashboard`)
      }*/
      window.location.href = `${this.host}/${v}/dashboard`
    }
  }
}
</script>
<style lang="scss" src="./assets/css/index.scss" scoped />
<style lang="scss">
.shop-nav-dropdown {
  max-height: 400px;
  overflow: hidden auto;
}
</style>
