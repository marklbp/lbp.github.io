import axios from 'axios'
import {API, HEAD, BASE_URL, BASE_URL_PRO} from '../config/api'
import {tipX, tipLoading, tipErr, merge, copy} from './utils'

export var wxLoginUrl = BASE_URL_PRO + API.getUserToken.url

var instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60000
})

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'


// Add a request interceptor
instance.interceptors.request.use(
  req => {
    tipLoading('载入中')
    return req
  },
  err => {
    tipX()
    let result = {
      code: -1,
      msg: err.message || err.msg || err.statusText || '网络异常'
    }
    return Promise.reject(result)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  res => {
    tipX()
    let result
    let {status, statusText, config, data} = res

    if (status === 200) {
      result = {...data}
    }

    if (result.code === 1) {
      return result.data
    } else {
      result = {
        msg: result.msg || config.name || '网络不给力',
        code: result.code
      }
    }
    return Promise.reject(result)
  },
  err => {
    tipX()
    let result = {
      msg: err.msg || err.statusText || '网络不给力',
      code: err.code || err.status
    }
    return Promise.reject(result)
  }
)

export function post (config = {}) {
  return instance({
    method: 'post',
    ...config
  })
}

export function get (config = {}) {
  return instance({
    method: 'get',
    ...config
  })
}
export var apis = {}

export default {
  get, 
  post, 
  apis
}

Object.keys(API).forEach(function (a) {
  apis[a] = function (_data) {
    var m = API[a].method.toLowerCase()
    var p = API[a].params || {}
    var config = copy(API[a])
    var data = copy(p)
    var params = copy(p)
    config.headers = HEAD 
    if (m === 'post') {
      config.data = merge(data, _data)
      delete config.params
      config.method = 'post'
      return post(config)
    } else if (m === 'get') {
      config.params = merge(params, _data)
      delete config.data 
      config.method = 'post'
      return get(config)
    } else {
      config.params = merge(params, _data)
      delete config.data
      config.method = 'get'
      return get(config)
    }
  }
})

apis.headers = HEAD 
