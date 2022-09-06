export default {
  // 查询跑马灯三条待办
  taskListForNewestDone: {
    url: '/task/taskListForNewestDone',
    method: 'get',
    params: {
      pageSize: 3,
      currentPage: 1,
      tab: 1
    }
  },
  // 店铺流程概况
  getStoreProcessSummary: {
    url: '/process/descOfProForGroup',
    method: 'get'
  },
  // 全局流程概况
  getGlobalProcessSummary: {
    url: '/process/descOfProForAll',
    method: 'get'
  },
  // 店铺任务概况
  getStoreTaskSummary: {
    url: '/task/queryMyTaskSurvey',
    method: 'post'
  },
  // 全局任务概况
  getGlobalTaskSummary: {
    url: '/task/queryAllMyTaskSurvey',
    method: 'post'
  },
  // 全局知识库
  getGlobalKnowledgeList: {
    url: '/article/index/dashboard',
    method: 'post'
  }
}
