export default {
  // 创建日历活动
  createActivity: {
    url: '/storeActivity/saveActivity',
    method: 'post',
    data: {
      type: 1, // 平台型1 店铺型2
      activityName: '', // 活动名
      activityStartTime: 0, // 开始时间
      activityEndTime: 0, // 截至时间
      address: '', // 地址
      description: '' // 描述
    }
  },
  // 查看任务详情
  activityDetail: {
    url: '/storeActivity/queryActivityContent',
    method: 'post',
    data: {
      id: 1 // 活动id
    }
  },
  updateActivity: {
    url: '/storeActivity/updateActivity',
    method: 'post',
    data: {
      id: 1, // 活动id
      type: 1, // 平台型1 店铺型2
      activityName: '', // 活动名
      activityStartTime: 0, // 开始时间
      activityEndTime: 0, // 截至时间
      address: '', // 地址
      description: '' // 描述
    }
  },
  exportCalendarData: {
    url: '/report/exportReport',
    method: 'post',
    data: {
      goalsShowTag: false, // 业务数据是否导出
      activityShowTag: false, // 活动数据是否导出
      exportTime: '' // 数据的时间 2019-09
    }
  },
  queryActivityList: {
    url: '/storeActivity/queryActivityListByTime',
    method: 'post',
    data: {
      exportTime: '' // 数据的时间 2019-09
    }
  },
  queryReportData: {
    url: '/report/queryGoalsByTime',
    method: 'post',
    data: {
      exportTime: '' // 数据的时间 2019-09
    }
  },
  delActivityById: {
    url: '/storeActivity/deleteActivity',
    method: 'post',
    data: {
      id: '' // 活动id
    }
  }
}
