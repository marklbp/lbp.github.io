<template>
  <div class="error-page" :class="{ small: iconSize.length }">
    <div class="img">
      <img
        src="~/assets/img/500.svg"
        v-if="num >= 500 && num < 600"
        :style="{
          width: parseSize(iconSize[0]),
          height: parseSize(iconSize[1])
        }"
      />
      <img
        src="~/assets/img/403.svg"
        v-else-if="num == 403 || num == 40300"
        :style="{
          width: parseSize(iconSize[0]),
          height: parseSize(iconSize[1])
        }"
      />
      <img
        src="~/assets/img/404.svg"
        v-else
        :style="{
          width: parseSize(iconSize[0]),
          height: parseSize(iconSize[1])
        }"
      />
    </div>
    <div class="text">
      <span>{{ msg }}</span>
      <span class="btn-back" @click="go" v-if="!iconSize.length">{{
        btnText
      }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'error',
  props: {
    code: {
      type: [String, Number],
      default: _ => 404
    },
    message: {
      type: String,
      default: _ => '页面失联了，攻城狮正在紧急搜索中…'
    },
    iconSize: {
      type: Array,
      default: _ => []
    }
  },
  computed: {
    num() {
      return this.$route.query.code || this.code
    },
    msg() {
      let msg = this.$route.query.message || this.message
      if (this.num == 20004 || this.num == 30100) return '未登录或登录已过期'
      if (this.num == 40300) {
        return '您的账号暂未开通应用权限，可联系管理员为您开通权限'
      }
      if (this.num == 403) return msg || '无权限访问此业务'
      return msg
    },
    btnText() {
      return this.num == 20004 || this.num == 30100 || this.num == 40300
        ? '去登录'
        : '返回首页'
    }
  },
  methods: {
    go() {
      if (this.num == 20004 || this.num == 30100 || this.num == 40300) {
        window.location.href = this.$constant.LOGIN()
        return
      }
      window.location.href = '/dashboard'
    },
    parseSize(item) {
      let result
      if (/^\d+$/.test(item)) {
        result = item + 'px'
      } else {
        result = item
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    display: none !important;
  }
}
.img {
  width: 50%;
  max-width: 330px;
  height: 330px;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    width: 100%;
  }
}
.text {
  display: flex;
  margin-left: 80px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  color: #333;
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
.small {
  flex-direction: column;
  > .img {
    width: 100%;
    height: auto;
    > img {
      height: 100%;
      display: block;
      width: auto;
      margin: 0 auto;
    }
  }
  .text {
    display: block;
    font-size: 12px;
    color: #999;
    text-align: center;
    margin: 12px 0 0 0;
    height: auto;
    line-height: 100%;
    text-align: center;
  }
}
</style>
