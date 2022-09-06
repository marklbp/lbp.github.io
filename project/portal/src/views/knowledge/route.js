const asyncImport = n => _ => import(`./views/${n}`)
export default [
  // 店铺管理
  {
    path: '/knowledge',
    component: asyncImport('index')
  }
]
