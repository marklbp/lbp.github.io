<script>
    import List from '../components/list/list.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                table:{
                    url: '/lenderAgencyAudit/cgg/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:10,
                        agencyType:20
                    }
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/reviewEnter/group/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
