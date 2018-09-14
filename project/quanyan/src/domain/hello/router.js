import Vue from 'vue'
import Router from 'vue-router'
// import home from './views/home'

Vue.use(Router)

const asyncLoad = (name) => import(`./views/${name}`)
// const asyncLoad = (name) => import(`./views/${name}`)

const router = new Router({
  routes: [{
    path: '/home',
    name: 'home',
    component: () => asyncLoad('Home.vue'),
    // component: home,
    // component: () => import(/* webpackChunkName: "hello/[index]/[request]/0" */ './views/Home.vue'),
    // component: () => import(/* webpackChunkName: "hello/[index]" */ './views/Home.vue'),
    meta: {
      title: 'home'
    }
  }, {
    path: '/list',
    name: 'list',
    component: () => asyncLoad('list.vue'),
    meta: {
      title: 'list'
    }
  }]
})

export default router
