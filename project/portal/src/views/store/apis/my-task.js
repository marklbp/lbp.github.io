export default {
  task: {
    query: {
      url: '/task/queryTaskList',
      method: 'post'
    }
  },
  queryTaskList: {
    url: '/task/list',
    method: 'get',
    params: {
      pageSize: 10,
      currentPage: 1,
      searchType: '0'
    }
  },
  futureTaskList: {
    url: '/task/futureTaskList',
    method: 'post',
    data: {
      pageSize: 10,
      currentPage: 1
    }
  },
  changeStatus: {
    query: {
      url: '/task/updateTaskStatus',
      method: 'post'
    }
  },
  // 取消流程/独立任务
  cancleProcess: {
    url: '/process/cancelProcess',
    method: 'post',
    data: {
      processInstanceId: '' // 流程id/独立任务id
    }
  },
  // 查询流程任务相关任务列表(子节点任务，子任务)
  fetchList: {
    url: '/task/taskListForProcess/:rootProcessInstanceId/:type',
    method: 'get'
  },
  // 导出全局任务
  exportAllTask: {
    url: '/task/exportAllTaskExcel',
    method: 'get',
    params: {}
  },
  // 导出店铺任务
  exportTask: {
    url: '/task/exportTaskExcel',
    method: 'get',
    params: {}
  },
  // 导出店铺流程
  exportProcess: {
    url: '/act/form/exportFormExcel',
    method: 'get',
    params: {}
  }
}
