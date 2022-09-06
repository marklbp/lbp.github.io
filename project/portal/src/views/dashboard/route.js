const asyncImport = n => _ => import(`./views/${n}`)
export default [
  // dashboard
  {
    path: '/dashboard',
    component: asyncImport('index')
  }
]
