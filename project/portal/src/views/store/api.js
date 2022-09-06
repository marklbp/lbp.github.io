import template from './apis/template'
import myTask from './apis/my-task'
import groupUser from './apis/group-user'
import flowSetting from './apis/flow-setting'
import taskDetail from './apis/task-detail'
import flowCategory from './apis/category'
import knowledge from './apis/knowledge'
import dashboard from './apis/dashboard'
import calendar from './apis/calendar'
export default {
  // 店铺列表
  storeList: {
    get: {
      url: '/group/myGroups',
      method: 'get'
    }
  },
  processList: {
    get: {
      url: '/act/form/queryProcessByPage',
      params: {
        type: 1,
        pageSize: 10,
        currentPage: 1,
        status: -1,
        filed: null
      }
    }
  },
  workers: {
    get: {
      url: `/user/userListByPage?pageSize=-1`,
      method: 'get'
    }
  },
  flowSetting,
  template,
  groupUser,
  taskDetail,
  myTask,
  flowCategory,
  knowledge,
  dashboard,
  calendar,
  //独立任务
  independent: {
    save: {
      url: '/task/saveSingleTask',
      method: 'post',
      data: {
        copyPerson: '',
        description: '',
        attachment: '',
        endTime: '',
        assignee: '',
        groupId: 0,
        isRemindTask: '',
        label: '',
        priority: ''
      }
    }
  },
  // 店铺任务
  storeTask: {
    // 获取所有店铺任务
    getAllStoreTask: {
      url: '/task/queryShopTask',
      method: 'post'
    },
    // 分页获取店铺任务
    getStoreTaskByPage: {
      url: '/task/queryShopByPage',
      method: 'get',
      params: {
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  storeIndex: {
    recentVisitCalculation: {
      // url: '/recentVisit/calculation',
      url: '/groupUser/addNextRecent',
      method: 'post'
      /* data: {
        tableType: 't_group'
      } */
    }
  },
  onFileList: {
    getOnFileList: {
      url: '/task/queryFiledPageList',
      method: 'post',
      data: {
        keyword: '' // 搜索关键字
      }
    }
  },
  remind: {
    querySetting: {
      url: '/task/remind/querySetting',
      method: 'get'
    },
    updateSetting: {
      url: '/task/remind/updateSetting',
      method: 'post',
      data: {
        hoursBeforeOverdue: '', // 截止前小时数
        hoursOverdue: '', // 逾期后小时数
        remindBeforeOverdue: '', // 是否开启截止前提醒，0：是 1：否 ,
        remindOverdue: '', // 是否开启逾期后提醒，0：是 1：否
        createRemind: '' // 是否创建时提醒，0：是；1：否
      }
    }
  },
  tag: {
    get: {
      url: '/tag',
      method: 'get',
      params: {
        // likeName: '',
        // groupId: '',
        // name: ''
      }
    },
    post: {
      url: '/tag',
      method: 'post',
      data: {
        name: ''
      }
    },
    delete: {
      url: '/tag',
      method: 'delete',
      data: {
        id: '',
        processInstanceId: ''
      }
    },
    put: {
      url: '/tag',
      method: 'put',
      data: {
        id: '',
        name: ''
      }
    }
  },
  getProcessCalendarView: {
    url: '/act/form/queryProcessCalendarByPage',
    method: 'get',
    params: {
      type: 1, // 类型 1:我执行的，2:我创建的，3:抄送给我的，4:店铺流程
      groupId: null, // 群组id
      status: null, // 状态, 0:未开始，1:进行中，2:已完成，3:已取消，4:已暂停，5:有逾期
      filed: 0, // 是否归档；0 = 否 1=是
      keyWord: null, // 关键词
      creator: null, // 发起人
      tags: null, // 标签
      createFrom: null, // 创建时间开始
      createTo: null, // 创建时间结束
      currentPage: 1, // 当前页(默认第一页)
      pageSize: 10 // 每页大小(默认每页10条记录)
    }
  }
}
