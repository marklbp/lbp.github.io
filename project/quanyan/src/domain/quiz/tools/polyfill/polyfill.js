//  requestAnimationFrame
export function requestAnimationFramePolyfill () {
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60)
  }
}

//  cancelAnimationFrame
export function cancelAnimationFramePolyfill () {
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout
}

//  基本的日期格式化
export function dateFormate () {
  window.Date.prototype._Format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S': this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
}

export default {
  //  requestAnimationFrame
  requestAnimationFramePolyfill,
  //  cancelAnimationFrame
  cancelAnimationFramePolyfill,
  //  日期格式化
  dateFormate
}
