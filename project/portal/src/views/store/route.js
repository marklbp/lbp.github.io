import setting from './routes/setting'
import knowledge from './routes/knowledge'
import dashboard from './routes/dashboard'
const asyncImport = n => _ => import(`./views/${n}`)
export default [
  // 店铺管理
  {
    path: '/store',
    component: asyncImport('index')
  },

  // 运营流程
  {
    path: '/:storeId/operation',
    component: asyncImport('operation/index.vue')
  },

  // 任务管理
  {
    path: '/:storeId/task/',
    component: asyncImport('task')
  },

  // 任务管理 -> 新建独立任务
  {
    path: '/:storeId/task/create',
    component: asyncImport('task/independent/create.vue')
  },
  // 店铺概览
  {
    path: '/:storeId/dashboard',
    component: asyncImport('dashboard')
  },

  // 数据报表
  {
    path: '/:storeId/report',
    component: asyncImport('report')
  },
  // 任务管理 -> 流程启动
  {
    path: '/:storeId/flow-start/:fid',
    component: asyncImport('task/myOperation/flow-start')
  },
  // 任务管理 -> 流程详情 rootProcessExec->流程id，taskDefinitionKey->节点id
  {
    path: '/:storeId/flow-detail/:rootProcessExec',
    component: asyncImport('task/myOperation/flow-detail')
  },
  // 任务管理 -> 流程任务详情 rootProcessExec->流程id，taskDefinitionKey->节点id
  {
    path:
      '/:storeId/process-task-detail/:rootProcessExec/:taskDefinitionKey?/:index?',
    component: asyncImport('task/myOperation/process-task-detail')
  },
  // 任务详情
  {
    path: '/:storeId/task-detail/:processExecId',
    component: asyncImport('task/detail/index.vue')
  },
  // 已归档
  {
    path: '/:storeId/place-on-file',
    component: asyncImport('task/onFile/index.vue')
  },
  // 消息独立任务详情
  {
    path: '/:storeId/task-detail-message/:processExecId',
    component: asyncImport('task/detail/index.vue'),
    meta: {
      top: true
    }
  },
  // 店铺日历
  {
    path: '/:storeId/store-calendar',
    component: asyncImport('store-calendar')
  },
  // 店铺日历 -> 新建活动
  {
    path: '/:storeId/store-calendar/create-activity',
    component: asyncImport('store-calendar/component/create-activity')
  },
  // 店铺日历查看任务详情
  {
    name: 'activity-detail',
    path: '/:storeId/store-calendar/activity-detail/:id',
    props: true,
    component: asyncImport('store-calendar/component/activity-detail')
  },
  ...setting,
  ...knowledge,
  ...dashboard,
  // 企业微信跳转到流程任务入口页
  {
    path:
      '/:storeId/flow-task-detail/:rootProcessExec/:taskDefinitionKey?/:index?',
    component: asyncImport('task/myOperation/flow-task-detail'),
    meta: {
      top: true
    }
  }
]
