<script>
    import List from '@/pages/saas/reviewEnter/shop/processing.vue'
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
                    url: '/lenderAgencyAudit/ss/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        stype:40,
                    }
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/approvalEnter/shop/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
