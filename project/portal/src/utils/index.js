import downloadFile from './download'
/**
 * object类型数据属性合并函数
 * @param  {Any} t     目标结果
 * @param  {Any} s     源结果
 * @param  {Boolean} b 是否绝对复制源对象值标识
 * @return {Any}       返回值（目标结果）
 */
export function merge(t, s, b) {
  if (t === s) return t
  if (s instanceof Array) {
    t = (t instanceof Array && t) || []
    for (var i = 0; i < s.length; i++) {
      // prevent loop
      if (s[i] === s) {
        t[i] = t
        return t
      }
      t[i] = merge(t[i], s[i], b)
    }
  } else if (typeof s === 'object') {
    if (s !== null) {
      t = (typeof t == 'object' && t) || {}
      for (var att in s) {
        if (s.hasOwnProperty(att)) {
          // prevent loop
          if (s[att] === s) {
            t[att] = t
            return t
          }
          t[att] = merge(t[att], s[att], b)
        }
      }
    } else {
      t = b ? s : s + '' !== 'undefined' ? s : t
    }
  } else {
    t = b ? s : s + '' !== 'undefined' ? s : t
  }
  return t
}
export function mergeSelf() {
  let args = [].slice.call(arguments)
  let result
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) continue
    result = merge(result, args[i])
  }
  return result
}
export function copy(t) {
  return merge(undefined, t, true)
}

/**
 * 生成UUID
 * @param len 生成随机字符串的长度，默认16位
 */
export const genRandomStr = (len = 16) => {
  if (len > 16) {
    len = 16
  }
  let d = new Date().getTime()
  return 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .slice(0, len)
    .replace(/[xy]/g, function(c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
/**
 * 防抖
 * @param {Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 */
export const debounce = (func, delay, immediate) => {
  let timer
  return function(...args) {
    let context = this
    if (timer) clearTimeout(timer)
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(function() {
        timer = null
      }, delay)
      if (callNow) func.apply(context, args)
    } else {
      timer = setTimeout(function() {
        func.apply(context, args)
      }, delay)
    }
  }
}
/**
 * 日期格式化函数(yyyy-mm-dd hh:ff:ss)
 * @param  {String|Number} v 毫秒戳或者'2019-01-01 00:00:00'
 * @param  {String}       ft 格式
 * @return {String}          格式化后的日期(yyyy-mm-dd hh:ff:ss)
 */
export function formatTime(v, ft) {
  v = v > 0 ? Number(v) : v
  if (v === null || v === '') return ''
  if (/^\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}\:\d{2}$/.test(v)) {
    v = v.replace(/-/g, '/')
  }
  let d = new Date(v)
  if ((d + '').toLowerCase() == 'invalid date') {
    return ''
  }
  let y = d.getFullYear()
  let m = d.getMonth() + 1
  let r = d.getDate()
  let h = d.getHours()
  let f = d.getMinutes()
  let s = d.getSeconds()
  let m1 = m > 9 ? m : '0' + m
  let r1 = r > 9 ? r : '0' + r
  let h1 = h > 9 ? h : '0' + h
  let f1 = f > 9 ? f : '0' + f
  let s1 = s > 9 ? s : '0' + s
  switch (ft) {
    case 'yyyy-mm-dd':
      return y + '-' + m1 + '-' + r1
    case 'yyyy/mm/dd':
      return y + '/' + m1 + '/' + r1
    case 'yyyy-m-d':
      return y + '-' + m + '-' + r
    case 'yyyy/m/d':
      return y + '/' + m + '/' + r
    case 'hh:ff:ss':
      return h1 + ':' + f1 + ':' + s1
    case 'h:f:s':
      return h + ':' + f + ':' + s
    case 'hh:ff':
      return h1 + ':' + f1
    case 'h:f':
      return h + ':' + f
    case 'yyyy-mm-dd hh:ff:ss':
      return y + '-' + m1 + '-' + r1 + ' ' + h1 + ':' + f1 + ':' + s1
    case 'yyyy-mm-dd hh:ff':
      return y + '-' + m1 + '-' + r1 + ' ' + h1 + ':' + f1
    case 'yyyy/mm/dd hh:ff:ss':
      return y + '/' + m1 + '/' + r1 + ' ' + h1 + ':' + f1 + ':' + s1
    case 'yyyy/mm/dd hh:ff':
      return y + '/' + m1 + '/' + r1 + ' ' + h1 + ':' + f1
    case 'yyyy-m-d h:f:s':
      return y + '-' + m + '-' + r + ' ' + h + ':' + f + ':' + s
    case 'yyyy-m-d h:f':
      return y + '-' + m + '-' + r + ' ' + h + ':' + f
    case 'yyyy/m/d h:f:s':
      return y + '/' + m + '/' + r + ' ' + h + ':' + f + ':' + s
    case 'yyyy/m/d h:f':
      return y + '/' + m + '/' + r + ' ' + h + ':' + f
    default:
      return y + '-' + m1 + '-' + r1 + ' ' + h1 + ':' + f1 + ':' + s1
  }
}

/**
 * 解析服务端存取的执行人、抄送人数据类型('1,2,3'|[{id: 1}, {id: 2}, {id: 3}])
 * @param  {String|Array} v  服务端返回的执行抄送人员信息
 * @param  {Array} persons   全部的人员信息列表
 * @return {Array}           解析后的执行或抄送人员信息
 */
export function parsePerson(v, persons) {
  if (v instanceof Array) {
    return v.map(v => ({
      id: (v && v.id) || '',
      pic: (v && (v.pic || v.photo)) || '',
      color: (v && v.color) || 'blue',
      name: (v && (v.name || v.realName || v.userName)) || ''
    }))
  }
  return persons.filter(p => (v + '').indexOf(p.id) > -1)
}
/**
 * 随机颜色生成函数
 * @return {String} rgba([0-255], [0-255], [0-255], opacity)
 */
export function color(opacity) {
  var colors = [255, 255, 255, 1]
  return (
    'rgba(' +
    colors
      .map(c => {
        if (c == 1) {
          if (opacity > 0) return opacity
          c = ((c + 1) * Math.random()).toFixed(2)
          c = c > 1 ? 1 : c
          c = c < 0.5 ? 0.5 : c
        } else {
          c = Math.floor((c + 1) * Math.random())
        }
        return c
      })
      .join(',') +
    ')'
  )
}
/**
 * 文件流对象和Unit8Array实例互转换
 * @param  {Object} arraybuffer 文件流信息
 * @param  {String} name        文件名
 * @param  {String} mineType    描述文件类型的字符串
 * @return {Undefined}          无返回
 */
function _down(arraybuffer, name, mineType) {
  let uint8arr = new Uint8Array(arraybuffer)
  let i = uint8arr.length
  let binaryArr = new Array(i)
  while (i--) {
    binaryArr[i] = String.fromCharCode(uint8arr[i])
  }
  let content = window.btoa(binaryArr.join(''))
  //let dataurl = `data: ${mineType};base64,${window.btoa(content)}`
  let bstr = atob(content)
  let length = bstr.length
  let uint8arr2 = new Uint8Array(length)
  while (length--) {
    uint8arr2[length] = bstr.charCodeAt(length)
  }
  downloadByBinary(uint8arr2, name, mineType)
}
/**
 * 根据已知的文件流数据下载文件
 * @param  {Object} data     文件流数据（arraybuffer）
 * @param  {String} name     文件名
 * @param  {String} mineType 描述文件类型的字符串
 * @return {Undefined}       无返回
 */
export function _downloadByBinary(data, name, mineType) {
  let blob = new Blob([data], {
    type: mineType
  })
  let href = window.URL.createObjectURL(blob)
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = href
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(href)
}
export function downloadByBinary(data, name, mineType) {
  return downloadFile(data, name, mineType)
}

/**
 * 根据一个网络地址下载其指定的那个文件
 * @param  {String} url      网络地址
 * @param  {String} name     文件名
 * @param  {String} mineType 描述文件类型的字符串
 * @return {Object}          Promise实例用以下载完成后的回调操作
 */
export function _downloadByUrl(url, name = '图片.jpeg', mineType = 'image/png') {
  return Vue.prototype.$http
    .request({
      url,
      method: 'get',
      responseType: 'arraybuffer',
      withCredentials: false
    })
    .then(({ data }) => {
      _down(data, name)
      return data
    })
}
export function downloadByUrl(url, name = '图片.jpeg', mineType = 'image/png') {
  return downloadFile(url, name, mineType)
}
// 更新常用店铺店铺权重
function updateStoreWeights(storeId) {
  Vue.prototype.$api.storeIndex
    .recentVisitCalculation(null, {
      needToast: false,
      headers: {
        groupId: storeId
      }
    })
    .catch(e => e)
}

/**
 * 颜色字符串转rgba
 * @param  {String} str     #FFFFFF
 * @param  {Number} opacity 0 ~ 1
 * @return {String}         rgba(255, 255, 255, 1)
 * color2rgba('#ffffff', 0.5) -> rgba(255, 255, 255, 0.5)
 * color2rgba('rgb(255, 255, 255)', 0.5) -> rgba(255, 255, 255, 0.5)
 * color2rgba('rgba(255, 255, 255, 1)', 0.5) -> rgba(255, 255, 255, 0.5)
 */
export function color2rgba(str, opacity = 1) {
  if (str.indexOf('rgb') > -1) {
    if (str.indexOf('rgba') > -1) {
      return str.slice(0, str.lastIndexOf(',')) + ',' + opacity + ')'
    } else {
      return str.slice(0, -1) + ',' + opacity + ')'
    }
  } else {
    let sColor = str.toLowerCase()
    if (sColor.length === 4) {
      var sColorNew = '#'
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    var sColorChange = []
    for (var j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')'
  }
}
/**
 * 按环境补全接口地址： /a/b -> http://ross-bpm-sit.baozun.com/a/b
 * @param {String} url  接口相对地址
 * @param {Object} opts 请求元数据对象
 * addPrefixUrl('/a/b', {...})
 */
export function addPrefixUrl(url, opts) {
  function addProxyPrefix(url, opts) {
    let sub = url.replace(/^\/([^\/]+).*/, '$1')
    if (opts && opts.proxy) return opts.proxy
    if (sub == 'auth') return '/__login__'
    return '/__proxy__'
  }
  function addHost(url, env, opts) {
    let sub = url.replace(/^\/([^\/]+).*/, '$1')
    if (opts && opts.baseUrl) return opts.baseUrl
    switch (sub) {
      case 'auth':
        return Vue.prototype.$constant.API_LOGIN_HOST
      default:
        return Vue.prototype.$constant.API_BASE_URL
    }
  }
  function reWriteUrl(url, opts) {
    let envObj = process.env || {}
    let { NODE_ENV: build, RUN_ENV } = envObj
    let { env: run } = RUN_ENV || {}
    let host = ''
    if (build === 'production') {
      host = addHost(url, `-${run}`, opts)
    } else {
      host = addProxyPrefix(url, opts)
    }
    if (url.indexOf('http') === 0) return url
    url = host + url
    return url
  }
  return reWriteUrl(url, opts)
}

export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return window.unescape(r[2])
  }
  return null
}

export function deleteParamByUrl(url, name) {
  const urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
    var query = urlArr[1]
    var obj = {}
    var arr = query.split('&')
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[name]
    var urlte =
      urlArr[0] +
      '?' +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '')
        .replace(/\:/g, '=')
        .replace(/\,/g, '&')
    urlte = urlte.slice(-1) == '?' ? urlte.slice(0, -1) : urlte
    return urlte
  } else {
    url = url.slice(-1) == '?' ? url.slice(0, -1) : url
    return url
  }
}

export function throttle(fn, interval = 100) {
  let timer
  return function() {
    let args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn && fn.apply(this, args)
    }, interval)
  }
}

export default {
  color,
  formatTime,
  merge,
  mergeSelf,
  copy,
  genRandomStr,
  debounce,
  parsePerson,
  downloadByUrl,
  downloadByBinary,
  updateStoreWeights,
  color2rgba,
  addPrefixUrl,
  getQueryString,
  deleteParamByUrl,
  downloadFile,
  throttle
}
