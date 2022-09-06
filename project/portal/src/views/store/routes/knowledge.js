const asyncImport = n => _ => import(`../views/${n}`)
export default [
  // 知识库列表页
  {
    path: '/:storeId/knowledge',
    component: asyncImport('knowledge/index.vue')
  },
  // 知识库列表页 -> 编辑
  {
    path: '/:storeId/knowledge/edit/:id',
    component: asyncImport('knowledge/edit/index'),
    meta: {
      top: true
    }
  },
  // 知识库列表页 -> 添加
  {
    path: '/:storeId/knowledge/add',
    component: asyncImport('knowledge/edit/index'),
    meta: {
      top: true
    }
  },
  // 知识库列表页 -> 查看
  {
    path: '/:storeId/knowledge/preview/:id',
    component: asyncImport('knowledge/preview/index'),
    meta: {
      top: true
    }
  }
]
