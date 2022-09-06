export default {
  globalTask: {
    getTask: {
      url: '/task/queryAllMyTask',
      method: 'get',
      data: {
        searchTaskName: '',
        tab: ''
      }
    }
  }
}
