export default {
    common: {
        login: {
            url: '/login'
            ,config: {
                method: 'post'
                ,data: {
                    username: ''
                    ,password: ''
                }
            }
            ,name: '登录'
        }
        ,logout: {
            url: 'logout'
            ,config: {
                method: 'get'
            }
            ,name: '登出'
        }
        ,getType: {
            url: '/dict/list/{type}'
            ,config: {
                method: 'get'
            }
            ,name: '获取类型'
        }
    }
}