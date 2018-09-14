import Vue from 'vue'
import VueLoginDialog from '@/components/login/user-login-dialog'

let instance
const initInstance = () => {
  instance = new (Vue.extend(VueLoginDialog))({
    el: document.createElement('div')
  })
  instance.$on('input', value => {
    instance.value = value
  })
  document.body.appendChild(instance.$el)
}

function LoginDialog (options = {}) {
  return new Promise((resolve, reject) => {
    if (!instance) {
      initInstance()
    }

    Object.assign(instance, {
      resolve,
      reject,
      ...options
    })
  })
}

LoginDialog.defaultOptions = {
  value: true,
  loginSuccess: undefined,
  loginFailt: undefined,
  cancleCallBack: undefined
}

LoginDialog.open = options => LoginDialog({
  ...LoginDialog.currentOptions,
  ...options
})

LoginDialog.setDefaultOptions = options => {
  Object.assign(LoginDialog.currentOptions, options)
}

LoginDialog.resetDefaultOptions = () => {
  LoginDialog.currentOptions = { ...LoginDialog.defaultOptions }
}

LoginDialog.close = () => {
  instance.value = false
}

Vue.prototype.$loginDialog = LoginDialog
LoginDialog.resetDefaultOptions()

export default LoginDialog
