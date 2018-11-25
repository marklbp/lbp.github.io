import { Toast } from 'mand-mobile'

export function tipOK (str) {
  return Toast.succeed(str)
}

export function tipErr (str) {
  return Toast.failed(str)
}

export function tipLoading (str) {
  return Toast.loading(str)
}

export function tipText (str) {
  return Toast.info(str)
}

export function tipX () {
  return Toast.hide()
}

export function merge (t, s, b) {
  if (t === s) return t 
  if (s instanceof Array) {
    if (!t) {
      t = []
    }
    for (var i = 0; i < s.length; i++) {
      // prevent loop 
      if (s[i] === s) {
        t[i] = t 
        return t
      } 
      t[i] = merge(t[i], s[i], b)
    }
  } else if (typeof s === 'object') {
    if (!t) {
      t = {}
    }
    for (var att in s) {
      if (s.hasOwnProperty(att)){
        // prevent loop 
        if (s[att] === s) {
          t[att] = t 
          return t
        }
        t[att] = merge(t[att], s[att], b)
      }
    }
  } else {
    t = b ? s : (s || t) 
  }
  return t
}

export function mergeOther () {
  let args = [].slice.call(arguments)
  let result
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) continue
    merge(result, args[i], true)
  }
  return result
}

export function mergeSelf () {
  let args = [].slice.call(arguments)
  let result
  for (let i = 0; i < args.length; i++) {
    if (!args[i]) continue
    merge(result, args[i])
  }
  return result
}

export function copy (s) {
  return merge(undefined, s, true)
}

export function queryString (str) {
  var arr = str.split('&'), result = {}, m
  while (arr.length > 0) {
    m = arr.shift().split("=")
    result[m[0]] = m[1] || true
  }
  return result
}

export function setTitle (title) {
  document.title = title
  if (navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
    var iframe = document.createElement('iframe')
    var src = 'http://www.marklbp.com/?t=' + new Date().getTime()
    iframe.src = src
    iframe.style.display = 'none'
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe)
        iframe = null
      }, 0)
    }
    document.body.appendChild(iframe)
  }
}

export default {
  tipOK, tipErr, tipLoading, tipText, tipX,
  merge, mergeSelf, mergeOther, copy, queryString, setTitle
}