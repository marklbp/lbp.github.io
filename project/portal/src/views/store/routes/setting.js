const asyncImport = n => _ => import(`../views/${n}`)
export default [
  // 店铺设置
  {
    path: '/:storeId/setting',
    component: asyncImport('setting')
  },
  // 店铺设置 -> 任务提醒设置
  {
    path: '/:storeId/setting/remind',
    component: asyncImport('setting/remind')
  },
  // 店铺设置 -> 店铺信息
  {
    path: '/:storeId/setting/shop',
    component: asyncImport('setting/shop')
  },
  // 店铺设置 -> 人员管理 -> 人员列表
  {
    path: '/:storeId/setting/staff',
    component: asyncImport('setting/staff')
  },
  // 店铺设置 -> 人员管理 -> 人员列表->角色添加编辑
  {
    path: '/:storeId/setting/staff/edit',
    component: asyncImport('setting/staff/role-edit/index')
  },
  // 店铺设置 -> 流程设置 -> 模板列表
  {
    path: '/:storeId/setting/operation/:type?',
    component: asyncImport('setting/operation'),
    props: true
  },
  // 店铺设置 -> 模板详情
  {
    path: '/:storeId/template-detail/:fid/:status?/:categoryName?/:modelId?', // fromStandard是否是标准模板
    component: asyncImport('setting/operation/detail')
  }
]
