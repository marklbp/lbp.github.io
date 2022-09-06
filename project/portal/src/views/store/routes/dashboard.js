const load = dir => () => import(`../views/dashboard/components/${dir}`)
export default [
  {
    path: '/:storeId/summary/situation/:type', // 任务和流程概况 type: process/task
    component: load('situation'),
    props: true,
    meta: {
      top: true
    }
  },
  {
    path: '/:storeId/summary/list/:type', // 任务和流程列表 type: process/task
    component: load('list'),
    props: true,
    meta: {
      top: true
    }
  },
  {
    path: '/:storeId/summary/knowledge', // 知识库概览
    component: load('knowledge'),
    props: true,
    meta: {
      top: true
    }
  }
]
