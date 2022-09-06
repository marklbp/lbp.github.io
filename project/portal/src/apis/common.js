export default {
  querySubModelListByPage: {
    url: '/act/model/querySubModelListByPage',
    method: 'post',
    data: {
      currentPage: '1',
      pageSize: '10'
    }
  },
  queryRobotServices: {
    url: '/robot/ministry/queryService',
    method: 'get'
  },
  queryServiceAttribute: {
    url: '/robot/attribute/queryAttribute',
    method: 'get',
    params: {
      ministryLabel: ''
    }
  },
  login: {
    url: '/auth/check?app=portal',
    method: 'get'
  },
  logout: {
    url: '/auth/uac/logout',
    method: 'get'
  },
  getUserInfo: {
    url: '/getUserInfo',
    method: 'get'
  },
  refreshSession: {
    url: '/refreshCookies',
    method: 'get'
  },
  // 授权店铺
  authStore: {
    url: '/auth/acl',
    method: 'get',
    params: {
      shopId: '',
      appCode: 'portal'
    }
  },
  filterByTask2Flow: {
    /*任务或流程的筛选*/
    url: '/task/list',
    method: 'get',
    params: {
      pageSize: 10,
      currentPage: 1,
      /**
       * 类型
       * 0:我执行的
       * 1：我创建的，
       * 2：抄送给我的，
       * 4：店铺任务列表 (默认查询我执行的任务)
       */
      searchType: 0,
      /*total: 0,*/
      /*是否隐藏已归档0:否，1:是*/
      isHideFile: 1,
      /*关键字*/
      keyWord: null,
      /*创建人*/
      creator: null,
      /*标签*/
      tags: null,
      /*状态*/
      status: null,
      /*开始时间*/
      fromTime: null,
      /*截止时间*/
      toTime: null,
      /*排序规则 0:默认排序,1:按创建时间倒序*/
      sort: 0
    }
  }
}
