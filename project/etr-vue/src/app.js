import 'mand-mobile/lib/mand-mobile.css'
import './assets/css/mand-mobile.scss'
import './assets/css/normalize'
import Vue from 'vue'
import Router from 'vue-router'
import router from './router'
import App from './app.vue'
import {apis} from './plugins/http'
import {queryString, setTitle} from './plugins/utils'
import {setC} from './plugins/cache'
Vue.use(Router)

let vm = new Vue({
  el: '#app',
  router: new Router(router),
  render: h => h(App)
})

vm.$router.beforeEach((now, prev, next) => {
  setTitle(now.meta.title || "ETR")
  let query = queryString(window.location.search.substring(1))
  if (now.meta.auth) {
    if (localStorage.getItem('login') == 1 || query.login || query.user_token) {
      // 已经登录
      if (query.user_token) {
        apis.headers['user-token'] = query.user_token
        setC('user-token', query.user_token)
        // 获取用户信息
        /*apis.getUserInfo().then(res => {
          localStorage.setItem('ETR_USER_INFO', JSON.stringify(res))
          next('/me')
        }).catch(err=> {

          next(false)
        })*/
        //return window.location.href = window.location.href.replace(/\?[^\/]+\//)
      }

      next()

    } else {
      // 未登录
      next('/login')
    }
  } else {
    next()
  }
})