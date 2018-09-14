let API_ROOT = '//api.yingheying.com'
let WEB_ROOT = 'https://h5.yingheying.com'
let UPLOAD_ROOT = '//file.yingheying.com/file/upload'
// TODO: https img works for ios, but not work in anddroid wechat (share)
// '//imgdatabase.yingheying.com' not work in ios
let IMAGE_ROOT = 'https://imgdatabase.yingheying.com'
// let VEN_ROOT = 'https://h5.yingheying.com/yhy/?#'
let VEN_ROOT = WEB_ROOT
let COOKIE_DOMAIN = '.yingheying.com'
let PMALL_ROOT = 'https://pmall.yingheying.com'
let WX_APPID = 'wxf45cb3432988261f'
let ALIPAY_APPID = '2016062401551344'
let WECHAT_REDIRECT = 'https://h5.yingheying.com/wechat-redirect/'
//  活动主目录
let MIRAFRA_WEB_ROOT = 'https://mirafra.yingheying.com'

// region 公共参数
const defaultParams = {
  offset: '0ce37dd6b927730161a1e559c2336d0a',
  sm: 'md5',
  aid: {
    android: 1,
    iOS: 2,
    h5: 3
  },
  domid: '1000',
  ft: 'json',
  ch: {
    wap: 'wap',
    weixin: 'weixin',
    app: 'app'
  }
}

if (window.location.href.indexOf('h5test.yingheying.com') !== -1 || window.location.href.indexOf('mtest.yingheying.com') !== -1) {
  API_ROOT = '//apitest.yingheying.com'
  WEB_ROOT = 'https://h5test.yingheying.com'
  UPLOAD_ROOT = '//filetest.yingheying.com/file/upload'
  IMAGE_ROOT = 'https://imgdatabasetest.yingheying.com'
  // VEN_ROOT = 'https://h5test.yingheying.com/yhy/?#'
  VEN_ROOT = WEB_ROOT
  PMALL_ROOT = 'https://pmalltest.yingheying.com'
  WX_APPID = 'wxf45cb3432988261f'
  ALIPAY_APPID = '2016062401551344'
  WECHAT_REDIRECT = 'https://h5test.yingheying.com/wechat-redirect/'
  MIRAFRA_WEB_ROOT = 'https://mirafratest.yingheying.com'
} else if (window.location.href.indexOf('h5.yingheying.com') !== -1 || window.location.href.indexOf('m.yingheying.com') !== -1) {
  API_ROOT = '//api.yingheying.com'
  WEB_ROOT = 'https://h5.yingheying.com'
  UPLOAD_ROOT = '//file.yingheying.com/file/upload'
  IMAGE_ROOT = 'https://imgdatabase.yingheying.com'
  // VEN_ROOT = 'https://h5.yingheying.com/yhy/?#'
  VEN_ROOT = WEB_ROOT
  PMALL_ROOT = 'https://pmall.yingheying.com'
  WX_APPID = 'wxbb623080337746d5'
  ALIPAY_APPID = '2018022702284148'
  // defaultParams.offset = '85ba36e03427d95799f1cf635fcfab35'
  WECHAT_REDIRECT = 'https://h5.yingheying.com/wechat-redirect/'
  MIRAFRA_WEB_ROOT = 'https://mirafra.yingheying.com'
} else if (window.location.href.indexOf('127.0.0.1') !== -1 || window.location.href.indexOf('192.168.') !== -1 || window.location.href.indexOf('localhost') !== -1) {
  //  TODO:调试使用
  // API_ROOT = '//apitest.yingheying.com'
  API_ROOT = '//apialpha.yingheying.com' // 本地调试
  WEB_ROOT = 'https://h5test.yingheying.com'
  UPLOAD_ROOT = '//filetest.yingheying.com/file/upload'
  IMAGE_ROOT = 'https://imgdatabasetest.yingheying.com'
  // VEN_ROOT = 'https://h5test.yingheying.com/yhy/?#'
  VEN_ROOT = WEB_ROOT
  COOKIE_DOMAIN = ''
  PMALL_ROOT = 'https://pmalltest.yingheying.com'
  WX_APPID = 'wxf45cb3432988261f'
  ALIPAY_APPID = '2016062401551344'
  WECHAT_REDIRECT = 'https://h5test.yingheying.com/wechat-redirect/'
  MIRAFRA_WEB_ROOT = 'https://mirafratest.yingheying.com'
} else if (window.location.href.indexOf('h5alpha.yingheying.com') !== -1) {
  API_ROOT = '//apialpha.yingheying.com'
  WEB_ROOT = 'https://h5alpha.yingheying.com'
  UPLOAD_ROOT = '//filealpha.yingheying.com/file/upload'
  IMAGE_ROOT = 'https://imgdatabasetest.yingheying.com'
  // VEN_ROOT = 'https://h5test.yingheying.com/yhy/?#'
  VEN_ROOT = WEB_ROOT
  COOKIE_DOMAIN = ''
  PMALL_ROOT = 'https://pmallalpha.yingheying.com'
  WX_APPID = 'wxf45cb3432988261f'
  ALIPAY_APPID = '2016062401551344'
  WECHAT_REDIRECT = 'https://h5test.yingheying.com/wechat-redirect/'
  MIRAFRA_WEB_ROOT = 'https://mirafraalpha.yingheying.com'
} else if (window.location.href.indexOf('h5pre.yingheying.com') !== -1) {
  API_ROOT = '//apipre.yingheying.com'
  WEB_ROOT = 'https://h5pre.yingheying.com'
  UPLOAD_ROOT = '//filepre.yingheying.com/file/upload'
  IMAGE_ROOT = 'https://imgdatabase.yingheying.com'
  // VEN_ROOT = 'https://h5test.yingheying.com/yhy/?#'
  VEN_ROOT = WEB_ROOT
  COOKIE_DOMAIN = ''
  PMALL_ROOT = 'https://pmallpre.yingheying.com'
  WX_APPID = 'wxf45cb3432988261f'
  ALIPAY_APPID = '2016062401551344'
  WECHAT_REDIRECT = 'https://h5test.yingheying.com/wechat-redirect/'
  MIRAFRA_WEB_ROOT = 'https://mirafrapre.yingheying.com'
}

const REDIRECT_INTERVAL = 1000 // Toast间隔1秒跳转页面

const defaultLocation = {
  city: '深圳',
  cityCode: '440300',
  district: '',
  districtCode: '-1',
  lat: 22.539141,
  lng: 113.952459,
  province: '',
  address: ''
}
export {
  API_ROOT,
  WEB_ROOT,
  UPLOAD_ROOT,
  IMAGE_ROOT,
  defaultParams,
  VEN_ROOT,
  COOKIE_DOMAIN,
  PMALL_ROOT,
  REDIRECT_INTERVAL,
  WX_APPID,
  defaultLocation,
  ALIPAY_APPID,
  WECHAT_REDIRECT,
  MIRAFRA_WEB_ROOT
}
