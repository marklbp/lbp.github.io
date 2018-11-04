const asyncLoad = name => () => import(`./${name}`)

const router = {
  routes: [{
    path: '/',
    redirect: 'project'
  },{
    path: '/project',
    name: 'project',
    component: asyncLoad('project'),
    meta: {
      title: '项目'
    }
  }, {
    path: '/resource',
    name: 'resource',
    component: asyncLoad('resource'),
    meta: {
      title: '资源'
    }
  }, {
    path: '/resource/:id/:from?',
    name: 'resource-detail',
    component: asyncLoad('resource_detail'),
    meta: {
      title: '资源详情'
    }
  }, {
    path: '/cooperate/:id',
    component: asyncLoad('cooperate'),
    meta: {
      title: '合作详情'
    }
  }, {
    path: '/publish',
    name: 'publish',
    component: asyncLoad('publish'),
    meta: {
      title: '发布'
    }
  }, {
    path: '/messages',
    name: 'messages',
    component: asyncLoad('messages'),
    meta: {
      title: '消息'
    }
  }, {
    path: '/me',
    name: 'me',
    component: asyncLoad('me'),
    meta: {
      title: '我的'
    }
  }, {
    path: '/contact/:id',
    name: 'contact',
    component: asyncLoad('contact'),
    meta: {
      title: ''
    }
  }, {
    path: '/login',
    name: 'login',
    component: asyncLoad('login'),
    meta: {
      title: ''
    }
  }, {
    path: '/search',
    name: 'search',
    component: asyncLoad('search_result'),
    meta: {
      title: ''
    }
  }, {
    path: '/member/:id',
    name: 'member',
    component: asyncLoad('member'),
    meta: {
      title: '成员'
    }
  }, {
    path: '/bcard/:id/:from?',
    name: 'bcard',
    component: asyncLoad('business_card'),
    meta: {
      title: '名片'
    }
  }, {
    path: '/plist/:id',
    name: 'plist',
    component: asyncLoad('project_list'),
    meta: {
      title: '项目'
    }
  }, {
    path: '/relationship',
    name: 'relationship',
    component: asyncLoad('relationship'),
    meta: {
      title: '人脉'
    }
  }, {
    path: '/my-resource',
    name: 'my-resource',
    component: asyncLoad('my_resource'),
    meta: {
      title: '资源'
    }
  }, {
    path: '/identify',
    name: 'identify',
    component: asyncLoad('identify'),
    meta: {
      title: '认证'
    }
  }, {
    path: '/verify',
    name: 'verify',
    component: asyncLoad('verify'),
    meta: {
      title: '审核'
    }
  }, {
    path: '/profile',
    name: 'profile',
    component: asyncLoad('profile'),
    meta: {
      title: '完善资料'
    }
  }, {
    path: '/phone-bind',
    name: 'phone-bind',
    component: asyncLoad('phone_bind'),
    meta: {
      title: '绑定手机'
    }
  }, {
    path: '/password',
    name: 'password',
    component: asyncLoad('password'),
    meta: {
      title: '设置密码'
    }
  }, {
    path: '/my-company',
    name: 'my-company',
    component: asyncLoad('my_company'),
    meta: {
      title: '公司'
    }
  }]
}

export default router
