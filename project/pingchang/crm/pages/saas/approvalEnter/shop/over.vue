<script>
    import List from '@/pages/saas/reviewEnter/shop/over.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'展厅审批',
                    trackUrl:'/saas/approvalEnter/shop/'
                },
                table:{
                    url: '/lenderAgencyAudit/ss/audited',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        stype:40,
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
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/approvalEnter/shop/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
