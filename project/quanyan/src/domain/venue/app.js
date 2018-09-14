import Vue from 'vue'
import router from './router'
import App from './app.vue'
// import VConsole from '@/plugins/vconsole'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

if (window.location.href.indexOf('h5.yingheying.com') === -1) {
  // Vue.use(VConsole)
}
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
