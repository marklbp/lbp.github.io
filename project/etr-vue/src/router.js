const asyncLoad = name => import(`./${name}`)

const router = {
  routes: [{
    path: '/',
    redirect: 'project'
  },{
    path: '/project',
    name: 'project',
    component: () => asyncLoad('project'),
    meta: {
      title: '项目'
    }
  }, {
    path: '/resource',
    name: 'resource',
    component: () => asyncLoad('resource'),
    meta: {
      title: '资源'
    }
  }, {
    path: '/resource/:id',
    component: () => asyncLoad('resource_detail'),
    meta: {
      title: '资源详情'
    }
  }, {
    path: '/cooperate/:id',
    component: () => asyncLoad('cooperate'),
    meta: {
      title: '合作详情'
    }
  }, {
    path: '/publish',
    name: 'publish',
    component: () => asyncLoad('publish'),
    meta: {
      title: '发布'
    }
  }, {
    path: '/messages',
    name: 'messages',
    component: () => asyncLoad('messages'),
    meta: {
      title: '消息'
    }
  }, {
    path: '/me',
    name: 'me',
    component: () => asyncLoad('me'),
    meta: {
      title: '我的'
    }
  }]
}

export default router
