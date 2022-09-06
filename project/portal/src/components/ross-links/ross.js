export default [
  {
    app: 'portal',
    appName: '运营门户',
    icon: require('./imgs/ross_logo.svg'),
    hosts: {
      sit: 'https://ross-portal-sit.baozun.com',
      uat: 'https://ross-portal-uat.baozun.com',
      pro: 'http://ross.baozun.com'
    },
    modules: [
      {
        pageName: '首页',
        path: '/dashboard'
      }
      /* {
        pageName: '任务管理',
        path: '/task'
      },
      {
        pageName: '运营知识',
        path: '/operation'
      },
      {
        pageName: '知识库',
        path: '/knowledge'
      },
      {
        pageName: '店铺设置',
        path: '/setting'
      } */
    ]
  },
  {
    app: 'design',
    appName: '设计家',
    icon: require('./imgs/design_logo.svg'),
    hosts: {
      dev: 'https://design-sit.baozun.com',
      sit: 'https://design-sit.baozun.com',
      uat: 'https://design-uat.baozun.com',
      pro: 'https://design.baozun.com'
    },
    modules: [
      {
        pageName: '页面采集',
        path: '/pictures/public/list'
      },
      {
        pageName: '数据采集',
        path: '/gather-data'
      },
      {
        pageName: '图像处理',
        path: '/image-preprocess/image-manage/table'
      },
      {
        pageName: '商品图打标',
        path: '/drafting/marking'
      },
      {
        pageName: '商品排墙',
        path: '/commodityWall/task'
      }
    ]
  },
  {
    app: 'speedraw',
    appName: '商品家',
    icon: require('./imgs/speedraw_logo.svg'),
    hosts: {
      sit: 'http://pim-sit.baozun.com',
      uat: 'https://pim-uat.baozun.com',
      pro: 'https://pim.baozun.com'
    },
    modules: [
      {
        pageName: '店铺管理',
        path: '/#/main/index'
      },
      {
        pageName: '详情页管理',
        path: '/#/main/product/product/table'
      },
      {
        pageName: '上架及同步',
        path: '/#/main/grounding/grounding/table'
      },
      {
        pageName: '商品管理',
        path: '/#/main/products/masterData/masterDataInfo'
      }
    ]
  },
  {
    app: 'activity',
    appName: '活动家',
    icon: require('./imgs/activity_logo.svg'),
    hosts: {
      sit: 'http://activity-sit.baozun.com',
      uat: 'http://activity-sit.baozun.com',
      pro: 'https://activity.baozun.com'
    },
    modules: [
      {
        pageName: '活动报名',
        path: '/#/main/activity/store/table'
      },
      {
        pageName: '百宝箱',
        path: '/#/main/activity/tools/table'
      }
    ]
  },
  {
    app: 'bizwise',
    appName: '数据家',
    icon: require('./imgs/bi_logo.svg'),
    hosts: {
      sit: 'https://bi.baozun.com/staging',
      uat: 'https://bi.baozun.com/staging',
      pro: 'https://bi.baozun.com/prod'
    },
    modules: []
  }
]
