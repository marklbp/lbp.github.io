import request from '@/plugins/axios'

export default {
	//查询未绑定的担保方列表接口
    async getNoBindGuarantorList(params) {
        let {data} = await request.get('/guarantor/nobind/list' , params)
        return data
    },
    //查询已绑定的担保方列表接口
    async getHasBindGuarantorList(params) {
        let {data} = await request.get('/guarantor/hasbind/list' , params)
        return data
    },
    //资方绑定担保方
    async lenderBindGuarantor(params) {
        let {data} = await request.post('/guarantor/submit/bind' , params)
        return data
    },
    //担保方列表
    async fetchGuarantorList(params) {
        let {data} = await request.get('/guarantor/getInfoList', params)
        return data
    },
    // 担保方详情
    async getGuarantorDetail(params) {
        let {data} = await request.get('/guarantor/detail/' + params)
        return data
    },
    //担保方开户
    async postGuarantor(params) {
        let {data} = await request.post('/guarantor/add', params)
        return data
    },
    //担保方修改
    async putGuarantor(params) {
        let {data} = await request.post('/guarantor/update', params)
        return data
    },
    
    guarantor: {
        getInfoList: {
            url: '/guarantor/getInfoList'
            ,config: {
                method: 'get'
                ,params: {
                    start: 1
                    ,limit: 10
                }
            }
            ,name: '获取担保方列表'
        }
    },
}