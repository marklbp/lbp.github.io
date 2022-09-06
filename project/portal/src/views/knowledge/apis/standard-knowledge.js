export default {
  // 查询知识库列表接口
  selectStandardknowledgeList: {
    url: '/article/p/selectPageList',
    method: 'post',
    data: {
      groupId: 0, // 店铺storeId
      currentPage: 1,
      pageSize: 10,
      type: -1, // 分类dictKey -1代表全部
      sources: 0, // 店铺端传1，P端传0
      title: ''
    }
  }
}
