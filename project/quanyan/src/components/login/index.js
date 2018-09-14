/*
 * usage:
 *
 * import login from '@/components/login'
 * Vue.use(login, {router})
 * Vue.use(login, {
 *   router: router,
 *   wx: false,
 *   silence: false
 * })
 *
*/
import wxBefore from './wx-router'
import loginDialog from './login-dialog'
import {isLogin, isApp} from '@/utils/common'
import {openNative} from '@/services/native'

var defaultOptions = {
  silence: true
}

export function forceLogin (option) {
  if (isApp()) {
    openNative('LOGIN')
  } else {
    return loginDialog.open({...defaultOptions, ...option})
  }
}

export function login (option) {
  if (!isLogin()) {
    return forceLogin({...defaultOptions, ...option})
  }
}

const after = (to, from, next) => {
  if (to.meta && to.meta.auth) {
    var promise = login()
    if (promise) promise.then(() => next())
    else next()
  } else {
    next()
  }
  // to.meta && to.meta.auth && login()
}

export default {
  install (_, {router, wx = true, silence}) {
    if (typeof silence !== 'undefined') defaultOptions.silence = silence
    if (defaultOptions.silence && wx) router.beforeEach(wxBefore)
    router.beforeEach(after)
  }
}
