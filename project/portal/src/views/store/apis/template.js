export default {
  // 流程模板列表
  list: {
    url: '/act/model/queryModelListByPage'
  },
  updateStatus: {
    url: '/act/open'
  },
  remove: {
    url: '/act/model/deleteModel/:id',
    method: 'post',
    data: {
      id: -1
    }
  },
  detail: {
    url: '/act/model/queryDetailById/:id',
    method: 'get',
    params: { id: -1 }
  },
  publish: {
    url: '/act/open',
    method: 'post',
    data: {
      id: null
    }
  },
  query: {
    url: '/processTemplate/detail',
    method: 'post',
    data: {
      id: '' /*对应模板列表的modelId或者路由的fid*/
    }
  },
  save: {
    url: '/processTemplate/save',
    method: 'post',
    data: {
      flowTree: null,
      //groupId: null,
      processModelAttribute: {
        label: null,
        category: null,
        description: null,
        knowledge: null
      },
      modelId: null /*编辑时存在*/,
      releaseTag: 0 /*0 -> 草稿  1 -> 发布*/
    }
  },
  stop: {
    url: '/act/model/stopUsing',
    method: 'post',
    data: {
      modelId: null
    }
  },
  list1: {
    url: '/admin/model/standardModelList' /*分页查询标准模板列表*/
  },
  quote: {
    url: '/processTemplate/quote',
    method: 'post',
    data: {
      id: -1,
      label: ''
    }
  },
  boot: {
    url: '/act/model/using',
    method: 'post',
    data: {
      id: null
    }
  }
}
