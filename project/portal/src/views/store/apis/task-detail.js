export default {
  getExecutor: {
    query: {
      url: '/user/userListByPage',
      method: 'get'
    }
  },
  getPolicy: {
    query: {
      url: '/basic/upload/deposit/getPolicy',
      method: 'post'
    }
  },
  getDetail: {
    url: '/task/singleTaskDetail/:processExecId',
    method: 'get',
    data: {
      processExecId: null
    }
  },
  getDetailAuth: {
    url: '/process/fieldPermissions',
    method: 'get',
    data: {
      type: '1', //权限的类型 1:独立任务 2:节点任务 3:子任务实例
      processInstanceId: '', // 流程实例id
      taskDefinitionKey: '' // 流程任务地的节点id,节点任务需要传
    }
  },
  postTask: {
    query: {
      url: '/subTask/save',
      method: 'post'
    }
  },
  updateTask: {
    url: '/task/updateSingleTask',
    method: 'post'
  },
  // 重复周期
  updateCyclical: {
    url: '/task/cyclical/update',
    method: 'post',
    data: {
      fieldName: 'cyclical', // 需要更新字段名
      fieldValue: '', // 需要更新字段值
      processType: 1, // 需要更新字段名
      groupId: '', // 店铺id
      processInstanceId: '', //流程实例id
      cyclical: '' // 周期任务传参
    }
  },
  // 任务修改日志
  taskLog: {
    url: '/task/queryTaskOperationLog',
    method: 'post',
    data: {
      processInstanceId: '', // 流程id/独立任务id
      definitionKey: '' // 流程子任务id
    }
  }
}
