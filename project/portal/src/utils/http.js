import axios from 'axios'
import { mergeSelf } from './index'
import config from '~/config'
var { API_BASE_URL, API_TIMEOUT, API_HEADERS } = config
var [baseURL, timeout, headers] = [API_BASE_URL, API_TIMEOUT, API_HEADERS]
var defaults = { baseURL, timeout, headers, needToast: true }

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  config => {
    const regResult = Vue.prototype.$cache.session.get('WX_INFO')
    // 如果是企业微信进来会带info
    if (
      regResult &&
      (location.pathname.indexOf('flow-task-detail') > -1 ||
        location.pathname.indexOf('task-detail-message') > -1)
    ) {
      config.headers.info = regResult
    }
    return config
  },
  err => Promise.reject(err)
)

axios.interceptors.response.use(
  res => {
    window.portalTime =
      new Date(res.headers.date || res.headers.Date).getTime() || Date.now()
    res = handleResponse(res)
    if (res.error) throw res
    return res
  },
  error => Promise.reject(handleResponse(error))
)

export default {
  /**
   * axios(config)
   * config = {url, params, data, headers}
   */
  request(config) {
    return axios(mergeSelf({}, defaults, config))
  },
  axios
}

function handleResponse(_res = {}) {
  if (_res.error || _res instanceof Error) {
    _res.msg = _res instanceof Error ? _res.message : _res.msg
    _res.error = true
    _res.code = 500
    _res.status = 500
  }
  if (typeof _res !== 'object') _res = { _v: _res }
  var { status, data, msg, statusText, config, _v } = _res
  var { apiName, needToast } = config || {}
  var error = true
  var code = status
  msg = msg || statusText
  if (apiName) msg = apiName + '异常，请稍后再试'
  if (status < 200) {
    //response initialize
    if (status === 0 && _res.readyState === 4) {
      msg = '未登录或未授权，请登录'
    } else {
      msg = msg || '网络不给力，请稍后再试'
    }
  } else if (status < 300) {
    error =
      typeof data === 'object' &&
      data &&
      Number(data.code) !== 0 &&
      Number(data.code) !== 20000 &&
      !/arraybuffer|blob/.test(data.toString().toLowerCase())
    //response code 200 ~ 300 success
    msg =
      (typeof data === 'object' && data && data.message) ||
      (error ? '未知异常，请稍后再试' : '操作成功')
  } else if (status < 400) {
    //response redirect 301 ~ 304
    msg = msg || '资源已转移，请稍后再试'
  } else if (status < 500) {
    //response client error 400 ~ 404
    msg = msg || '资源未找到，请稍后再试'
  } else if (status === undefined) {
    code = (_res.response || {}).status
    msg = (_res.response || {}).statusText || '未知异常，请稍后再试'
  } else {
    //response server error 500 ~ 503
    msg = msg || '服务异常，请稍后再试'
  }
  if (typeof data === 'object' && data && data.hasOwnProperty('code')) {
    code = data.code
  }
  if (_v) msg = _v + ''
  var res = Object.assign(Object.create({ response: _res }), { msg, code })
  if (
    typeof data === 'object' &&
    data &&
    !/arraybuffer|blob/.test(data.toString().toLowerCase())
  ) {
    Object.assign(res, data)
  } else {
    res.data = data
  }
  res.error = error
  /*
    {
      _res: Object  // 原始响应
      data: Object  // 真实数据
      msg: String   // 消息提示
      code: Number  // 返回码
      error: true  // 错误标识
    }
  */
  if (window.Vue && error && (code == 20004 || code == 30100)) {
    if (Vue.loginTimeOut) clearTimeout(Vue.loginTimeOut)
    Vue.loginTimeOut = setTimeout(_ => {
      window.location.href = window.Vue.prototype.$constant.LOGIN()
    }, 1000)
  } else {
    if (
      needToast &&
      window.Vue &&
      error
    ) {
      serializeErrorsTip(msg)
    }
  }
  return res
}
/**
 * 队列化错误提示
 * @param  {String} msg 提示语
 */
function serializeErrorsTip (msg) {
  Vue.messageErrors = Vue.messageErrors || []
  if (typeof msg === 'string') {
    Vue.messageErrors.push(_ => window.Vue.prototype.$message.error({
      message: msg,
      onClose: _ => serializeErrorsTip(_)
    }))
  } else {
    Vue.messageErrors.shift()
  }
  var f = Vue.messageErrors[0]
  if (f && f.closed === undefined) {
    /*上一次的错误及时提示*/
    Vue.messageErrors.unshift(Vue.messageErrors.shift()())
  }
  if (f && f.closed) {
    /*上一次的错误弹框已关闭时从队列里剔除*/
    Vue.messageErrors.shift()
  }
}