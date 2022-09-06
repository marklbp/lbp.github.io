export default {
  getAllGroupRole: {
    url: `/groupRole/queryAll`,
    method: 'post',
    data: {
      groupId: 0
    }
  },
  getAll: {
    url: `/groupUser/queryAllGroupUsers`,
    method: 'post',
    data: {
      groupId: 0,
      page: 1,
      pageSize: 10
    }
  },
  addUser: {
    url: `/groupUser/save`,
    method: 'post',
    data: {
      groupUsers: [],
      roleIds: []
    }
  },
  updateUser: {
    url: `/groupUser/update`,
    method: 'post',
    data: {
      id: 0,
      roleIds: []
    }
  },
  deleteUser: {
    url: `/groupUser/delete`,
    method: 'post',
    data: {
      id: '',
      groupId: '',
      roleIds: [],
      userCode: '',
      userName: ''
    }
  },
  // 获取角色列表
  getRole: {
    url: `/groupRole/selectPageList`,
    method: 'post',
    data: {
      groupId: 0,
      page: 1,
      pageSize: 10
    }
  },
  // 删除角色
  delRole: {
    url: `/groupRole/deleteGroupRole`,
    method: 'post',
    data: {
      id: ''
    }
  },
  // 添加、编辑角色
  addRole: {
    url: `/groupRole/addOrUpdate`,
    method: 'post',
    data: {
      name: '',
      id: null,
      groupId: 0
    }
  },
  //查询角色的权限列表树
  getRoleLabel: {
    url: `/group/perm/tree`,
    method: 'get'
  },
  // 查询选中id
  getTreeId: {
    url: `/group/perm/permIds`,
    method: 'get'
  },
  // 点击tab 获取列表
  getRoleTabsLabel: {
    url: `/group/perm/children`,
    method: 'get',
    params: {
      roleId: 0,
      parentId: 0
    }
  },
  // 下载excel
  exportErrorExcelData: {
    url: `/groupUser/exportErrorExcelData`,
    method: 'post',
    data: {
      errorDatas: [],
      errorList: [],
      excelErrorDatas: [],
      successList: [],
      failedList: [],
      successCount: 0,
      errorCount: 0
    }
  }
}
