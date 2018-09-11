import List from '@/components/common/pub-list'
export default {
    data (){
        return {
            titles:'综合查询',
            otherList:{
                trackName:'集团审查',
                trackUrl:'/saas/reviewEnter/group/'
            },
            tableSource:{
                "applyNumber":{
                    name:"申请编号",
                    custom:false
                },
                "createdAt":{name:'申请时间'},
                "name":{name:'名称'},
                "cooperativeStartDate":{name:'合作开始日期'},
                "cooperativeEndDate":{name:'合作结束日期'},
                "regCapital":{name:'进件时长',custom:true},
                "status":{name:'当前状态',custom:true},
                "applier":{name:'轨迹',custom:true,value:'handleApplier'},
            },
            table:{
                url: '/lenderAgencyAudit/cgg/audited',
                params:{
                    applyNumber: '',
                    name: '',
                    status: '',
                    listType:10,
                    agencyType:20
                }
            },
            searchForm:{
                labelCode: {
                    name:'申请编号',
                    value:'',
                    key:'applyNumber'
                },
                labelName: {
                    key:'name',
                    name:'名称',
                    value:''
                },
                labelType: {
                    key:'status',
                    name:'状态',
                    value:'',
                    formtype:'select',
                    selectOption:'reviewEnterOptionType'
                }
            }
        }
    },
    methods:{
        detail(item) {
            // let url = "/reviewEnter/group/detail/"+item.id
            // this.$router.push(url)
            //console.log(1)
        }
    },
    components: {
        List
    }
}
