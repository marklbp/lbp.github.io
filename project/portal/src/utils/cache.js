import {CACHE_PREFIX} from '~/config'
import local from './cachex/local.storage'
import cookie from './cachex/cookie'
import session from './cachex/session.storage'
let publicAPI = {
  set (key, value, ...rest) {
    if (value === undefined) {
      return this.remove(key, ...rest)
    }
    key = (this._namespacePrefix || '') + key
    value = JSON.stringify(value)
    this.storage.write(key, value, ...rest)
    return value
  },
  get (key, optionalDefaultValue) {
    key = (this._namespacePrefix || '') + key
    var data = this.storage.read(key)
    if (!data) { return optionalDefaultValue }
    var val = ''
    try {
      val = JSON.parse(data)
    } catch (e) {
      val = data
    }
    return (val !== undefined ? val : optionalDefaultValue)
  },
  remove (key, ...rest) {
    key = (this._namespacePrefix || '') + key
    this.storage.remove(key, ...rest)
  },
  clear () {
    this.storage.clear()
  },
  each (callback) {
    this.storage.each(callback)
  }
}

export class Cache {
  constructor (storage, namespace) {
    this.storage = storage || local

    if (!namespace) {
      namespace = ''
    }

    var namespacePrefix = (namespace ? CACHE_PREFIX : '')
    var legalNamespaces = /^[a-zA-Z0-9_-]*$/

    if (!legalNamespaces.test(namespace)) {
      throw new Error('__suhaodian_cache__ namespaces can only have alphanumerics + underscores and dashes')
    }

    this._namespacePrefix = namespacePrefix

    Object.assign(this, publicAPI)
  }
}

Object.assign(Cache.prototype, {
  cookie: Object.assign({
    storage: Object.create(cookie)
  }, publicAPI),
  session: Object.assign({
    storage: Object.create(session)
  }, publicAPI)
})

export default new Cache(null, 1)
