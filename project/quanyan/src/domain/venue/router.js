import Vue from 'vue'
import Router from 'vue-router'
import { setNavbarTransparent, delNavButtons } from '@/services/native.js'
// import home from './views/home'

Vue.use(Router)

const asyncLoad = (name) => import(`./views/${name}`)
// const asyncLoad = (name) => import(`./views/${name}`)

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: () => asyncLoad('Home.vue'),
    meta: {
      title: 'home'
    }
  }, {
    path: '/home/:cityCode/:categoryId/',
    // name: 'home',
    component: () => asyncLoad('Home.vue'),
    meta: {
      title: 'home'
    }
  }, {
    path: '/detail/:id',
    name: 'detail',
    component: () => asyncLoad('Detail.vue'),
    meta: {
      title: 'detail'
    }
  }, {
    path: '/introduce',
    name: 'introduce',
    component: () => asyncLoad('Introduce.vue'),
    meta: {
      title: 'introduce'
    }
  }, {
    path: '/claim',
    name: 'claim',
    component: () => asyncLoad('Claim.vue'),
    meta: {
      title: 'claim'
    }
  }, {
    path: '/create',
    name: 'create',
    component: () => asyncLoad('Create.vue'),
    meta: {
      title: 'create'
    }
  }, {
    path: '/success',
    name: 'success',
    component: () => asyncLoad('Success.vue'),
    meta: {
      title: 'success'
    }
  }, {
    path: '/linkRout/:cityCode/:categoryId/:ispublic',
    name: 'linkRout',
    component: () => asyncLoad('LinkRout.vue'),
    meta: {
      title: 'linkRout'
    }
  }, {
    path: '/course/:id',
    name: 'course',
    component: () => asyncLoad('course.vue'),
    meta: {
      title: 'course'
    }
  }, {
    path: '/stores/:id',
    name: 'stores',
    component: () => asyncLoad('store_list.vue'),
    meta: {
      title: 'stores'
    }
  }, {
    path: '/shops/:id',
    name: 'shops',
    component: () => asyncLoad('shop_list.vue'),
    meta: {
      title: 'shops'
    }
  }]
})
router.beforeEach((to, from, next) => {
  delNavButtons()
  setNavbarTransparent()
  next()
})

export default router
