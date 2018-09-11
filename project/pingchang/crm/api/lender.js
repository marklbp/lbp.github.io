import request from '@/plugins/axios'

export default {
    lender: {
        getInfoList: {
            url: '/lender/getInfoList'
            ,config: {
                method: 'get'
                ,params: {
                    start: 1
                    ,limit: 10
                }
            }
            ,name: '获取资方列表'
        }
    }
    // 资方列表
    ,async fetchLenderList(params) {
        let {data} = await request.get('/lender/getInfoList', params/*, '获取资方列表'*/)
        return data
    },
    // 资方详情
    async getLenderDetail(params) {
        let {data} = await request.get('/lender/detail/' + params)
        return data
    },
    // 资方开户
    async postLender(params) {
        let {data} = await request.post('/lender/add', params)
        return data
    },
    // 资方编辑
    async putLender(params) {
        let {data} = await request.post('/lender/update', params)
        return data
    }

    //查询未绑定的资方列表接口
    ,async getNoBindLenderList(params) {
        let {data} = await request.get('/sp/nobind/lenderList' , params)
        return data
    },
    //查询已绑定的资方列表接口
    async getHasBindLenderList(params) {
        let {data} = await request.get('/sp/hasbind/lenderList' , params)
        return data
    },
    //资方绑定资方
    async spBindLender(params) {
        let {data} = await request.post('/sp/submit/bind' , params)
        return data
    }
    // 查询绑定的资方
    ,searchLenderBindList(params){
        return request.get('/sp/hasbind/LenderList',{limit: 100000, ...params})
    }
}

