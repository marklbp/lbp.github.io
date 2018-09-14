import Vue from 'vue'
import {isWxbrowser, isAlipayBrowser} from '@/utils/common'
import weixin from '@/utils/weixin'
import alipay from '@/utils/alipay'
import authWX from '@/views/auth/wx.js'
import authAli from '@/views/auth/ali.js'
import {login} from '@/services/native'

// 微信免授权白名单
const wxWhiteList = ['auth-wx', 'memberRule', 'memberBook', 'QAndA', 'upgradeStrategy']
// 支付宝免授权白名单
const aliWhiteList = ['auth-alipay', 'memberRule', 'memberBook', 'QAndA', 'upgradeStrategy']

export default {
  before (to, from, next) {
    return {
      trace () {
        /* add pageview trace */
        // TODO: need to fix 'demo' bug (use wurl)
        Vue.prototype.$trace.pageview(`/demo/#${to.path}`, from.path === '/' ? '' : `/demo/#${from.path}`)
        return this
      },
      auth () {
        // 微信免授权登录
        isWxbrowser() && wxWhiteList.indexOf(to.name) === -1 && weixin.preOpenId()
        isAlipayBrowser() && aliWhiteList.indexOf(to.name) === -1 && alipay.preAlipayUid()
        return this
      }
    }
  },
  after (to, from, next) {
    return {
      login () {
        to.meta && to.meta.auth && login()
        return this
      }
    }
  },
  routes: {
    auth: [
      // 微信验证跳转页面
      {
        path: '/auth/wx',
        name: 'auth-wx',
        component: authWX,
        meta: {
          title: '跳转中'
        }
      },
      // 微信验证跳转页面
      {
        path: '/auth/ali',
        name: 'auth-alipay',
        component: authAli,
        meta: {
          title: '跳转中'
        }
      }
    ]
  }
}
