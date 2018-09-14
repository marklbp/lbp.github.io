import {isObject, isFunction, isArray} from '@/utils'

const trackingInstance = _ => window.yhytracking
const trackingBuffer = _ => window.yhy_tracing_buffer

var options = {
  project: '鹰和鹰'
}

export function config (opts) {
  if (isObject(opts)) options = {...options, ...opts}
}

export function pageview (url, referer) {
  if (trackingInstance()) trackingInstance().page({ url, referer })
  else trackingBuffer().push({page: {url, referer}})
}

export default (action, label) => {
  label = stringify(label)
  if (trackingInstance()) trackingInstance().event({project: options.project, action, label})
  else trackingBuffer().push({'event': {project: options.project, action, label}})
}

export function debug () {
  var count = 0
  var trackingTick = setInterval(() => {
    if (window.yhytracking) window.yhytracking.debug()
    if (window.yhytracking || count++ >= 5) clearInterval(trackingTick)
    // console.log('tracking count: ', count)
  }, 3000)
}

function stringify (label) {
  var result = ''
  if (typeof label === 'undefined') result = ''
  else if (isFunction(label)) result = stringify(label())
  else if (isObject(label) || isArray(label)) result = JSON.stringify(label)
  else result = String(label)
  return result
}

// e.g.
// this.$trace('key')
// this.$trace('key', 'xxxyyyzzz')
// this.$trace('key', undefined)
// this.$trace('key', null)
// this.$trace('key', NaN)
// this.$trace('key', {a: 'asfs', b: 2})
// this.$trace('key', [{a: 1, b: 2}, {c: 2}])
// this.$trace('key', function () { return {a: 'xx', b: 'yy'} })
