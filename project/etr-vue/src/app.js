import './assets/css/normalize'
import Vue from 'vue'
import Router from 'vue-router'
import router from './router'
import App from './app.vue'

Vue.use(Router)

new Vue({
  el: '#app',
  router: new Router(router),
  render: h => h(App)
})