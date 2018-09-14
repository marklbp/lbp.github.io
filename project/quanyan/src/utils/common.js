import { defaultParams, COOKIE_DOMAIN } from '@/constants'
import Cookies from 'js-cookie'
import md5 from 'blueimp-md5'
import { stringify } from '@/utils/url'

function isApp () {
  var ua = window.navigator.userAgent.toLowerCase()
  // TODO: userAgent 暂时兼容 yhyapp 字符串
  return ua.indexOf('yingheying') !== -1 || ua.indexOf('yhyapp') !== -1
}

function isIOS () {
  return /(iPad|iPhone|iPod)/i.test(navigator.userAgent)
}

function isAndroid () {
  return /Android/i.test(navigator.userAgent)
}

function isPhoneX () {
  return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
}

/**
 * 是否在微信
 */
function isWxbrowser () {
  var ua = window.navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}

const isAlipayBrowser = () => window.navigator.userAgent.toLowerCase().indexOf('alipayclient') !== -1

function isMeizu () {
  return isAndroid() && /(m1\snote|MEIZU|MX4|M040|M045|M351|M353|M355|M356)/.test(navigator.userAgent)
}

function getChanelCode () {
  var ch = Cookies.get('_ch')
  if (ch) {
    return ch
  }
  if (isApp()) {
    return defaultParams.ch.app
  }
  if (isWxbrowser()) {
    return defaultParams.ch.weixin
  }
  return defaultParams.ch.wap
}

function getAppId () {
  if (isApp()) {
    return isIOS() ? defaultParams.aid.iOS : defaultParams.aid.android
  }
  return defaultParams.aid.h5
}

const getWebToken = () => Cookies.get('_wtk') || ''
const getUserId = () => Cookies.get('_uid') || ''
const getOpenId = () => Cookies.get('_openId') || ''
const getAlipayUserId = () => Cookies.get('_alipayUserId') || ''

function getCoordinates () {
  let defaultCoordinates = {lat: 22.539141, lng: 113.952459}
  let { lat, lng } = defaultCoordinates
  let coordinates = window.localStorage.getItem('_geolocation')
  if (coordinates) {
    try {
      coordinates = JSON.parse(coordinates)
      lat = coordinates.lat
      lng = coordinates.lng
      if (typeof lat === 'undefined' || typeof lng === 'undefined') {
        return defaultCoordinates
      }
    } catch (e) {
    }
  }
  return {lat, lng}
}

function setUserInfo (user) {
  if (process.env.NODE_ENV === 'development' || !isApp()) {
    user.uid && Cookies.set('_uid', user.uid, {
      domain: COOKIE_DOMAIN
    })
    user.token && Cookies.set('_wtk', user.token, {
      domain: COOKIE_DOMAIN
    })
    user.openId && Cookies.set('_openId', user.openId, {
      domain: COOKIE_DOMAIN
    })
    user.alipayUserId && Cookies.set('_alipayUserId', user.alipayUserId, {
      domain: COOKIE_DOMAIN
    })
  }
}

function isLogin () {
  return !!getUserId()
}

function parseParams (params) {
  // let arr = Object.keys(params).map(p => {
  //   if (typeof params[p] !== 'undefined' && params[p] !== null) {
  //     return `${p}=${encode(params[p])}`
  //   }
  // })

  return stringify(params)
}

function isObject (value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object'
}

function stringifyDeep (params) {
  var _params = {}
  for (let i in params) {
    if (isObject(params[i])) {
      _params[i] = JSON.stringify(params[i])
    } else {
      _params[i] = params[i]
    }
  }
  return _params
}

function encryptRequestParam (options, type) {
  var _params = {}
  let coordinates = getCoordinates()
  try {
    _params._sm = defaultParams.sm // 加密方式
    _params._aid = getAppId() // AppId
    _params._domid = defaultParams.domid // domain ID
    _params._ft = defaultParams.ft // 返回数据格式：json or xml
    // TODO: 是否需要每次都重新获取 渠道 和 web token
    _params._ch = getChanelCode() // 渠道号
    _params._tk = getWebToken() // web token
    _params._uid = getUserId() // user id
    _params._lat = coordinates.lat
    _params._lng = coordinates.lng

    options = stringifyDeep(options)
    var s = ''
    var keys = []
    var params = Object.assign(_params, options)
    for (var k in params) {
      keys.push(k)
    }
    keys.sort()
    for (var i = 0; i < keys.length; i++) {
      s = s + keys[i] + '=' + params[keys[i]]
    }
    s += defaultParams.offset
    params._sig = md5(s)
    console.log('--- wmr: resquest params', _params)
    return type === 'get' ? params : parseParams(params)
  } catch (e) {
    throw new Error('本地加签错误' + e)
  }
}
function getClientInfo (callback, failCallBack) {
  if (typeof window.yhyBridge !== 'undefined') {
    window.yhyBridge.ready().then((sdk) => {
      sdk.callHandler('setNavbarTransparent').then((res) => {
        // success{code:0, msg"成功":,data:jsonObj}
        if (callback && typeof callback === 'function') {
          callback(res)
        }
        callback(res)
      }).catch((err) => {
        // fail
        if (failCallBack && typeof failCallBack === 'function') {
          failCallBack(err)
        }
        console.log(err)
      })
    }).catch(function (err) {
      // not surport
      if (failCallBack && typeof failCallBack === 'function') {
        failCallBack(err)
      }
      console.log(err)
    })
  }
}

// FIXME: 刷新问题，需要新的刷新方法
function hackLocationReload () {
  let h = window.location.href
  let o = h.indexOf('?#') !== -1 ? '?#' : '#'
  let a = h.split(o)
  let b = o === '?#' ? '#' : '?#'
  window.location.replace(a[0] + b + (a[1] || ''))
}

export {
  parseParams,
  encryptRequestParam,
  isLogin,
  getUserId,
  getOpenId,
  setUserInfo,
  getClientInfo,
  getCoordinates,
  isApp,
  isWxbrowser,
  isAlipayBrowser,
  isIOS,
  isAndroid,
  isPhoneX,
  isMeizu,
  getAlipayUserId,
  hackLocationReload
}
