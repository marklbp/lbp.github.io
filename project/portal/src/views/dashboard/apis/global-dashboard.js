export default {
  // 查询跑马灯三条待办
  newestTaskForOverall: {
    url: '/task/newestTaskForOverall',
    method: 'get',
    params: {
      pageSize: 3,
      currentPage: 1,
      tab: 1
    }
  },
  // 查询dashboard四条标准知识库列表接口
  dashboardKnowledge: {
    url: '/article/index/dashboard',
    method: 'post',
    data: {
      groupId: 0, // 店铺storeId 写死为0
      pageSize: 4
    }
  },
  // 查询常用店铺
  queryRecentVisit: {
    // url: '/recentVisit/queryRecentVisit',
    url: '/groupUser/queryRecent',
    method: 'post'
    /* data: {
      tableType: 't_group'
    } */
  },
  // 下载报表
  downRecentDate: {
    url: '/dashboard/getReportLink',
    method: 'post',
    data: {
      queryDate: '', // 时间格式 2019-08-13
      type: '' //日报daily 周报weekly  月报monthly
    }
  },
  // GMV 数据
  getGmvData: {
    url: '/dashboard/getGmvDataFromBi',
    method: 'post'
  },
  // 查询SLP
  getSlpDataFromBi: {
    url: '/dashboard/getSlpDataFromBi',
    method: 'post'
  },
  // 查询dashboard结构数据
  // 查询跑马灯三条待办
  dashboardQuery: {
    url: '/dashboard/query',
    method: 'get'
    /* params: {
      pageSize: 3,
      currentPage: 1,
      tab: 1
    } */
  },
  // 保存dashboard结构数据
  dashboardSave: {
    url: '/dashboard/save',
    method: 'post'
  }
}
