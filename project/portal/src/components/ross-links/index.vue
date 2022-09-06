<template>
  <section class="ross-link">
    <div class="ross-link__item" v-for="(item, index) in apps" :key="index">
      <div
        class="ross-link__header"
        :style="{ 'margin-bottom': item.modules.length === 0 ? '0' : '8px' }"
        @click="openHostHandle(item)"
      >
        <span class="ross-link__logo">
          <img :src="item.icon" alt="" />
        </span>
        <span class="ross-link__title">{{ item.appName }}</span>
      </div>
      <section class="ross-link__modules">
        <span
          class="ross-link__mod"
          v-for="(mod, index) in item.modules"
          :key="index"
          @click="openHandle(item.hosts, mod)"
        >
          {{ mod.pageName }}
        </span>
      </section>
    </div>
  </section>
</template>

<script>
import apps from './ross'

export default {
  name: 'RossLink',
  props: {
    // appkey
    app: {
      type: String,
      required: true
    },
    // 当前的环境
    env: {
      // sit uat pro
      type: String,
      required: true
    }
  },
  data() {
    return {
      apps
    }
  },
  methods: {
    openHandle(hosts, { path }) {
      if (!path) return
      window.open(`${hosts[this.env] || hosts.pro}${path}`)
    },
    openHostHandle({ hosts }) {
      window.open(`${hosts[this.env] || hosts.pro}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.ross-link {
  text-align: left;
  padding: 24px;
}
.ross-link__item:not(:last-child) {
  margin-bottom: 24px;
}
.ross-link__header {
  display: inline-block;
  width: auto;
  line-height: 24px;
  cursor: pointer;
  > * {
    vertical-align: middle;
  }
}
.ross-link__logo {
  display: inline-block;
  width: 20px;
  height: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.ross-link__title {
  margin-left: 12px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  line-height: 21px;
  font-weight: bold;
  color: #333333;
}
.ross-link__modules {
  white-space: wrap;
}
.ross-link__mod {
  &:not(:last-child) {
    margin-right: 40px;
  }
  display: inline-block;
  padding: 4px 0;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  font-family: PingFangSC-Regular;
  // color: lighten($color: #333333, $amount: 50%);
  color: #999;
  transition: color 318ms;
  &:hover {
    color: #333333;
  }
}
</style>
