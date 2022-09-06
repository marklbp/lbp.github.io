export default {
  // 查询知识库分类列表接口
  selectListByCode: {
    url: '/dict/selectListByCode',
    method: 'post',
    data: {
      dictCode: 'ARTICLETYPE' /*,
      dict: {
        groupId: null
      }*/
    }
  },
  // 查询知识库列表接口
  selectPageList: {
    url: '/article/selectPageList',
    method: 'post',
    data: {
      groupId: 0, // 店铺storeId
      currentPage: 1,
      pageSize: 10,
      type: -1, // 分类dictKey -1代表全部
      sources: 1, // 店铺端传1，P端传0
      title: ''
    }
  },
  // 添加店铺知识库接口
  addArticle: {
    url: '/article/addOrUpdate',
    method: 'post',
    data: {
      groupId: '1', // 店铺storeId
      title: '',
      type: -1, // 分类dictKey -1代表全部
      content: ''
    }
  },
  // 修改店铺知识库接口
  updateArticle: {
    url: '/article/addOrUpdate',
    method: 'post',
    data: {
      id: 0,
      groupId: '1', // 店铺storeId
      title: '',
      type: -1, // 分类dictKey -1代表全部
      content: ''
    }
  },
  // 查询文章
  selectDetailById: {
    url: '/article/selectDetailById',
    method: 'post',
    data: {
      id: 0
    }
  },
  // 删除文章
  del: {
    url: '/article/del',
    method: 'post',
    data: {
      ids: []
    }
  },
  // 添加知识库分类
  saveDict: {
    url: '/dict/saveDict',
    method: 'post',
    data: {
      dictCode: 'ARTICLETYPE', // 固定写死
      dict: {
        dictKey: '',
        dictValue: '',
        groupId: 1
      }
    }
  },
  // 查询店铺文章
  showDetail: {
    url: '/article/showDetail',
    method: 'post',
    data: {
      id: 0
    }
  }
}
