<script>
    import List from '@/pages/saas/reviewEnter/company/over.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'公司审批',
                    trackUrl:'/saas/approvalEnter/company/'
                },
                table:{
                    url: '/lenderAgencyAudit/cgg/audited',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        agencyType:10
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
                let url = "/saas/approvalEnter/company/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
