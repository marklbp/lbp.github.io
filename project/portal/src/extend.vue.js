import http from '~/utils/http'
import api from '~/apis'
import cache from '~/utils/cache'
import constant from '~/config'
import helper from '~/utils'
Vue.prototype.$api = api
Vue.prototype.$http = http
Vue.prototype.$cache = cache
Vue.prototype.$constant = constant

Vue.filter('formatTime', function(time, format) {
  let params = [undefined]
  time = time + ''
  if (/^\d+$/.test(time)) {
    params = [+time]
  }
  if (time.includes('-')) {
    params = time.match(/\d+/g)
    params.length > 1 && (params[1] -= 1)
  }
  const date = new Date(...params)
  if (!time || (date + '').toLowerCase() === 'invalid date') return '-'
  const year = date.getFullYear() + ''
  const monthString = (date.getMonth() + 1).toString().padStart(2, '0')
  const dayString = date
    .getDate()
    .toString()
    .padStart(2, '0')
  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0')
  const mins = date
    .getMinutes()
    .toString()
    .padStart(2, '0')
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, '0')
  let result = format || 'y-M-d'
  result = result
    .replace(/y+/g, year)
    .replace(/M+/g, monthString)
    .replace(/d+/g, dayString)
    .replace(/h+/g, hours)
    .replace(/m+/g, mins)
    .replace(/s+/g, seconds)
  return result
})
Vue.prototype.$helper = helper
function reWrite(name, fn, old) {
  old = old || Vue.prototype[name]
  Vue.prototype[name] = function() {
    let args = [...arguments]
    return old.apply(this, fn(args))
  }
}
export default function() {
  reWrite('$confirm', function(args) {
    let last = args.slice(-1)[0]
    if (typeof last == 'object' && last) {
      if (last.type == 'danger') {
        Object.assign(last, {
          confirmButtonClass: 'el-button--danger'
        })
      }
      Object.assign(last, {
        cancelButtonClass: 'el-button--text btn-gray'
      })
    }
    return args
  })
}
