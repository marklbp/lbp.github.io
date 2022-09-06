let MENU_SYS = [
  {
    href: '/dashboard',
    hide: true
  },
  {
    icon: 'article',
    text: '我的任务',
    href: '/task?myTab=0'
  },
  {
    icon: 'shop',
    text: '店铺运营',
    id: 1,
    href:
      '/store' /*,
    children: [
      {
        icon: 'tenant-management',
        text: 'shop01',
        href: '/shop01'
      },
      {
        icon: 'order',
        text: 'shop02',
        children: [
          {
            icon: 'payment',
            text: 'shop020',
            href: '/shop020'
          }
        ]
      },
      {
        icon: 'order',
        text: 'shop03',
        children: [
          {
            icon: 'payment',
            text: 'shop030',
            href: '/shop030'
          },
          {
            icon: 'shop',
            text: 'shop031',
            href: '/shop031'
          }
        ]
      }
    ]*/
  },
  {
    icon: 'xingzhuangx',
    text: '运营知识',
    href:
      '/knowledge' /*,
    children: [
      {
        icon: 'tenant-management',
        text: 'shop01',
        href: '/shop01'
      },
      {
        icon: 'order',
        text: 'shop02',
        children: [
          {
            icon: 'payment',
            text: 'shop020',
            href: '/shop020'
          }
        ]
      },
      {
        icon: 'order',
        text: 'shop03',
        children: [
          {
            icon: 'payment',
            text: 'shop030',
            href: '/shop030'
          },
          {
            icon: 'shop',
            text: 'shop031',
            href: '/shop031'
          }
        ]
      }
    ]*/
  }
  // {
  //   icon: 'analytics',
  //   text: '数据报表',
  //   href: '/analytics'
  // },
  // {
  //   icon: 'article',
  //   text: '任务管理',
  //   href: '/task'
  // },
  // {
  //   icon: 'folder',
  //   text: '项目管理',
  //   href: '/projects'
  // },
  // {
  //   icon: 'buya_saleb',
  //   text: '资产管理',
  //   href: '/assets'
  // }
]
let MENU_SHOP = [
  {
    icon: 'single-left',
    text: '店铺运营',
    id: 1,
    href: '/dashboard'
  },
  {
    icon: 'system-menu',
    text: '店铺概览',
    href: '/:storeId/dashboard'
  },
  /* {
    icon: 'framework',
    text: '运营流程',
    href: '/:storeId/operation'
  },
  {
    icon: 'calendar',
    text: '店铺日历',
    href: '/:storeId/store-calendar'
  }, */
  {
    icon: 'article',
    text: '任务管理',
    href: '/:storeId/task'
  },
  // {
  //   icon: 'analytics',
  //   text: '数据报表',
  //   href: '/:storeId/report'
  // },
  {
    icon: 'xingzhuangx',
    text: '知识库',
    href: '/:storeId/knowledge'
  },
  {
    icon: 'shop-setting',
    text: '店铺设置',
    // href: '/:storeId/setting'
    children: [
      {
        text: '成员权限',
        href: '/:storeId/setting/staff'
      },
      {
        text: '流程设置',
        href: '/:storeId/setting/operation'
      },
      {
        text: '任务提醒设置',
        href: '/:storeId/setting/remind'
      }
    ]
  }
]
function addShow(menus) {
  menus.forEach(m => {
    Object.assign(m, { showSelf: true, showChildren: false })
    if (m.children && m.children.length) addShow(m.children)
  })
}

addShow(MENU_SYS)
addShow(MENU_SHOP)
export default [MENU_SYS, MENU_SHOP]
