import X from './apis/x'
export default {
  demo: {
    get: {
      url: '/get/:paramKey',
      method: 'get',
      params: {
        /*如果请求方式是post则为data*/
        paramKey: null /*此处必须写，供接口url替换:paramKey*/
      },
      headers: {
        a: 1
      }
    },
    post: {
      url: '/post/:paramKey',
      method: 'post',
      data: {
        /*如果请求方式是get则为params*/
        paramKey: null /*此处必须写，供接口url替换:paramKey*/,
        id: null
      }
    }
  }
}
