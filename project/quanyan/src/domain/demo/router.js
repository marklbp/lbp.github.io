import Vue from 'vue'
import Router from 'vue-router'
import helper from '@/helpers/router'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: () => import('./views/index.vue'),
    meta: {
      title: 'index'
    }
  }, {
    path: '/countdown',
    name: 'count-down',
    component: () => import('./views/countdown.vue'),
    meta: {
      title: 'count down',
      auth: true
    }
  }, {
    path: '/api',
    name: 'api',
    component: () => import('./views/api.vue'),
    meta: {
      title: 'api'
    }
  }, {
    path: '/clear',
    name: 'clear',
    component: () => import('./views/clear.vue'),
    meta: {
      title: 'clear cookie'
    }
  }, {
    path: '/infinite',
    name: 'infinite',
    component: () => import('./views/infinite.vue'),
    meta: {
      title: 'infinite scroll demo'
    }
  }]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  helper.before(to, from, next).trace()
  next()
})

export default router
