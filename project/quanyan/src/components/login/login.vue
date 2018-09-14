<template>
  <div v-if="value" class="login-wrapper center-flex" @touchmove.prevent>
    <div class="mask"></div>
    <div class="login-box" :class="{'popup-animation':showAnimation}">
      <div class="login-title c-0 f-34 text-center">绑定手机号</div>
      <div class="login-content">
        <div class="van-hairline--surround">
          <input class="w-input f-30 w-100" type="tel" v-model.trim="tel" placeholder="输入手机号" >
        </div>
        <div class="vercode-box center-flex">
          <div class="van-hairline--surround flex-full">
            <input class="w-input f-30 w-input-vercode" type="number" v-model.trim="vercode" placeholder="输入验证码" >
          </div>
          <div class="vercode active-btn center-flex" @click="getVerCode">
            <div class="rotate-loading" v-if="isSendVercode"></div>
            <div :class="timer>0?'c-theme':''" v-else>{{timer>0?`${timer}s后重获`: sendCount>1?"再次发送":"获取验证码"}}</div>
          </div>
        </div>
      </div>
      <div class="login-btn-wrapper center-flex van-hairline--top">
        <div class="flex-full login-back login-btn-item center-flex c-0 f-34 active-btn" @click="back">取消</div>
        <div class="flex-full login-ok login-btn-item center-flex f-34 c-f active-btn" @click="login">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/services/request.js';
import { Toast } from 'mand-mobile'
import Cookies from 'js-cookie'
import { hackLocationReload, isWxbrowser, isAlipayBrowser, getAlipayUserId, getOpenId } from '@/utils/common'
import {ALIPAY_APPID, WX_APPID} from '@/constants'
//  初始化值
const initData = {
  tel: '',
  vercode: '',
  showAnimation: false,
  timer: 0,
  sendCount: 1,
  isSendVercode: false
};
export default {
  name: 'Login',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    autoShut: {
      type: Boolean,
      default: true
    },
    //  是否需要初始化数据
    needInit: {
      type: Boolean,
      default: true
    },
    loginSuccess: Function,
    loginFailt: Function,
    cancleCallBack: Function
  },
  data() {
    return {
      ...initData,
      disableLogin: false
    };
  },
  watch: {
    value(val) {
      if (val) {
        // 初始化数据
        if (this.needInit) {
          for (let item in initData) {
            if (initData.hasOwnProperty(item)) {
              this[item] = initData[item];
            }
          }
        }
        setTimeout(() => {
          this.showAnimation = true;
        }, 100);
      } else {
        this.showAnimation = false;
      }
    }
  },
  methods: {
    isFunction: function (value) {
      if (typeof value === 'function') {
        return true
      }
      return false
    },
    //  点击取消
    back() {
      this.$emit('input', false)
      if (this.isFunction(this.cancleCallBack)) {
        this.cancleCallBack()
      }
    },
    //  发送验证码
    getVerCode() {
      if (this.timer > 0 || this.isSendVercode) return;
      if (!/^1[3456789]\d{9}$/.test(this.tel)) {
        Toast.failed('请输入正确的手机号');
        return;
      }
      this.isSendVercode = true;
      get('user.requestSmsPassword', { mobile: this.tel, smsType: 'REGISTER' }).then(response => {
        this.isSendVercode = false;
        let [{ result = false } = {}] = response;
        if (result) {
          this.timer = 59;
          this.sendCount++;
          let timer = setInterval(_ => {
            this.timer--;
            if (this.timer <= 0) {
              clearInterval(timer);
            }
          }, 1000);
        } else {
          Toast.failed('验证码发送失败！');
        }
      });
    },
    // 点击确定登录
    login() {
      if (!/^1[3456789]\d{9}$/.test(this.tel)) {
        Toast.failed('请输入正确的手机号');
        return;
      }
      if (this.vercode.length < 6) {
        Toast.failed('请输入正确的验证码');
        return;
      }
      this.disableLogin = true

      var promise
      if (isWxbrowser() || isAlipayBrowser()) {
        let openId = getOpenId()
        let alipayUserId = getAlipayUserId()
        promise = post('user.appThirdPartyBind', {
          appThirdPartyBind: {
            outId: isAlipayBrowser() ? alipayUserId : openId,
            mobile: this.mobile,
            outType: isAlipayBrowser() ? 'ALIPAY' : 'WEIXIN',
            isWap: 'true',
            outParentId: isAlipayBrowser() ? ALIPAY_APPID : WX_APPID
          },
          _pn: this.mobile,
          _dyn: this.verifyCode
        })
      } else {
        promise = post('user.dynamicPasswordRegisterOrLogin4Wap', {
          _pn: this.mobile,
          _dyn: this.verifyCode
        })
      }

      promise.then(res => {
        if (res && res.content && res.content.length > 0) {
          var {token, uid} = res.content[0]
          if (token) {
            this.toggle(false)
            if (this.isFunction(this.loginSuccess)) {
              this.loginSuccess(res)
            } else {
              hackLocationReload()
            }
            Cookies.set('_wtk', token)
          }

          if (uid) {
            Cookies.set('_uid', uid)
          }
        } else {
          // if (res.stat && res.stat.code === -260) {
          //   this.$toast('验证码错误')
          // } else {
          //   this.$toast('登录失败，请重试')
          // }
          // this.$toast('登录失败，请重试')
          this.disableLogin = false
          if (this.isFunction(this.loginFailt)) {
            this.loginFailt(res)
          }
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.mask
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  height 100%
  width 100%
  background-color rgba(0,0,0,.3)
  z-index 10
.login-wrapper
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  width 100%
  height 100%
  z-index 101
.login-box
  width 540px
  background-color #FFF
  border-radius 21px
  z-index 20
  position relative
  transform scale(0)
  transition transform .2s ease 0s
.popup-animation
  transform scale(1)
.login-title
  height 123px
  line-height 123px
.w-input
  padding 20px 10px
  outline none
  border none
.w-100
  width 100%
.login-content
  padding 0 40px
.vercode
  width 180px
  text-align center
  flex-shrink 0
.vercode-box
  margin-top 20px
.login-btn-wrapper
  height 100px
  margin-top 40px
.login-btn-item
  height 100%
.login-ok
  background-color  #E50011
  border-bottom-right-radius 21px
.login-back
  border-bottom-left-radius 21px
.w-input-vercode
  flex-shrink: 1
  width 100%
input
  :focus
    border 1px solid #E0E0E0
    box-shadow none
    outline none
.van-hairline--surround
  border-radius 8px
</style>
