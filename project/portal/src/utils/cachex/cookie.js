// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
var Global = (typeof window !== 'undefined' ? window : global)
var trim = (function () {
  if (String.prototype.trim) {
    return function trim (str) {
      return String.prototype.trim.call(str)
    }
  } else {
    return function trim (str) {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    }
  }
})()

export default {
  name: 'cookieStorage',
  read,
  write,
  each,
  remove,
  clear
}

var doc = Global.document

function read (key) {
  if (!key || !_has(key)) {
    return null
  }
  var regexpStr = '(?:^|.*;\\s*)' +
    escape(key).replace(/[\-\.\+\*]/g, '\\$&') +
    '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'
  return unescape(doc.cookie.replace(new RegExp(regexpStr), '$1'))
}

function each (callback) {
  var cookies = doc.cookie.split(/; ?/g)
  for (var i = cookies.length - 1; i >= 0; i--) {
    if (!trim(cookies[i])) {
      continue
    }
    var kvp = cookies[i].split('=')
    var key = unescape(kvp[0])
    var val = unescape(kvp[1])
    callback(val, key)
  }
}

function write (key, data, expires, path) {
  if (!key) { return }
  var cookie = escape(key) + '=' + escape(data)
  path = path || '/'
  if (expires !== undefined) {
    expires = new Date(+new Date() + expires).toGMTString()
    cookie += '; expires=' + expires
  }
  doc.cookie = cookie + '; path=' + path
}

function remove (key, path) {
  if (!key || !_has(key)) {
    return
  }
  path = path || '/'
  doc.cookie = escape(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path
}

function clear () {
  each(function (_, key) {
    remove(key)
  })
}

function _has (key) {
  return (new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(doc.cookie)
}
