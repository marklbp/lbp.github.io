import request from '@/plugins/axios'

export default {
	// 列表
    async fetchSpList(params) {
        let {data} = await request.get('/sp/getInfoList', params)
        return data
    },
    // 详情
    async getSpDetail(params) {
        let {data} = await request.get('/sp/detail/' + params)
        return data
    },
    // 开户
    async postSp(params) {
        let {data} = await request.post('/sp/add', params)
        return data
    },
    // 修改
    async putSp(params) {
        let {data} = await request.post('/sp/update', params)
        return data
    }
    ,sp: {
        getInfoList: {
            url: '/sp/getInfoList'
            ,config: {
                method: 'get'
                ,params: {
                    start: 1
                    ,limit: 10
                }
            }
            ,name: '获取sp列表'
        }
    }
}