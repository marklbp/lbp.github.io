// import { isLogin, isApp, isWxbrowser, isIOS } from '@/utils/common'
import { isLogin, isApp, isIOS } from '@/utils/common'
import {isFunction} from '@/utils'
import loginDialog from '@/components/login/login-dialog'
import { PMALL_ROOT } from '@/constants'
import { Toast } from 'mand-mobile'
// import router from '@/router'
// import weixin from '@/utils/weixin'
import clipcopy from '@/utils/clipcopy'
import compareVersion from '@/utils/semver'
// import { wxPayResultStatusEnum, alipayResultStatusEnum } from '@/constants/pay'
// import loopQueryOrderStatus from '@/services/loop-query-order-status'
// import toggleLoading from '@/components/loading/loading2'

var yhyBridge = window.yhyBridge
const SHARE_DEFAULT_IMAGE = 'https://shadow.yingheying.com/default/share.png'
// const SHARE_DEFAULT_IMAGE = 'https://shadow.yingheying.com/crayfish/c486e38574fd1d84fbfc09dabf72939b.png?x-oss-process=image/resize,w_100'
const SHARE_ICON = 'https://imgdatabase.yingheying.com/a99c331c6cf38a10dabb418223fd3b5f.png'

// 添加右上角按钮
const btnCallbackName = 'H5_REGISTER_NAV_BUTTON_CALLBACK_'
var btnId = 0
function nextBtnCallback () {
  return btnCallbackName + btnId++
}
export function setButton ({title, icon, onclick, color = '#000000'}) {
  if (!isApp()) return
  var fnId = nextBtnCallback()
  window.yhyBridge.ready().then((sdk) => {
    register(fnId, () => {
      onclick()
    })
    setNavButton(title, icon, fnId, color)
  })
}

// 添加右上角分享按钮
export function setShare (url, title, desc, pic) {
  const callback = 'triggerShare'
  window.yhyBridge.ready().then((sdk) => {
    register(callback, () => {
      share(url, title, desc, pic)
    })
    setNavButton('分享', SHARE_ICON, callback)
  })
}

// 唤起分享
export function share (url, title, desc, pic) {
  window.yhyBridge.ready().then((sdk) => {
    // android: desc can not be empty
    // ios: pic can not be empty
    // sdk.callHandler('share', {url, title, desc, pic: pic || SHARE_DEFAULT_IMAGE})
    sdk.callHandler('share', {url, title: title || ' ', desc: desc || ' ', pic: pic || SHARE_DEFAULT_IMAGE})
  })
}

//  分享图片
export function sharePicture (url = '') {
  if (url === '') return false
  if (isApp()) {
    yhyBridge.ready().then((sdk) => {
      sdk.callHandler('getClientInfo').then(data => {
        let item = JSON.parse(data || '{}')
        let appVersion = item.appVersion || ''
        const isIOS = item.os === 'ios'
        const lasterVersion = isIOS ? '3.1.5' : '3.1.6'
        if (compareVersion.lt(appVersion, lasterVersion)) {
          Toast.info(`有新版本啦！可以分享截图，赶快去升级吧`)
        } else {
          sdk.callHandler('sharePicture', {url})
        }
      })
    })
  }
}

/*
 *  ⚠️ color 为必传字段
 *    native 使用上一次的颜色值设置标题颜色（默认黑色），
 *    如果不传颜色，h5无从知晓上一次设置title时的颜色值
*/
export function setTitle (title, color = '#000000') {
  document.title = title
  if (isApp()) {
    yhyBridge.ready().then(function (sdk) {
      // console.log('setnativetitle.color: ', color)
      sdk.callHandler('setNativeTitle', {title, color})
    })
  } else {
    if (isIOS()) {
      let hackIframe = document.createElement('iframe')
      hackIframe.style.display = 'none'
      hackIframe.src = '//place.yingheying.com/favicon.ico'
      hackIframe.addEventListener('load', function () {
        setTimeout(() => {
          document.body.removeChild(hackIframe)
        })
      })
      document.body.appendChild(hackIframe)
    }
  }
}

window.st = setTitle

export function register (name, fn) {
  yhyBridge.ready().then(function (sdk) {
    sdk.register(`common.${name}`, (data, callback) => {
      fn(data, callback)
      // log('点击了右上角搜索按钮');
    })
  })
}

export function setNavButton (title, icon, callback, color = '#000000') {
  yhyBridge.ready().then(function (sdk) {
    sdk.callHandler('setNavButton', {
      status: 'show',
      data: [{title, icon, callback: `common.${callback}`, color}]
    }).then(data => {
      // success
    }).catch(err => {
      // err
      console.log(err)
    })
  })
}

export function setNavbarTransparent (showParmas, callback) {
  if (isApp()) {
    yhyBridge.ready().then((sdk) => {
      sdk.callHandler('setNavbarTransparent', showParmas).then(res => {
        isFunction(callback) && callback()
      })
    })
  } else {
    isFunction(callback) && callback()
  }
}

export function delNavButtons () {
  if (!isApp()) return
  yhyBridge.ready().then(function (sdk) {
    sdk.callHandler('setNavButton', {status: 'hide', data: []})
  })
}

export function openNative (operation, data) {
  let uri = {
    'TYPE': 'YHY',
    'OPERATION': operation,
    'DATA': data ? JSON.stringify(data) : ''
  }
  window.location.href = `yhyapp://app?content=${JSON.stringify(uri)}`
  // yhyBridge.ready().then(function (sdk) {
  //   sdk.callHandler('openNative',
  //     {url: `yhyapp://app?content={"TYPE":"YHY","OPERATION":${operation},"DATA":${JSON.stringify(data)}}`}).then(data => {
  //     // console.log('succeed: ', data)
  //   }).catch(() => {
  //     // console.log('failed: ', err)
  //   })
  // })
}

export function login (option) {
  if (!isLogin()) {
    forceLogin(option)
  }
}

export function forceLogin (option) {
  if (isApp()) {
    openNative('LOGIN')
  } else {
    loginDialog.open(option)
  }
}

// TODO: wxlogin still not work: ios & android
export function wxLogin () {
  return yhyBridge.ready().then(function (sdk) {
    return sdk.callHandler('wxLogin')
  })
}

// TODO: move out
// export function openPlaceDetailH5 (order) {
//   // let url = ''
//   if (order.detailOrders[0].sportType) {
//     router.push({name: 'reservePlace',
//       params: {
//         orgId: order.orgInfo.id,
//         categoryId: order.detailOrders[0].sportType.dataKey
//       }})
//   } else {
//     router.push({name: 'reservePlace',
//       params: {
//         orgId: order.orgInfo.id
//       }})
//   }
// }
export function openPMallDetail (itemId) {
  if (isApp()) {
    openNative('VIEW_INTEGRAL_MALL_DETAIL', {
      id: itemId
    })
  } else {
    window.location.href = `${PMALL_ROOT}/view/mall/detail.html?id=${itemId}`
  }
}

export function dial (mobile) {
  yhyBridge.ready().then((sdk) => {
    sdk.callHandler('dial', {data: mobile})
  })
}

export function openMaster (params) {
  if (isApp()) {
    openNative('MASTER_DETAIL', params)
  }
}

// TODO: move out
// export function processPayResult (res, order, onSuccess) {
//   if (res.status === 'success' || res.status === 'unknown') {
//     toggleLoading(true, {
//       text: '支付确认中...',
//       delay: 0
//     })
//     loopQueryOrderStatus(order.bizOrder.bizOrderId, {interval: 1000, callback: (order) => order.bizOrder.orderStatus === 'WAITING_DELIVERY'}).then((res) => {
//       toggleLoading(false)
//       toast('支付成功')
//       isFunction(onSuccess) && onSuccess()
//       reloadForPay(order)
//     }).catch((err) => {
//       toggleLoading(false)
//       console.log(err)
//       toast('获取支付结果失败')
//       reloadForPay(order)
//     })
//   } else if (res.status === 'cancel') {
//     toast('取消支付')
//     reloadForPay(order)
//   } else if (res.status === 'uninstall') {
//     toast('请安装微信客户端')
//     // console.log('payRes', res.status)
//   } else {
//     toast('支付失败')
//     reloadForPay(order)
//   }
// }

// TODO: move out
// export function wxPay (info, order, onSuccess) {
//   return new Promise((resolve, reject) => {
//     if (isApp()) {
//       // App 内支付
//       yhyBridge.ready().then(function (sdk) {
//         sdk.callHandler('wxPay', info).then(data => {
//           if (typeof data === 'string') {
//             data = JSON.parse(data)
//           }
//           console.log('wxPay data', data)
//           let status = 'fail'
//           if (data && data.status * 1 === 0) {
//             status = 'success'
//           }
//           if (data && data.status * 1 === -2) {
//             status = 'cancel'
//           }
//           if (data && data.status === 'unknown') {
//             status = 'unknown'
//           }
//           if (data && data.status === 'uninstall') {
//             status = 'uninstall'
//           }
//           resolve({
//             status: status,
//             data: data
//           })
//         }).catch((err) => {
//           reject(err)
//         })
//       })
//     } else if (isWxbrowser()) {
//       // 微信 内支付
//       weixin.call('chooseWXPay', {
//         timestamp: info.timestamp,
//         nonceStr: info.noncestr,
//         package: info.packageStr,
//         signType: info.signType,
//         paySign: info.sign,
//         success: function (res) {
//           resolve({
//             status: 'success',
//             data: res
//           })
//         },
//         cancel: function (res) {
//           resolve({
//             status: 'cancel',
//             data: res
//           })
//         },
//         fail: function (res) {
//           resolve({
//             status: 'fail',
//             data: res
//           })
//         }
//       })
//     } else {
//       // Wap 支付
//       window.location.href = info.dataJson
//     }
//   }).then(res => {
//     console.log('wxPay res', res)
//     processPayResult(res, order, onSuccess)
//   }).catch(err => {
//     console.log(err)
//     toast('支付失败')
//   })
// }

// TODO: move out
// export function aliPay (info, order, onSuccess) {
//   return new Promise((resolve, reject) => {
//     console.log(isApp())
//     if (isApp()) {
//       // App 内支付
//       yhyBridge.ready().then(function (sdk) {
//         sdk.callHandler('aliPay', {
//           'payInfo': info
//         }).then(data => {
//           if (typeof data === 'string') {
//             data = JSON.parse(data)
//           }
//           console.log('aliPay data', data)
//           let status = 'fail'
//           if (data && data.status * 1 === 9000) {
//             status = 'success'
//           }
//           if (data && data.status * 1 === 6001) {
//             status = 'cancel'
//           }
//           if (data && data.status === 'unknown') {
//             status = 'unknown'
//           }
//           resolve({
//             status: status,
//             data: data
//           })
//         }).catch((err) => {
//           reject(err)
//         })
//       })
//     } else {
//       // Wap 支付
//       const div = document.createElement('div')
//       div.innerHTML = info
//       document.body.appendChild(div)
//       document.forms.payForm.submit()
//     }
//   }).then(res => {
//     console.log('aliPay res', res)
//     processPayResult(res, order, onSuccess)
//   }).catch(err => {
//     console.log(err)
//     toast('支付失败')
//   })
// }

// TODO: move out
// export function reloadForPay (order) {
//   setTimeout(() => {
//     // order.isPaySuccess
//     if (order.h5PriType === 'list') {
//       // 跳转订单列表
//       router.replace({
//         name: 'order-list'
//       })
//     } else if (router.currentRoute.name === 'order-detail') {
//       // 刷新
//       openOrderDetail(order, {
//         force: true,
//         replace: true
//       })
//     } else {
//       // 跳转成功页
//       openOrderDetail(order, {
//         replace: true
//       })
//     }
//   }, 800)
// }

export function toast (msg) {
  Toast({
    content: msg
  })
}

export function copyText (el) {
  el = typeof el === 'string' ? document.querySelector(el) : el
  return clipcopy(el).then(data => {
    toast('已复制到剪贴板')
  }).catch(() => {
    toast('当前系统不支持复制')
  })
}

export function getClientInfo (mobile) {
  return yhyBridge.ready().then((sdk) => {
    return sdk.callHandler('getClientInfo').then(res => {
      return JSON.parse(res)
    })
  })
}

export function saveQrCode (url) {
  if (isApp()) {
    return yhyBridge.ready().then((sdk) => {
      sdk.callHandler('saveQrCode', {data: url}).then((data) => {
      }).catch((err) => {
        console.log(err)
      })
    })
  }
}

// TODO: move out
// export function openOrderDetail (order, opt = {force: false, replace: false}) {
//   let data = {
//     name: 'order-detail',
//     params: {
//       id: order.bizOrder.bizOrderId
//     }
//   }
//   let query = {}
//   if (order.isPaySuccess) {
//     query.needLoop = true
//   }
//   if (opt.force) {
//     query.t = new Date().getTime()
//   }
//   data.query = query
//   if (isApp()) {
//     if (order.bizOrder.orderType === 'PROCESS') {
//       openNative('CONSULT_ORDER_DETAIL', {
//         orderId: order.bizOrder.outerId,
//         orderType: order.bizOrder.orderType
//       })
//     } else if (order.bizOrder.orderType === 'POINT_MALL') {
//       openNative('POINT_ORDER_DETAIL', {
//         orderId: order.bizOrder.bizOrderId,
//         orderType: order.bizOrder.orderType
//       })
//     } else {
//       router[opt.replace ? 'replace' : 'push'](data)
//     }
//   } else {
//     router[opt.replace ? 'replace' : 'push'](data)
//   }
// }

// TODO:  move out
// 显示地图导航 params = {lat=xx&&lng=xxx&title=xxxx&address=上海市xx路}
// export function goMapNavigation (params) {
//   console.log(params)
//   if (isApp()) {
//     return yhyBridge.ready().then((sdk) => {
//       console.log('=====>>>>>>', {
//         lng: params.lng + '',
//         lat: params.lat + '',
//         title: params.title || '地图',
//         address: params.address
//       })
//       sdk.callHandler('showmap', {
//         lng: params.lng + '',
//         lat: params.lat + '',
//         title: params.title || '地图',
//         address: params.address
//       }).then((data) => {
//         console.log('data', data)
//       }).catch((err) => {
//         console.log('err', err)
//       })
//     })
//   } else {
//     router.push({
//       name: 'map-navigation',
//       params: {
//         lng: params.lng,
//         lat: params.lat,
//         title: params.title || 'title',
//         address: params.address
//       }
//     })
//   }
// }
export function openWebview (url) {
  if (isApp()) {
    return yhyBridge.ready().then((sdk) => {
      sdk.callHandler('openWebview', {url}).then((data) => {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    })
  } else {
    window.location.href = url
  }
}
export function nativeGoBack (callback) {
  return new Promise((resolve, reject) => {
    window.yhyBridge.ready().then((sdk) => {
      sdk.register('common.nativeGoBack', () => {
        // 这里执行页面逻辑
        resolve()
        isFunction(callback) && callback()
      })
    })
  })
}
export function closeWebview () {
  return new Promise((resolve, reject) => {
    window.yhyBridge.ready().then((sdk) => {
      sdk.callHandler('closeWebview', () => {
        // 这里执行页面逻辑
        resolve()
      })
    })
  })
}

export default {
  share,
  setShare,
  setTitle,
  setNavButton,
  register,
  delNavButtons,
  openNative,
  login,
  forceLogin,
  wxLogin,
  // openPlaceDetailH5,
  // wxPay,
  // aliPay,
  dial,
  openMaster,
  copyText,
  getClientInfo,
  saveQrCode,
  // openOrderDetail,
  setNavbarTransparent,
  // reloadForPay,
  openWebview,
  setButton,
  closeWebview,
  // processPayResult,
  nativeGoBack
}
