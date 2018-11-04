import axios from 'axios'
import {tipX, tipLoading, tipErr} from './utils'

var instance = axios.create({
  baseURL: ``,
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
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  res => {
    tipX()
    return res
  },
  err => {
    tipX()
    tipErr('err')
    return Promise.reject(err)
  }
)

export function post (data = {}, config = {}) {
  return instance({
    method: 'post',
    data,
    ...config,
  })
}

export function get (data = {}, config = {}) {
  return instance({
    method: 'get',
    data,
    ...config, 
  })
}
