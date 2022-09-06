import { merge, addPrefixUrl } from '~/utils'
import http from '~/utils/http'
import CustomApi from './custom'
import common from './common'
let config = {
  ...CustomApi,
  ...common
}
let apis = {}

makeAPIs(apis, config)
/*
 * apis = {
 *   demo1: function (params) {}
 *   demo2: {
 *     demo2: function (params) {}
 *   }
 * }
 */
export default apis

function makeAPIs(apis, config) {
  Object.keys(config).forEach(namespace => {
    if (config[namespace].url) {
      apis[namespace] = function(params, ...rest) {
        var opts = makeOpts(namespace, config, params, ...rest)
        return http.request(opts)
      }
    } else {
      if (!apis[namespace] || typeof apis[namespace] !== 'object') {
        apis[namespace] = {}
      }
      makeAPIs(apis[namespace], config[namespace])
    }
    return false
  })
}

function makeOpts(namespace, config, params, ...rest) {
  var method = (config[namespace]['method'] || 'get').toLowerCase()
  var opts = merge({}, config[namespace])
  // for some additional api config such as headers
  rest.forEach(p => {
    merge(opts, p)
  })
  // set params for get, data for post
  merge(opts, {
    [method === 'get' ? 'params' : 'data']: params
  })
  // for url: /a/:c/d -> a/1/d
  // for a/1/d -> __proxy__/a/1/d or http://ross-bpm.baozun.com/a/1/d
  opts.url = reWriteUrl(opts.url, opts)
  // for remove original opts.proxy or opts.baseUrl
  if (opts.hasOwnProperty('proxy')) delete opts.proxy
  if (opts.hasOwnProperty('baseUrl')) delete opts.baseUrl
  // remove empty params
  if (
    (opts.params &&
      typeof opts.params === 'object' &&
      Object.keys(opts.params).length < 1) ||
    (opts.hasOwnProperty('params') && /null|undefined/i.test(opts.params + ''))
  ) {
    delete opts.params
  }
  // remove empty data
  if (
    (opts.data &&
      typeof opts.data === 'object' &&
      Object.keys(opts.data).length < 1) ||
    (opts.hasOwnProperty('data') && /null|undefined/i.test(opts.data + ''))
  ) {
    delete opts.data
  }
  return opts
}

function reWriteUrl(url, opts) {
  opts = (typeof opts === 'object' && opts) || {}
  url = url.replace(/:(\w+)/g, function(s, a) {
    var optsData = (typeof opts.data === 'object' && opts.data) || {}
    var optsPara = (typeof opts.params === 'object' && opts.params) || {}
    var v
    // for url=/a/:c/d  opts.data={c: v}
    // delete opts.data.c
    if (opts.method === 'post' && optsData.hasOwnProperty(a)) {
      v = optsData[a]
      delete optsData[a]
      return v
    }
    // for url=/a/:c/d  opts.params={c: v}
    // delete opts.params.c
    if (opts.method === 'get' && optsPara.hasOwnProperty(a)) {
      v = optsPara[a]
      delete optsPara[a]
      return v
    }
    return a
  })
  return addPrefixUrl(url, opts)
}
