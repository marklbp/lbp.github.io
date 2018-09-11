<script>
    import List from '../components/list/list.vue'
    export default {
        mixins: [List],
        layout: 'org_layouts',
        data(){
            return {
                titles:'综合查询',
                table:{
                    url: '/lenderAgencyAudit/cgg/audited',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:10,
                        agencyType:20
                    }
                },
                searchForm:{
                    labelType: {
                        key:'status',
                        name:'状态',
                        value:'',
                        formtype:'select',
                        selectOption:'reviewEnterOptionType'
                    }
                }
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
