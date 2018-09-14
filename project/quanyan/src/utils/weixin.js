import { post } from '@/services/request'
import { isWxbrowser, getOpenId } from '@/utils/common'
import { WEB_ROOT, WX_APPID } from '@/constants'

export default {
  pro: null,
  getScripts (src) {
    return new Promise((resolve, reject) => {
      let head = document.getElementsByTagName('head')[0]
      let js = document.createElement('script')
      js.setAttribute('type', 'text/javascript')
      js.setAttribute('src', src)
      head.appendChild(js)
      if (document.all) { // IE
        js.onreadystatechange = function () {
          if (js.readyState === 'loaded' || js.readyState === 'complete') {
            resolve()
          }
        }
      } else {
        js.onload = function () {
          resolve()
        }
      }
    })
  },
  init () {
    this.pro = new Promise((resolve, reject) => {
      this.getScripts('https://res.wx.qq.com/open/js/jweixin-1.2.0.js').then(() => {
        post('paycore.getWxPayInfo', {
          payInfoParam: {
            payType: 4,
            url: location.href.split('#')[0]
          }
        }).then(res => {
          window.wx.config({
            debug: false,
            appId: res.content[0].wxAppId,
            timestamp: res.content[0].timestamp,
            nonceStr: res.content[0].nonceStr,
            signature: res.content[0].signature,
            jsApiList: res.content[0].jsApiList
          })
          window.wx.ready(function () {
            resolve()
          })
        }).catch(err => {
          reject(err)
        })
      })
    })
  },
  hideOptionMenu () {
    this.call('hideOptionMenu')
  },
  inited: false,
  call (method, params) {
    if (!isWxbrowser()) return
    if (!this.inited) {
      this.init()
      this.inited = true
    }
    this.pro.then(() => {
      window.wx[method](params)
    })
  },
  setShareInfo (shareInfo) {
    this.call('showOptionMenu')
    this.call('onMenuShareTimeline', {
      title: shareInfo.title,
      link: shareInfo.link,
      imgUrl: shareInfo.img,
      success: shareInfo.success,
      cancel: shareInfo.cancel
    })
    this.call('onMenuShareAppMessage', {
      title: shareInfo.title,
      desc: shareInfo.desc,
      link: shareInfo.link,
      imgUrl: shareInfo.img,
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: shareInfo.success,
      cancel: shareInfo.cancel
    })
    this.call('onMenuShareQQ', {
      title: shareInfo.title,
      desc: shareInfo.desc,
      link: shareInfo.link,
      imgUrl: shareInfo.img,
      success: shareInfo.success,
      cancel: shareInfo.cancel
    })
  },
  auth () {
    let url = window.location.href
    // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WX_APPID + '&redirect_uri=' + encodeURIComponent(WEB_ROOT + '/auth/wx') + '&response_type=code&scope=snsapi_base&state=' + encodeURIComponent(url) + '#wechat_redirect'
    window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WX_APPID + '&redirect_uri=' + encodeURIComponent(WEB_ROOT + '/auth/wx') + '&response_type=code&scope=snsapi_base&state=' + encodeURIComponent(url) + '#wechat_redirect')
  },
  preOpenId () {
    let openId = getOpenId()
    if (isWxbrowser() && !openId) this.auth()
    return openId
  },
  ready (callback) {
    if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
      callback()
    } else {
      document.addEventListener('WeixinJSBridgeReady', callback, false)
    }
  }
}
