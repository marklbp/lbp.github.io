import Vue from 'vue'
import router from './router'
import App from './app.vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
