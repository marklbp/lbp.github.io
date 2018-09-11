<script>
    import List from '@/pages/saas/reviewEnter/group/processing.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'集团审批',
                    trackUrl:'/saas/approvalEnter/group/'
                },
                table:{
                    url: '/lenderAgencyAudit/cgg/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:20,
                        agencyType:20
                    }
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/approvalEnter/group/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
