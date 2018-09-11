<script>
    import List from '@/pages/saas/reviewEnter/store/over.vue'

    export default {
        mixins: [List],
        data() {
            return {
                titles: '综合查询',
                otherList:{
                    trackName:'门店审批',
                    trackUrl:'/saas/approvalEnter/store/'
                },
                table: {
                    url: '/lenderAgencyAudit/ss/audited',
                    params: {
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType: 20,
                        stype: 50,
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
        methods: {
            detail(item) {
                let url = "/saas/approvalEnter/store/detail/" + item.id
                this.$router.push(url)
            }
        },
    }
</script>
