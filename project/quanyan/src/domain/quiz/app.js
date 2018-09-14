import Vue from 'vue'
import viewportUnitsBuggyfill from 'viewport-units-buggyfill'
import viewportUnitsBuggyfillHacks from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks.js'
import { makeImg } from '@/filters/filters.js'
import fastclick from 'fastclick'
import router from './router'
import store from './store/index.js'
import App from './app.vue'
import vconsole from '@/plugins/vconsole'
import login from '@/components/login'
import trace from '@/plugins/trace'
//  导入样式文件
import './styles/icons.scss'
import './styles/common.scss'
import 'nprogress/nprogress.css'
import '@/styles/base.scss'
//  解决实例化的对象方法polyfill(例: [1,2,3].includes)
import 'babel-polyfill'

// polyfill
import customPolyfill from 'quiz/tools/polyfill/polyfill.js'
for (let item in customPolyfill) {
  if (customPolyfill.hasOwnProperty(item)) {
    let fun = customPolyfill[item]
    if (Object.prototype.toString.call(fun) === '[object Function]') fun()
  }
}

//  定义页面初始化时候的数据
window.refresh_model = (router && router.currentRoute) || false
//  组件库Dialog实例对象，需要在切换路由的时候，销毁实例
window.mdDialogInstances = []

/* add vconsole plugin */
const location = window.location.href
if (!location.includes('h5.yingheying.com')) {
  Vue.use(vconsole)
}
Vue.use(login, {router})

//  定义全局过滤器
Vue.filter('makeImg', makeImg)

// 初始化埋点方法
Vue.use(trace, {project: '竞猜管理', router})

//  处理vw单位兼容性
window.onload = () => {
  viewportUnitsBuggyfill.init({
    hacks: viewportUnitsBuggyfillHacks
  })
  // 处理点击延迟
  document && document.body && fastclick.attach(document.body)
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
