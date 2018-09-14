export default {
  initBridge () {
    try {
      this.bridge = window.yhyBridge.ready()
    } catch (e) {
      this.bridge = null
    }
    return this
  },
  setTitle (title) {
    let done = sdk => {
      let done = (sdk, x) => {
        document.title = title
      }
      this.callHandler(sdk, 'setNativeTitle', {title}, done, done)
    }
    return this.callNative(done, e => (document.title = title))
  },
  getClientInfo (done, fail) {
    return this.callNative(sdk => this.callHandler(sdk, 'getClientInfo', null, done, fail), fail)
  },
  back (registerCb, done, fail, registerEvt = 'common.h5goBack', method = 'hookBack', eventName = 'common.h5goBack') {
    return this.callNative(sdk => {
      this.register(sdk, registerEvt, registerCb)
        .callHandler(sdk, method, {eventName}, done, fail)
    }, e => e)
  },
  callNative (done, fail) {
    this.bridge.then(done).catch(fail)
    return this
  },
  register (sdk, method, callback) {
    if (!sdk) return this
    sdk.register(method, (x, f) => typeof callback === 'function' && callback(sdk, x, f))
    return this
  },
  callHandler (sdk, method, params, done, fail) {
    if (!sdk) return this
    let p
    if (params) {
      p = sdk.callHandler(method, params)
    } else {
      p = sdk.callHandler(method)
    }
    p.then(x => typeof done === 'function' && done(sdk, x))
      .catch(e => typeof fail === 'function' && fail(sdk, e))
    return this
  },
  showMap (params, done, fail) {
    return this.callNative(sdk => this.callHandler(sdk, 'showmap', params, done, fail), fail)
  },
  callPhone (params, done, fail) {
    return this.callNative(sdk => this.callHandler(sdk, 'dial', params, done, fail), fail)
  }
}.initBridge()
