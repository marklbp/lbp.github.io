<script>
    import List from '@/pages/saas/reviewEnter/channel/over.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'经销商审批',
                    trackUrl:'/saas/approvalEnter/channel/'
                },
                table:{
                    url: '/lenderAgencyAudit/cgg/audited',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        agencyType:30
                    }
                },
                searchForm:{
                    labelType: {
                        key:'status',
                        name:'状态',
                        value:'',
                        formtype:'select',
                        selectOption:'approvalOptionType'
                    }
                }
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/approvalEnter/channel/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
