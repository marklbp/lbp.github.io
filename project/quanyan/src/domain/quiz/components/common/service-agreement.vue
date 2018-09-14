/* 服务协议 */
<template>
  <div>
    <div class="center-flex-v box-h">
      <div class="del-box"></div>
      <div class="full-height center-flex-v p-r18" @click="checkAgree">
        <div class="check-box center-flex" :class="{'box-checked': value}">
          <img v-if="value" class="choosed-icon" src="@/domain/quiz/assets/choosed.svg" alt="" srcset="">
        </div>
      </div>
      <div class="f-24 c-31 center-flex-v full-height">我已阅读并同意</div>
      <div class="f-24 agree-conten center-flex-v full-height" @click="viewServiceAgreement">《用户服务协议》</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceAgreement',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    checkAgree () {
      this.$emit('input', !this.value)
    },
    //  查看服务协议
    viewServiceAgreement () {
      let path = '/footballgame/lottery/service-protocol'
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="stylus" scoped>
.check-box
  width 30px
  height 30px
.choosed-icon
  width 20px
  height 20px
.agree-conten
  color #58A5FF
.p-r18
  padding-right 18px
.box-h
  padding-top 30px
.del-box
  width 48px
  height 48px
  margin-right 32px
</style>

<style lang="scss" scoped>
.check-box {
  position: relative;
  @include hairline(#DCDCDC, 4px)
}
.box-checked {
  position: relative;
  @include hairline(#F04A1E, 4px)
}
</style>
