const asyncImport = n => _ => import(`./views/${n}`)

export default [
  {
    path: '/task',
    component: asyncImport('index'),
    redirect: '/task/myTask',
    children: [
      {
        path: '/task/myTask',
        query: {
          myTab: 0
        },
        component: asyncImport('myTask/index')
      }
    ]
  }
]
