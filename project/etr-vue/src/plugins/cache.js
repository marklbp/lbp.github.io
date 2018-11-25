var cache
const getcache = function (k, v, b) {
  if (typeof cache !== 'object' || typeof cache['_ETR_CACHE_'] !== 'object') {
    try {
      cache = localStorage.getItem('_ETR_CACHE_')
      localStorage.setItem('_ETR_CACHE_', '{"_ETR_CACHE_": {}}')
      cache = JSON.parse(cache)
      cache['_ETR_CACHE_'] = typeof cache['_ETR_CACHE_'] !== 'object' ? {} : cache['_ETR_CACHE_']
    } catch(e) {
      cache = {
        _ETR_CACHE_: {}
      }
    }
  }
  if (b) {
    let r = delete cache["_ETR_CACHE_"][k]
    try {localStorage.setItem('_ETR_CACHE_', JSON.stringify(cache))}catch(e){}
    return r
  } else {
    if (arguments.length < 2) {
      return cache["_ETR_CACHE_"][k]
    } else {
      cache["_ETR_CACHE_"][k] = v || cache["_ETR_CACHE_"][k]
      try {localStorage.setItem('_ETR_CACHE_', JSON.stringify(cache))}catch(e){}
      return v
    }
  }
}

export default {setC, getC}

export function setC (k, v) {
  getcache(k, v || get(k))
} 

export function getC (k) {
  return getcache(k)
}

export function clearC (k) {
  return getcache(k, null, true)
}