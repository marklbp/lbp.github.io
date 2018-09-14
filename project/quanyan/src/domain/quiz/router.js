import Vue from 'vue'
import Router from 'vue-router'
import helper from '@/helpers/router'
import NProgress from 'nprogress'
import { setTitle, delNavButtons } from '@/services/native.js'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(Router)
//  配置页面进度条不显示loading
NProgress.configure({ showSpinner: false })

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      /* redirect: '/footballgame/play' */
      component: () => import(/* webpackChunkName: "home" */ './views/common/home.vue'),
      meta: {
        title: '竞猜',
        bgGray: true
      }
    },
    {

      path: '/footballgame/lottery/home',
      name: 'LotteryHome',
      component: () => import('./views/footballGame/lottery/home.vue'),
      meta: {
        title: '彩票竞猜',
        bgGray: true
      }
    },
    {
      path: '/footballgame/play',
      name: 'FootballGamePlay',
      component: () => import('./views/footballGame/play/play.vue'),
      meta: {
        title: '足球竞猜',
        bgGray: true,
        keepAlive: true
      }
    },
    {
      path: '/footballgame/betting',
      name: 'FootballGameBetting',
      component: () => import('./views/footballGame/betting/betting.vue'),
      meta: {
        title: '投注',
        bgGray: true,
        keepAlive: true
      }
    },
    {
      path: '/footballgame/lottery/rule',
      name: 'LotteryRule',
      component: () => import('./views/footballGame/lottery/rule.vue'),
      meta: {
        title: '玩法规则',
        bgGray: true
      }
    },
    {
      path: '/footballgame/lottery/service-protocol',
      name: 'LotteryServiceProtocol',
      component: () => import('./views/footballGame/lottery/service-protocol.vue'),
      meta: {
        title: '竞猜用户服务协议书',
        bgGray: true
      }
    },
    {
      path: '/footballgame/lottery/manage',
      name: 'LotteryManage',
      component: () => import('./views/footballGame/lottery/manage.vue'),
      meta: {
        title: '竞猜管理',
        bgGray: true
      }
    },
    {
      path: '/footballgame/information/index',
      name: 'LastestInformation',
      component: () => import('./views/footballGame/information/index.vue'),
      meta: {
        title: '资讯',
        bgGray: true
      }
    },
    {
      path: '/footballgame/information/detail/:id',
      name: 'LastestInformationDetail',
      component: () => import('./views/footballGame/information/detail.vue'),
      meta: {
        title: '资讯详情',
        bgGray: true
      }
    },
    // {
    //   path: '/footballgame/lottery-point/exchange',
    //   name: 'lotteryPointExchange',
    //   component: () => import('./views/footballGame/lottery-point/exchange.vue'),
    //   meta: {
    //     title: '积分兑换',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/lottery-point/get-point',
    //   name: 'lotteryPointGet',
    //   component: () => import('./views/footballGame/lottery-point/get-point.vue'),
    //   meta: {
    //     title: '积分获取',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/lottery-point/record',
    //   name: 'lotteryPointRecord',
    //   component: () => import('./views/footballGame/lottery-point/record.vue'),
    //   meta: {
    //     title: '记录',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/lottery-point/detail',
    //   name: 'lotteryPointDetail',
    //   component: () => import('./views/footballGame/lottery-point/Detail.vue'),
    //   meta: {
    //     title: '积分明细',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/lottery-point/my',
    //   name: 'MyLotteryPoint',
    //   component: () => import('./views/footballGame/lottery-point/my.vue'),
    //   meta: {
    //     title: '我的积分',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/guess/world-cup',
    //   name: 'GuessWorldCup',
    //   component: () => import('./views/footballGame/guess/world-cup.vue'),
    //   meta: {
    //     title: '详情',
    //     bgGray: true
    //   }
    // },
    // {
    //   path: '/footballgame/award-list/index',
    //   name: 'AwardList',
    //   component: () => import('./views/footballGame/award-list/index.vue'),
    //   meta: {
    //     title: '开奖信息',
    //     bgGray: true
    //   }
    // },
    {
      path: '/footballgame/award-list/detail',
      name: 'AwardDetail',
      component: () => import('./views/footballGame/award-list/detail.vue'),
      meta: {
        title: '开奖信息',
        bgGray: true
      }
    },
    // {
    //   path: '/footballgame/order/apply',
    //   name: 'lotteryOrderApply',
    //   component: () => import('./views/footballGame/order/apply.vue'),
    //   meta: {
    //     title: '竞猜支付',
    //     bgGray: true
    //   }
    // },
    {
      path: '/footballgame/order/record',
      name: 'lotteryOrderRecord',
      component: () => import('./views/footballGame/order/record.vue'),
      meta: {
        title: '竞猜记录',
        bgGray: true
      }
    },
    {
      path: '/footballgame/order/detail/:id',
      name: 'lotteryOrderDetail',
      component: () => import('./views/footballGame/order/detail.vue'),
      meta: {
        title: '竞猜详情',
        bgGray: true
      }
    },
    {
      path: '/worldcup',
      name: 'worldCup',
      component: () => import('./views/worldCup/list/list.vue'),
      meta: {
        title: '猜冠军',
        keepAlive: true
      }
    },
    {
      path: '/footballgame/live/match-live',
      name: 'matchLive',
      component: () => import('./views/footballGame/live/match-live.vue'),
      meta: {
        title: '比分直播',
        bgGray: true
      }
    },
    {
      path: '/worldcup/betting/:type',
      name: 'worldCupBetting',
      props: true,
      component: () => import('./views/worldCup/betting/betting.vue'),
      meta: {
        title: '投注',
        bgGray: true,
        keepAlive: true
      }
    },
    {
      path: '/pay/:bizOrderId',
      name: 'Pay',
      props: true,
      component: () => import('./views/common/pay.vue'),
      meta: {
        title: '支付',
        bgGray: true
      }
    },
    {
      path: '/accout/quizmanager',
      name: 'AccountQuizManager',
      component: () => import('./views/accout/quiz-manager.vue'),
      meta: {
        title: '竞猜管理',
        bgGray: true
      }
    },
    ...helper.routes.auth
  ]
})

router.beforeEach((to, from, next) => {
  //  显示进度条
  NProgress.start()
  document.title = to.meta.title
  //  销毁组件库公共实例
  if (window.mdDialogInstances && window.mdDialogInstances.length > 0) {
    window.mdDialogInstances.forEach(item => {
      item.close && item.close()
    })
  }
  next()
})

router.afterEach((to, from, next) => {
  //  隐藏进度条
  NProgress.done()
  //  删除titletar上的功能按钮
  delNavButtons()
  //  设置标题
  let title = (to.meta && to.meta.title) || ''
  setTitle(title)
  //  设置背景色
  if (to.meta && to.meta.bgGray) document && document.body && document.body.classList && document.body.classList.add('bg-gray')
  else document && document.body && document.body.classList && document.body.classList.remove('bg-gray')
})

//  路由出错
router.onError(NProgress.done)

export default router
