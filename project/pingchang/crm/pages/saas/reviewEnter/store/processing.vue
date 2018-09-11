<script>
    import List from '../components/list/list.vue'
    export default {
        mixins: [List],
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'门店审查',
                    trackUrl:'/saas/reviewEnter/store/'
                },
                table:{
                    url: '/lenderAgencyAudit/ss/audit',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:10,
                        stype:50
                    }
                },
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/reviewEnter/store/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
