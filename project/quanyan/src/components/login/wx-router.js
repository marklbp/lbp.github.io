import wurl from 'wurl'
import {WX_APPID, COOKIE_DOMAIN, WECHAT_REDIRECT} from '@/constants'
import {isWxbrowser, getOpenId} from '@/utils/common'
import {post} from '@/services/request'
import Cookies from 'js-cookie'

const RECEIVING_WX_CODE = 'receivingwxcode'
const cookieDomain = {domain: COOKIE_DOMAIN}

// window.gk = function (key) {
//   return Cookies.get(key || '_openId')
// }
//
// window.sk = function () {
//   Cookies.set('_openId', '')
// }
//
// window.k = Cookies

// const baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize#wechat_redirect'

// const redirect = (scope) => {
//   var baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
//   var tail = '#wechat_redirect'
//   scope = scope || 'snsapi_base'
//   var url = `${baseUrl}appid=${WX_APPID}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_base&state=${RECEIVING_WX_CODE}${tail}`
//   window.location.replace(url)
// }

export default (to, from, next) => {
  if (isWxbrowser()) {
    // 0. check code
    // 1. check openId
    // 2. check userId

    var query = wurl('?')
    var openId = getOpenId()

    if (!openId && query && query.state === RECEIVING_WX_CODE && query.code) {
      post('paycore.getWxPayOpenId', {
        payInfoParam: {
          payType: 4, code: query.code
        }
      }).then(res => {
        if (res.content && res.content.length > 0 && res.content[0].openId) {
          var openId = res.content[0].openId
          Cookies.set('_openId', openId, cookieDomain)
          return post('user.appThirdPartyLogin', {
            appThirdPartyLogin: {
              outId: openId,
              outType: 'WEIXIN',
              outParentId: WX_APPID,
              isWap: 'true'
            }
          }).then(res => {
            if (res && res.content && res.content.length > 0) {
              var {token, uid} = res.content[0]
              token && Cookies.set('_wtk', token, cookieDomain)
              uid && Cookies.set('_uid', uid, cookieDomain)
            }
            next()
          })
        }
      })
      return
    }

    if (!openId) {
      var wxRedirectUrl = `${WECHAT_REDIRECT}?appid=${WX_APPID}&state=${RECEIVING_WX_CODE}&redirect_uri=${encodeURIComponent(window.location.href)}`
      return window.location.replace(wxRedirectUrl)
      // return redirect()
    }
  }
  next()
}
