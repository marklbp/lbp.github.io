<script>
    import List from '../components/list/list.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'展厅审查',
                    trackUrl:'/saas/reviewEnter/shop/'
                },
                table:{
                    url: '/lenderAgencyAudit/ss/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:10,
                        stype:40,
                    }
                },
                tableSource:{
                    "applyNumber":{
                        name:"申请编号",
                        custom:false
                    },
                    "createdAt":{name:'申请时间'},
                    "name":{name:'名称'},
                    "parentName":{name:'所属经销商'},
                    "cooperativeStartDate":{name:'合作开始日期'},
                    "cooperativeEndDate":{name:'合作结束日期'},
                    "regCapital":{name:'进件时长',custom:true},
                    "status":{name:'当前状态',custom:true},
                    "applier":{name:'轨迹'},
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/reviewEnter/shop/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
