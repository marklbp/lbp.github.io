import FLOW_ITEMS from './auth'
let runenv = (process.env || {}).RUN_ENV
let runtime = runenv.env || 'sit'
let runtimefix = runtime == 'prod' ? '' : '-' + runtime
let isSIT = /sit/.test(runtime)
let isUAT = /uat/.test(runtime)
let isPROD = /prod/.test(runtime)
let isUAT2PROD = /prod|uat/.test(runtime)
let uacHost = isPROD
  ? 'https://account.baozun.com'
  : isUAT
  ? 'http://10.101.6.114:48080'
  : 'http://test.account.baozun.cn'
export const API_HEADERS = {}
export const API_TIMEOUT = 10000
export const RUN_ENV = runenv
export const BUILD_ENV = (process.env || {}).NODE_ENV
export const CACHE_PREFIX = '__BAOZUN__'
export const API_BASE_URL =
  runenv.env && BUILD_ENV == 'production'
    ? '//ross-bpm{host}.baozun.com'.replace(/{host}/, runtimefix)
    : ''

export const LOGOUT = API_BASE_URL + '/logout'
/*  uacHost +
  '/person/logout?appkey=ross' +
  (isPROD ? '-portal' : '_web_' + runtime)*/
export const LOGIN = _ =>
  `https://${isPROD ? '' : 'ecs-uat-'}account.baozun.com/oauth/entry/ross${
    isPROD ? '' : '_' + runtime
  }?callbackurl=${encodeURIComponent(window.location.href)}`
/*  uacHost +
  (isUAT2PROD ? '/person/login?appkey=' : '/oauth/entry/') +
  'ross' +
  (isPROD ? '-portal' : '_web_' + runtime)*/

export const aliyunUrl = 'https://ic-muffy.oss-cn-beijing.aliyuncs.com/'
export const API_LOGIN_HOST = runenv.env
  ? 'https://ross-auth{host}.baozun.com'.replace(/{host}/, runtimefix)
  : ''
export default {
  API_BASE_URL,
  API_HEADERS,
  API_TIMEOUT,
  CACHE_PREFIX,
  RUN_ENV,
  BUILD_ENV,
  LOGOUT,
  LOGIN,
  DEBUG: BUILD_ENV !== 'production',
  aliyunUrl,
  PRIORITIES: [
    { id: 0, name: '普通' },
    { id: 1, name: '紧急' },
    { id: 2, name: '非常紧急' }
  ],
  FLOW_STATUS: [
    { id: -1, name: '全部' },
    { id: 0, name: '未开始' },
    { id: 1, name: '进行中' },
    { id: 2, name: '已完成' },
    { id: 3, name: '已暂停' },
    { id: 4, name: '已取消' },
    { id: 5, name: '草稿' }
  ],
  TASK_STATUS: [
    { id: 0, name: '待处理' },
    { id: 1, name: '进行中' },
    { id: 2, name: '已完成' },
    { id: 3, name: '已暂停' },
    { id: 4, name: '已取消' }
  ],
  PAGE_SIZES: [
    { id: 10, name: '每页10条' },
    { id: 20, name: '每页20条' },
    { id: 50, name: '每页50条' }
  ],
  FLOW_ITEMS,
  TEMPLATE_STATUS: [
    { id: -1, name: '全部' },
    { id: 0, name: '草稿' },
    { id: 1, name: '已发布' },
    { id: 2, name: '停用' }
  ],
  zIndex: 1,
  TOOLS: [
    {
      id: 1,
      name: '运营门户',
      icon: require('../components/ross-links/imgs/ross_logo.svg'), // '/static/images/tool-icon-ross.png',
      url: '/'
    },
    {
      id: 2,
      name: '设计家',
      icon: require('../components/ross-links/imgs/design_logo.svg'),
      url: `https://design${runtimefix}.baozun.com`
    },
    {
      id: 3,
      name: '商品家',
      icon: require('../components/ross-links/imgs/speedraw_logo.svg'),
      url: `https://pim${runtimefix}.baozun.com`
    },
    {
      id: 4,
      name: '活动家',
      icon: require('../components/ross-links/imgs/activity_logo.svg'),
      url: `http${runtime == 'prod' ? 's' : ''}://${
        runtime == 'prod' ? '' : runtime == 'uat' ? 'dev-' : 'sit-'
      }activity${runtime == 'prod' ? '.baozun.com' : '-web.dev.casaba.tech'}`
    },
    {
      id: 5,
      name: '数据家',
      icon: require('../components/ross-links/imgs/bi_logo.svg'),
      url: `//bi.baozun.com/${runtime == 'prod' ? 'prod' : 'staging'}`
    }
  ],
  API_LOGIN_HOST
}
