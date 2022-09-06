export default {
  list: {
    url: '/act/category/queryCategory',
    method: 'get'
  },
  add: {
    url: '/act/category/saveCategory',
    method: 'post',
    data: {
      name: null
    }
  }
}
