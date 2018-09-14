import { ALIPAY_APPID, WEB_ROOT } from '@/constants'
import { getAlipayUserId } from '@/utils/common'

function ready (callback) {
  // 如果jsbridge已经注入则直接调用
  if (window.AlipayJSBridge) {
    callback && callback()
  } else {
    // 如果没有注入则监听注入的事件
    document.addEventListener('AlipayJSBridgeReady', callback, false)
  }
}

export default {
  /**
   * 判断是都在支付宝浏览器中
   */
  isAlipayBrowser () {
    let userAgent = navigator.userAgent.toLowerCase()
    return (userAgent.indexOf('alipay') >= 0)
  },
  auth () {
    let newWebUrl = WEB_ROOT.replace('?#', '#')
    let redirectUrl = newWebUrl + '/auth/alipay'
    let callBackUrl = newWebUrl + window.location.href.split('#')[1]
    console.log(callBackUrl)
    // window.location.href = 'https://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id=' + ALIPAY_APPID + '&scope=auth_base&redirect_uri=' + encodeURIComponent(redirectUrl) + '&state=' + encodeURIComponent(callBackUrl)
    window.location.replace('https://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id=' + ALIPAY_APPID + '&scope=auth_base&redirect_uri=' + encodeURIComponent(redirectUrl) + '&state=' + encodeURIComponent(callBackUrl))
  },
  call (event, data) {
    ready(function () {
      window.AlipayJSBridge.call(event, data)
    })
  },
  preAlipayUid () {
    let alipayUserId = getAlipayUserId()
    if (this.isAlipayBrowser() && !alipayUserId) this.auth()
    return alipayUserId
  },
  setShareInfo (shareInfo) {
    this.call('showOptionMenu')
    window.AlipayJSBridge.call('startShare', {
      // 当用户选择该数组内指定的分享渠道时，仅返回渠道名，而不是真正开始自动分享
      'onlySelectChannel': ['Weibo', 'ALPContact', 'ALPTimeLine', 'SMS', 'Weixin', 'WeixinTimeLine', 'QQ', 'QQZone', 'DingTalkSession', 'OpenInSafari', 'Favorite']
    }, function (data) {
      console.log('当前用户点击的分享渠道名为：' + data.channelName)
      // 通过onlySelectChannel屏蔽掉自动分享功能后，自行调用shareToChannel接口进行单独分享
      window.AlipayJSBridge.call('shareToChannel', {
        name: data.channelName,
        param: {
          contentType: 'url', // 选填，目前支持支持'auto',text','image','url'格式（android分享组件不支持auto）
          title: shareInfo.title,
          content: shareInfo.desc,
          iconUrl: shareInfo.img,
          imageUrl: shareInfo.img,
          captureScreen: false, // 是否分享当前页面的截图
          url: shareInfo.link
        }
      }, function (result) {
        console.log(result) // { channelName, shareResult }
        if (result.shareResult) {
          if (shareInfo.success) shareInfo.success()
        } else {
          if (shareInfo.cancel) shareInfo.cancel()
        }
      })
    })
  }
}
