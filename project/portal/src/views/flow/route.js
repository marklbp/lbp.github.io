export default [
  {
    path: '/editor/:storeId?/:modelId?/:modifyType?/:fromStandard?', // modifyType === 0时时引用, 1是编辑, fromStandard是否是标准模板
    component: _ => import('./index'),
    meta: {
      top: true
    }
  }
]
