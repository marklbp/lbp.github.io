import Vue from 'vue'
import axios from 'axios'
import { API_SERVER } from '../config/config'
import { Message } from 'element-ui';
import qs from 'qs';
import Cookie from 'js-cookie';

let waitGetListByparentIdPromise;
let waitGetListByparentIdPromised = [];
// const ERROR_MESSAGE = res.responseJSON && res.responseJSON.message ? res.responseJSON.message : (res.responseJSON && res.responseJSON.msg ? res.responseJSON.msg : res.status + ', 请求失败');

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

axios.interceptors.request.use(request => {
  let token = Cookie.get('PCTOKEN', { path: '/', domain: getDomain() });
  if (token) {
    request.headers['Authorization'] = 'PCHTOKEN '+token;
    // request.headers['Authorization'] = token;
  }
  return request
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  setToken(res);
  res = checkStatus(res);
  if (res.error) return Promise.reject(res);
  res.msg = '处理成功';
  return res
}, error => {
  error = checkStatus(error);
  return error
})

const checkStatus = (res) => {
  let status = res.status;
  let msg, data, code = status;
  let apiName = res.config && res.config.apiName || false;
  if (apiName) msg = apiName + "异常，请稍后再试！"

  if (res.response && res.response.status == 401 && res.response.data && res.response.data.code == 401) {
    // 约定401为登录超时，跳转到登陆页
    setTimeout(() => redirectToLogin(), 0);
    //return;
  }
  if (status < 200) {
    //response initialize
    if (status == 0 && 4 == res.readyState) {
      msg = "未登录或未授权，请登录"
      redirectToLogin();
    } else {
      msg = msg || '网络不给力，请稍后再试'
    }
  } else if (status < 300) {
    //response code 200 ~ 300
    if (res.data) {
      if (200 != res.data.code) {
        if (103 == res.data.code) {
          msg = "会话超时，请重新登录"
          /*Message.error({
              message: msg,
              duration: 1500,
              onClose(){
                  redirectToLogin();
              }
          });*/
          setTimeout(() => redirectToLogin(), 0);
          //return;
        } else {
          msg = res.data.msg || msg || "处理异常，请稍后再试"
        }
      } else {
        msg = res.data.msg || msg || '';
        res.success = res.data.data;
      }
    } else {
      msg = msg || res.statusText || "数据获取失败，请稍后再试"
    }
  } else if (status < 400) {
    //response redirect
    msg = msg || "资源已转移或下线，请浏览其他项"
  } else if (status < 500) {
    //response client error
    msg = msg || "数据获取失败，请稍后再试"
  } else {
    //response server error
    msg = msg || "服务器返回错误，请稍后再试"
  }

  if (200 != res.status || 200 != (res.data && res.data.code)) {
    if (process.browser) Message.error({ message: msg, duration: 1500 });
    res.error = true;
  }

  if (res && res.data && res.data.code) code = res.data.code;

  let _res = res;
  if (_res) {
    res = { msg, code, status: code }
    if ('object' != typeof _res.data) {
      res.data = { msg, code, _value: _res.data }
    } else {
      res.data = _res.data;
      res.data.msg = _res.data.msg;
      res.data.code = code;
    }
  } else {
    res = {
      msg,
      code,
      status: code,
      data: {
        msg,
        code
      }
    }
  }
  res.success = _res.success;
  res.response = _res;
  res.error = _res.error;

  /*
    {
      success: Data  //真实数据
      error: Boolean //错误判断
      msg: String    //消息提示
      code: Number   //返回码
    }
  */

  return res
}

const setToken = (res) => {
  if (res.headers.token) {
    Cookie.set('PCTOKEN', res.headers.token, { path: '/', domain: getDomain() });
  }
}

/**
 * 未登陆跳转到登陆页
 * 1. 匹配包含域名pingchang666才跳转，否则不处理
 * 2. 替换当前系统关键字成login，例如贷前daikuan->login
 * @return {[type]} [description]
 */
function redirectToLogin() {
  let _host = location.host;
  if (_host.indexOf('pingchang666') == -1) {
    return;
  }

  _host = _host.replace('erp', 'login');
  if (process.browser) location.href = '//' + _host + '/#/account/' + encodeURIComponent(location.href);
  // if (process.browser) window.location.href = "/auth/sign-in"
}

function getDomain() {
  if (location.hostname.indexOf('pingchang666') != -1) {
    return '.pingchang666.com';
  } else {
    return location.hostname;
  }
}

function ajax(url, config = {}, name) {
  return axios({
    ...config,
    baseURL: API_SERVER,
    url,
    timeout: 5000,
    apiName: name
  }).then((res) => {
    if (res.error) return Promise.reject(res);
    if (waitGetListByparentIdPromise) {
      waitGetListByparentIdPromised.push(res)
      waitGetListByparentIdPromise()
      waitGetListByparentIdPromise = null
    }
    return res;
  }).catch((err) => {
    return Promise.reject(err);
  })
}

let methods = {};
['post', 'delete', 'put'].map(function(method) {
  methods[method] = (url, data, name) => ajax(url, {
    data,
    method,
    headers: {
      'Accept': "application/json",
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }, name)
})

export default {
  ...methods,
  ajax,
  get(url, params, name) {
    let headers = {};
    let search, query, uid, pid;
    if (process.browser) {
      //let isSAAS2CRM = location.search.indexOf('type=saas') !== -1;
      let isCooperation = /\/cooperation\/(?!\blist\b)/.test(location.href);
      let isSAAS = location.href.indexOf('/saas') !== -1;
      let getListByparentId = url.indexOf('/getListByparentId') !== -1;
      let resourceTree = url.indexOf('/resourceTree') !== -1;
      let getUserInfo = url.indexOf("user/getUserInfo") !== -1;
      let admin = localStorage.getItem("ADMIN");
      let hasAdmin = false;
      try {
        admin = JSON.parse(admin);
        hasAdmin = admin.id
      } catch (e) {
        admin = {};
      }
      if ( /*isSAAS2CRM && */ (isCooperation || isSAAS)) {
        if (getListByparentId || resourceTree) {
          search = location.search.substring(1);
          query = search.split("&");
          pid = query.find(s => s.toLowerCase().indexOf('parentid=') >= 0);
          uid = query.find(s => s.toLowerCase().indexOf('userid=') >= 0);
          if (!pid) {
            // location.href里没有parentId时需要从缓存里取
            localStorage.getItem("parentid") && (params.parentId = localStorage.getItem("parentid").substring(9));
          } else {
            // location.href里有parentId时需要存缓存
            localStorage.setItem("parentid", pid);
          }
          if (!uid) {
            // location.href里没有userId时需要从缓存里取
            uid = localStorage.getItem("userid") && localStorage.getItem("userid").split("=");
            if (!uid) uid = ['userId']
          } else {
            localStorage.setItem("userid", uid)
            uid = uid.split("=");
          }
          if (uid.length > 1) {
            headers[uid[0]] = uid[1];
          } else if (hasAdmin) {
            headers.userId = admin.id
          } else {
            headers.userId = ''
          }
          url = '/ext' + url
        } else {
          if (!waitGetListByparentIdPromise && waitGetListByparentIdPromised.length <= 0 && !isSAAS && getUserInfo) {
            //console.log(headers)
            waitGetListByparentIdPromise = () => ajax(url, {
              params,
              method: 'get',
              headers: {
                ...headers,
                'X-Requested-With': 'XMLHttpRequest',
              }
            }, name)
            return Promise.resolve(waitGetListByparentIdPromise)
          }
        }
      }
    }
    return ajax(url, {
      params,
      method: 'get',
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
      }
    }, name)
  },
  http: axios
}
