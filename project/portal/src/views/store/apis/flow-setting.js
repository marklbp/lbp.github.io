export default {
  // 模板分类列表
  getCategoryList: {
    url: '/act/category/queryCategory',
    method: 'get'
  },
  getAssignee: {
    url: '/user/userListByPage',
    method: 'get',
    params: {
      pageSize: -1
    }
  },
  flowStart: {
    url: '/process/processInstance/create',
    method: 'post',
    data: {
      flowTree: null,
      //groupId: null,
      processModelAttribute: {
        label: '',
        category: null,
        description: '',
        knowledge: ''
      },
      modelId: '' /*编辑时存在*/
    }
  },
  flowDetail: {
    url: '/act/form/queryProcessDetail/:rootProcessExec',
    method: 'get',
    data: {
      rootProcessExec: null
    }
  },
  nodeDetail: {
    url: '/task/queryProcessTaskDetail',
    method: 'post',
    data: {
      processExecId: null,
      taskDefinitionKey: null
    }
  },
  updateNodeDetail: {
    url: '/task/updateElementForm',
    method: 'post',
    data: {}
  },
  addSubTask: {
    url: '/subTask/save',
    method: 'post',
    data: {
      /*"copyPerson": "1101926,1101921,1101922",
      "description": "wzx0909",
      "attachment":[{"name":"附件1","url":"http://11111.com"},{"name":"附件2","url":"http://222222.com"}],
      "assignee": "1101926",
      "groupId": 1,
      "label": "wzx0909",
      "endTime": 1560915932,
      "priority": 0,
      "rootProcessInstanceId":"757501" //?流程子任,
      "taskDefinitionKey":"3"//?流程子任务,
      "processInstanceId": null//? 独立任务子任务
      "processType":"1"|"2"*/
    }
  },
  updateTaskStatus: {
    url: '/task/updateTaskStatus',
    method: 'post'
  },
  updateSubTaskDetail: {
    url: '/subTask/update',
    method: 'post',
    data: {
      rootProcessInstanceId: null, //主流程id
      taskDefinitionKey: null, //节点id
      processInstanceId: null, //子任务的流程id 没有可以不传
      processType: 3, //任务类型0:流程任务实例 1:独立任务实例,2:节点任务实例 3:子任务实例
      fieldName: null, //编辑的字段名
      fieldValue: null //编辑的字段值
    }
  },
  updateFlowDetail: {
    url: '/process/processUpdate',
    method: 'post',
    data: {
      processInstanceId: null,
      filedName: null,
      filedValue: null
    }
  },
  getFlowPrivilege: {
    url:
      '/process/fieldPermissions?type=:type&processInstanceId=:processInstanceId',
    method: 'get',
    params: {
      type: 0, // 0 -> 流程权限， 1 -> 独立任务权限，2 -> 流程任务， 3 -> 子任务
      processInstanceId: null
    }
  },
  getTaskPrivilege: {
    url:
      '/process/fieldPermissions?type=:type&taskDefinitionKey=:taskDefinitionKey',
    method: 'get',
    params: {
      type: 2 /*dataCloneId: null, //子任务未生成时替换processInstanceId入参*/, // 0 -> 流程权限， 1 -> 独立任务权限，2 -> 流程任务， 3 -> 子任务
      /*processInstanceId: null,*/ taskDefinitionKey: null
    }
  },
  // 获取评论列表
  getCommentList: {
    url: '/processComment/queryComment',
    method: 'post',
    data: {
      processInstanceId: 0 // 流程id
    }
  },

  // 删除评论
  delComment: {
    url: '/processComment/delete',
    method: 'post',
    data: {
      id: 0 // 评论id
    }
  },

  // 添加评论
  addComment: {
    url: '/processComment/addOrUpdate',
    method: 'post',
    data: {
      processInstanceId: 0, // 流程id
      content: '' // 评论内容
    }
  }
}
