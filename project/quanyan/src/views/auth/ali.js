import { ensure, possible, post } from '@/services/request'
import Cookies from 'js-cookie'
import { ALIPAY_APPID, COOKIE_DOMAIN } from '@/constants'
import { parse } from '@/utils/url'

const cookieDomain = {domain: COOKIE_DOMAIN}

export default {
  functional: true,
  render () {
    init()
  }
}

function init () {
  let qs = parse(window.location.hash)
  let code = qs['app_auth_code']
  let scope = qs['scope']
  let source = qs['source']
  let url = qs['state']
  ensure(post('resourcecenter.getAliPayUserInfo', {
    alipayBasicReq: {
      scope: scope,
      source: source,
      auth_code: code
    }
  }), () => {
    // TODO: 支付宝生活号授权登录获取 alipay userId 异常处理
    // this.$toast.error('支付宝生活号授权登录获取userId异常')
  }).then(data => {
    Cookies.set('_alipayUserId', data.user_id, cookieDomain)
    return possible(post('user.appThirdPartyLogin', {
      appThirdPartyLogin: {
        outId: data.user_id,
        outType: 'ALIPAY',
        outParentId: ALIPAY_APPID,
        isWap: 'true'
      }
    })).then(data => {
      if (data) {
        var {token, uid} = data
        token && Cookies.set('_wtk', token, cookieDomain)
        uid && Cookies.set('_uid', uid, cookieDomain)
      }
      window.location.replace(url)
    }).catch(_ => {
      // TODO: handle errer
      // this.$toast.error('支付宝绑定异常')
    })
  }).catch(_ => {
    // TODO: handle errer
    // this.$toast.error(err.msg)
  })

  // post('resourcecenter.getAliPayUserInfo', {
  //   alipayBasicReq: {
  //     scope: scope,
  //     source: source,
  //     auth_code: code
  //   }
  // }).then(res => {
  //   if (res.content && res.content.length > 0 && res.content[0].user_id) {
  //     Cookies.set('_alipayUserId', res.content[0].user_id, cookieDomain)
  //
  //     return post('user.appThirdPartyLogin', {
  //       appThirdPartyLogin: {
  //         outId: res.content[0].user_id,
  //         outType: 'ALIPAY',
  //         outParentId: ALIPAY_APPID,
  //         isWap: 'true'
  //       }
  //     }).then(res => {
  //       if (res && res.content && res.content.length > 0) {
  //         var {token, uid} = res.content[0]
  //         token && Cookies.set('_wtk', token, cookieDomain)
  //         uid && Cookies.set('_uid', uid, cookieDomain)
  //       }
  //       window.location.replace(url)
  //     }).catch(_ => {
  //       // TODO: handle errer
  //       // this.$toast.error('支付宝绑定异常')
  //     })
  //   } else {
  //     // TODO: 支付宝生活号授权登录获取 alipay userId 异常处理
  //     // this.$toast.error('支付宝生活号授权登录获取userId异常')
  //   }
  // }).catch(_ => {
  //   // TODO: handle errer
  //   // this.$toast.error(err.msg)
  // })
}
