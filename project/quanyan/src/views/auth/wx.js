/* eslint-disable */
import { post } from '@/services/request'
import Cookies from 'js-cookie'
import { parse } from '@/utils/url'
import { WX_APPID, COOKIE_DOMAIN } from '@/constants'

const cookieDomain = {domain: COOKIE_DOMAIN}

export default {
  functional: true,
  render () {
    init()
  }
}

function init () {
  var qs = parse(window.location.search)
  var t = qs['code']
  var url = qs['state']

  post('paycore.getWxPayOpenId', {
    payInfoParam: {
      payType: 4,
      code: t
    }
  }).then(res => {
    if (res.content && res.content.length > 0 && res.content[0].openId) {
      var openId = res.content[0].openId
      Cookies.set('_openId', openId, cookieDomain)
      return post('user.appThirdPartyLogin', {
        outId: openId,
        outType: 'WEIXIN',
        outParentId: WX_APPID,
        isWap: 'true'
      }).then(res => {
        if (res && res.content && res.content.length > 0) {
          var {token, uid} = res.content[0]
          token && Cookies.set('_wtk', token, cookieDomain)
          uid && Cookies.set('_uid', uid, cookieDomain)
        }
        window.location.replace(url)
      }).catch(_ => {
        console.log(err)
        // TODO: 微信绑定异常
        // this.$toast.error('微信绑定异常')
      })
    } else {
      // TODO: 微信授权登录获取 openId 异常处理
      // this.$toast.error('微信授权登录获取 openId 异常')
    }
  }).catch(_ => {
    // TODO: handle error
    // this.$toast.error(err.msg)
  })
}
