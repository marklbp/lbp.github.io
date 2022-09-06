<template>
  <div class="breadcrumb">
    <template v-if="!disableRoute">
      <a
        href="javascript:void(0)"
        :title="title"
        size="15px"
        class="font-icon arrow-left"
        @click="back"
      ></a>
      <span
        v-if="text && (text.length > 0 || this.$slots.left)"
        class="vertical-line"
      ></span>
    </template>
    <span class="text" :title="text" v-if="!this.$slots.left">{{ text }}</span>
    <slot name="left" v-else></slot>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'router-back',
  props: {
    text: {
      type: String,
      default: _ => ''
    },
    url: {
      type: [String, Number],
      default: _ => -1
    },
    title: {
      type: String,
      default: _ => '返回'
    },
    disableRoute: {
      type: Boolean,
      default: _ => false
    },
    routeAction: {
      type: String,
      default: _ => 'push'
    }
  },
  methods: {
    back() {
      if (typeof this.url === 'number') return this.$router.go(this.url)
      return this.$router[this.routeAction](this.url)
    }
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  padding-left: 30px;
}
.font-icon {
  display: inline-block;
  margin-top: 2px;
  color: #666;
  text-decoration: none;
}
.vertical-line {
  display: inline-block;
  width: 2px;
  height: 18px;
  background-color: #d9d9d9;
  margin-left: 18px;
  margin-right: 18px;
  margin-top: 1px;
}
.text {
  display: inline-block;
  font-weight: bold;
  font-size: 20px;
  font-family: PingFangSC-Medium;
  color: #333;
}
</style>
