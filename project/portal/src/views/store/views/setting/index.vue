<template>
  <div>
    <router-back :disable-route="true" text="设置" />
    <el-row :gutter="24">
      <el-col
        :md="8"
        :lg="8"
        :xm="12"
        v-for="{ href, title, icon, desc } in settingOptions"
        :key="href"
      >
        <router-link class="setting" :to="href">
          <div class="setting__icon mr__l">
            <i class="font-icon" :class="icon" />
          </div>
          <div class="setting__info">
            <span class="setting__name">{{ title }}</span>
            <span class="setting__desc">{{ desc }}</span>
          </div>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'store-setting',
  components: {
    'router-back': _ => import('~/components/router-back')
  },

  data() {
    const storeId = this.$route.params.storeId
    return {
      settingOptions: [
        {
          icon: 'shop',
          title: '店铺信息',
          href: `/${storeId}/setting/shop`,
          desc: '店铺信息文本说明'
        },
        {
          icon: 'tenant-management',
          title: '人员管理',
          href: `/${storeId}/setting/staff`,
          desc: '人员管理文本说明'
        },
        {
          icon: 'framework',
          title: '流程设置',
          href: `/${storeId}/setting/operation`,
          desc: '流程设置文本说明'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-row {
  background: #fff;
  padding: 24px;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.setting {
  display: flex;
  padding: 10px 16px;

  &:hover {
    cursor: pointer;
    background: #f0f6ff;

    .setting__icon {
      background: #fff;
    }
  }

  .setting__icon {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    background: #f0f6ff;
    text-align: center;
    line-height: 48px;

    i {
      font-size: 20px;
      color: #3366ff;
    }
  }

  .setting__info {
    flex: 1;

    .setting__name {
      display: block;
      font-size: 14px;
      color: #333;
      line-height: 30px;
    }

    .setting__desc {
      display: block;
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
  }
}
</style>
