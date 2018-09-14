<template>
  <div class="login-dialog-container">
    <md-popup v-model="value" :prevent-scroll="true">
      <div class="dialog-content">
        <div class="title f-30 center-flex font-b">请先登录</div>
        <div class="f-30 flex-wrap content-body">
          <div class="mobile input-content center-flex-v">
            <input class="input" placeholder="输入手机号" max="11" min="11" maxlength="11" v-model="mobile"/>
          </div>
          <div class="checkcode input-content flex-b-yc f-26">
            <input class="input" placeholder="输入验证码" max="10" v-model="verifyCode"/>
            <div class="get-check-code center-flex">
              <sms-verify-code :validate="validateMobile" :send="getVerifyCode"></sms-verify-code>
            </div>
          </div>
        </div>
        <div class="hander-btn-contetn flex f-34">
          <button class="c-c1" @click.stop="cancleHander">取消</button>
          <button class="c-t4" :disabled="disableLogin" :class="!disableLogin?'confirm-enable':'confirm-disable'" @click.stop="userLogin">登录</button>
        </div>
      </div>
    </md-popup>
  </div>
</template>

<script>
import { post, get } from '@/services/request'
import { Popup, Toast } from 'mand-mobile'
import smsVerifyCode from '@/components/sms-verify-code.vue'
import { hackLocationReload, isWxbrowser, getOpenId } from '@/utils/common'
import {WX_APPID, COOKIE_DOMAIN} from '@/constants'
import Cookies from 'js-cookie'

const cookieDomain = {domain: COOKIE_DOMAIN}

export default {
  components: {
    [Popup.name]: Popup,
    smsVerifyCode
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loginSuccess: Function,
    loginFailt: Function,
    cancleCallBack: Function,
    silence: {
      type: Boolean,
      default: true
    },
    resolve: {
      type: Function,
      default: () => null
    }
  },
  data: function () {
    return {
      mobile: '',
      verifyCode: '',
      disableLogin: false
    }
  },
  wacth: {
    value: function (val) {
      this.toggle(val)
    }
  },
  // beforeCreate () {
  //   this.$store = this.$options.store
  // },
  mounted: function () {
    this.$emit('input', true)
    console.log(this.value)
  },
  methods: {
    toggle: function (bol) {
      this.$emit('input', bol)
    },
    reInitData: function () {
      this.mobile = ''
      this.verifyCode = ''
    },
    getVerifyCode (vm) {
      get('user.requestSmsPassword', {
        mobile: this.mobile,
        smsType: 'REGISTER' // TODO: should we use 'LOGIN' here?
      }).then(res => {
        if (res.content && res.content[0] && res.content[0].result) {
          Toast.succeed('验证码发送成功')
        }
      })
    },
    validateMobile () {
      // 返回值判定是否可以发送
      let result = /^1[3456789]\d{9}$/.test(this.mobile)
      console.log('判断是否可以发送验证码', result, this.mobile)
      if (!result) {
        Toast.info('手机号格式不正确')
      }
      return result
    },
    isFunction: function (value) {
      if (typeof value === 'function') {
        return true
      }
      return false
    },
    cancleHander: function () {
      this.toggle(false)
      this.disableLogin = false
      if (this.isFunction(this.cancleCallBack)) {
        this.cancleCallBack()
      }
    },
    userLogin () {
      if (!this.validateMobile()) return
      this.disableLogin = true

      var promise
      // if (this.silence && (isWxbrowser() || isAlipayBrowser())) {
      if (this.silence && isWxbrowser()) {
        let openId = getOpenId()
        // let alipayUserId = getAlipayUserId()
        promise = post('user.appThirdPartyBind', {
          appThirdPartyBind: {
            // outId: isAlipayBrowser() ? alipayUserId : openId,
            outId: openId,
            mobile: this.mobile,
            // outType: isAlipayBrowser() ? 'ALIPAY' : 'WEIXIN',
            outType: 'WEIXIN',
            isWap: 'true',
            // outParentId: isAlipayBrowser() ? ALIPAY_APPID : WX_APPID
            outParentId: WX_APPID
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

          if (uid) {
            Cookies.set('_uid', uid, cookieDomain)
          }
          if (token) {
            Cookies.set('_wtk', token, cookieDomain)
            this.toggle(false)
            if (this.isFunction(this.loginSuccess)) {
              this.loginSuccess(res)
            } else {
              hackLocationReload()
            }
          }

          if (token && uid) this.resolve(true)
        } else {
          // if (res.stat && res.stat.code === -260) {
          //   Toast('验证码错误')
          // } else {
          //   Toast('登录失败，请重试')
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
}
</script>

<style lang="scss">
.login-dialog-container {
  .md-popup-box {
    background: #fff;
  }
}
  .dialog-content{
    .title{
      margin: 50px 0px;
    }
    .content-body{
      padding: 0px 40px;
      .input-content{
        width: 100%;
        height: 88px;
        border: 1px solid $color-b2;
        padding: 0px 10px;
        border-radius: 5px;
        input{
          width: 100%;
          border: none;
          outline: 0;
        }
      }
      .mobile{
        margin-bottom:20px ;
      }
      .checkcode{
        input{
          width: 200px;
        }
        .get-check-code{
          margin-left: 20px;
          .text{
            padding-left: 20px;
            border-left: 1px solid $color-b2;
          }
        }
        margin-bottom: 40px;
      }
    }
    .hander-btn-contetn{
      button{
        width: 50%;
        height: 88px;
        background: none;
        border: 0px;
      }
      button:first-child {
        border-top: 1px solid $color-b2;
      }
      .confirm-enable{
        background: $color-l1;
      }
      .confirm-disable{
        background: $color-t2;
      }
    }
  }

</style>
