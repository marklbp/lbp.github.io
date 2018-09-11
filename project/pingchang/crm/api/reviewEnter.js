import request from '@/plugins/axios'

export default {
    // lender: {
    //     getInfoList: {
    //         url: '/lender/getInfoList'
    //         ,config: {
    //             method: 'get'
    //             ,params: {
    //                 start: 1
    //                 ,limit: 10
    //             }
    //         }
    //         ,name: '获取资方列表'
    //     }
    // }
    // 审查详情
    async getLenderAgencyAudit(params) {
        let {data} = await request.get('/lenderAgencyAudit/cgg/' + params )
        return data
    },
    //展厅门店获取审查详情
    async getLenderAgencyAudit_ss(params) {
        let {data} = await request.get('/lenderAgencyAudit/ss/' + params )
        return data
    },

    //审查提交
    async postLenderAgencyAudit(params) {
        let {data} = await request.post('/lenderAgencyAudit/cgg/audit' ,params )
        return data
    },
    // 展厅、门店 审查提交
    async postLenderAgencyAudit_ss(params) {
        let {data} = await request.post('/lenderAgencyAudit/ss/audit' , params )
        return data
    },

    //轨迹详情
    async getTrackApproval(params){
        let {data} = await  request.get('/lenderAgencyAudit/trackApproval',params)
        return data
    }

}

