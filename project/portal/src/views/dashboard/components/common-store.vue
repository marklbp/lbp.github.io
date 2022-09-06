<template>
  <div class="common-store">
    <slot name="drag" v-show="enableDrag" />
    <div class="common-store__title">
      常用店铺
      <slot />
      <div class="common-store__title_all">
        <!-- <router-link to="/store">全部 ></router-link> -->
      </div>
    </div>

    <PageInit
      class="storeOptionsBox"
      :loading="pageInit"
      :code="code"
      :message="message"
    >
      <el-row :gutter="24">
        <el-col
          :class="`wd_${width}`"
          v-for="{ id, platformCode, groupName } in storeOptions"
          :key="id"
        >
          <router-link class="store" :to="`/${id}/dashboard`">
            <img
              class="store__logo"
              :src="parseTypeIcon(platformCode)"
              :alt="groupName"
            />
            <div class="store__info">
              <overflow-tip :words="groupName"></overflow-tip>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </PageInit>
  </div>
</template>
<script>
export default {
  name: 'common-store',
  components: {
    PageInit: _ => import('~/components/page-init'),
    overflowTip: _ => import('~/components/overflow-tip')
  },
  data() {
    return {
      storeOptions: [],
      pageInit: true,
      message: '',
      code: 0
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({
        width: 12,
        enableDrag: false
      })
    }
  },
  mounted() {
    this.getStoreList()
  },
  beforeDestroy() {},
  methods: {
    async getStoreList() {
      try {
        const res = await this.$api.globalDashboard.queryRecentVisit(null, {
          needToast: false
        })
        let storeList = res.data.map(s => ({
          id: s.id,
          platformCode: s.platformCode,
          description: s.description,
          groupName: s.groupName
        }))
        if (storeList && storeList.length > 3) {
          storeList = storeList.slice(0, 3)
        }
        this.storeOptions = storeList
        this.pageInit = false
      } catch (ex) {
        this.pageInit = false
        this.code = ex.code
        this.message = ex.message || ex.msg
      }
    },
    parseTypeIcon(platformCode) {
      switch ((platformCode + '').toLowerCase()) {
        case 'tmall':
          //return 'icontianmao'
          return require('../../layout/components/shop-nav/assets/img/tmall.svg')
        case 'jd':
          // return 'iconjingdong'
          return require('../../layout/components/shop-nav/assets/img/jd.svg')
        case 'pinduoduo':
          // return 'iconpinduoduo'
          return require('../../layout/components/shop-nav/assets/img/pinduoduo.svg')
        case 'douyin':
          // return 'icondouyin'
          return require('../../layout/components/shop-nav/assets/img/douyin.svg')
        case 'xiaohongshu':
          // return 'iconxiaohongshuicon'
          return require('../../layout/components/shop-nav/assets/img/xiaohongshu.svg')
        case 'vip':
          return require('../../layout/components/shop-nav/assets/img/vip.svg')
        case 'kaola':
          return require('../../layout/components/shop-nav/assets/img/kaola.svg')
        case 'juhuasuan':
          return require('../../layout/components/shop-nav/assets/img/juhuasuan.svg')
        case 'weitao':
          return require('../../layout/components/shop-nav/assets/img/weitao.svg')
        case 'tmallsupermarket':
          return require('../../layout/components/shop-nav/assets/img/tmallsupermarket.svg')
        default:
          return require('../../layout/components/shop-nav/assets/img/officalwebsite.svg')
        // return 'iconofficalwebsite'
      }
    }
  },
  computed: {
    width() {
      const width = this.params.width
      return width || 12
    },
    enableDrag() {
      return this.params.enableDrag
    },
    showScroll() {
      return this.list.length > 1
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.common-store {
  position: relative;
  background: #fff !important;
  padding: 0 !important;
  .storeOptionsBox {
    background: #fff !important;
    padding: 0 !important;
    min-height: 100px !important;
  }
  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
    position: relative;
    padding: 16px 32px;
    border: 1px solid #e8e8e8;
    border-style: none none solid none;
    &_all {
      font-weight: normal;
      position: absolute;
      top: 16px;
      right: 32px;
      color: #3366ff;
      font-size: 14px;
    }
  }

  .el-row {
    padding: 0 32px 24px 32px !important;
    margin-top: 24px;
    .el-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
      display: inline-block;
      width: 33%;
    }
    .wd_4 {
      width: 100%;
    }
    .wd_6 {
      width: 50%;
    }
    .wd_8 {
      width: 33%;
    }
    .wd_12 {
      width: 26%;
    }
  }
  .store {
    @include flex;
    padding: 8px;
    border-radius: 2px;
    overflow: hidden;
    align-items: center;
    &:hover {
      cursor: pointer;
      background: #f5f5f5;
    }
    .store__logo {
      display: block;
      width: 56px;
      height: 56px;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
    .store__info {
      line-height: 16px;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
