<script>
    import List from '@/pages/saas/reviewEnter/channel/processing.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'门店审批',
                    trackUrl:'/saas/approvalEnter/store/'
                },
                table:{
                    url: '/lenderAgencyAudit/ss/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        stype:50
                    }
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/approvalEnter/store/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
