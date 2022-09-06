import 'element-ui/lib/theme-chalk/index.css'
import 'v-contextmenu/dist/index.css'
import '~/assets/css/global.scss'
import reWriteVuePrototypeFn from 'extend.vue'
import ElementUI from 'element-ui'
import contentmenu from 'v-contextmenu'
import storeOptions from '~/store'
import routerOptions from '~/routes'
import App from '@/index'
Vue.use(contentmenu)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
reWriteVuePrototypeFn()
var store = new Vuex.Store(storeOptions)
var router = new VueRouter(routerOptions)
/**
 * 企业微信消息点击过来的入口函数
 */
function redirectFromWX() {
  const info = Vue.prototype.$helper.getQueryString('info')
  const isWxClient = window.navigator.userAgent.indexOf('MicroMessenger') > -1
  // 微信消息处理
  if (info && isWxClient) {
    Vue.prototype.$cache.session.set('WX_INFO', info)
    const url = window.location.href
    window.location.href = Vue.prototype.$helper.deleteParamByUrl(url, 'info')
  } else if (
    location.pathname.indexOf('flow-task-detail') == -1 &&
    location.pathname.indexOf('task-detail-message') == -1
  ) {
    Vue.prototype.$cache.session.remove('WX_INFO')
  }
}
redirectFromWX()

router.onError(function(err) {
  console.log(err)
  if (err && (err.message + '').toLowerCase().indexOf('loading chunk') > -1) {
    Vue.prototype
      .$confirm(
        '检测到版本已更新，继续可能丢失已有编辑数据，是否前往新版尝鲜？',
        '提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }
      )
      .then(r => {
        window.location.reload()
      })
      .catch(e => e)
  }
})
router.beforeEach((to, from, next) => {
  // 统计常用店铺
  if (to.params.storeId && to.params.storeId !== '0') {
    try {
      Vue.prototype.$helper.updateStoreWeights(to.params.storeId)
    } catch (error) {
      console.log(error)
    }
  }

  // 初次访问店铺/切换店铺时跳转店铺授权页
  if (
    to.params.storeId !== undefined &&
    to.params.storeId !== from.params.storeId &&
    to.path !== '/store' &&
    from.path !== '/store' &&
    location.pathname.indexOf('flow-task-detail') == -1 &&
    location.pathname.indexOf('task-detail-message') == -1 &&
    parseInt(to.params.storeId, 10) !== 0
  ) {
    return next(
      `/store?redirectUrl=${encodeURIComponent(to.fullPath)}&authStoreId=${
        to.params.storeId
      }`
    )
  }

  next()
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
