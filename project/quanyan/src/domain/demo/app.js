import Vue from 'vue'
// import viewportUnitsBuggyfill from 'viewport-units-buggyfill'
// import viewportUnitsBuggyfillHacks from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks.js'
// import fastclick from 'fastclick'
import router from './router'
import App from './app.vue'
import trace from '@/plugins/trace'
import vconsole from '@/plugins/vconsole'
import login from '@/components/login'
import '@/styles/base.scss'

process.env.NODE_ENV === 'production' || console.log('Looks like we are in development mode!')

/* add trace plugin, specify project name */
Vue.use(trace, {project: 'yhy-owl-demo'})

/* add vconsole plugin */
Vue.use(vconsole)

Vue.use(login, {router})

//  处理vw单位兼容性
// window.onload = () => {
//   viewportUnitsBuggyfill.init({
//     hacks: viewportUnitsBuggyfillHacks
//   })
//   // 处理点击延迟
//   document && document.body && fastclick.attach(document.body)
// }
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
