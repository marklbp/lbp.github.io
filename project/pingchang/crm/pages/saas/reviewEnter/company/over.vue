<script>
    import List from '../components/list/list.vue'
    export default {
        mixins: [List],
        layout: 'org_layouts',
        data(){
            return {
                titles:'综合查询',
                otherList:{
                    trackName:'公司审查',
                    trackUrl:'/saas/reviewEnter/company/'
                },
                table:{
                    url: '/lenderAgencyAudit/cgg/audited',
                    params:{
                        applyNumber: '',
                        name: '',
                        status: '',
                        listType:10,
                        agencyType:10
                    }
                },
                searchForm:{
                    /*labelType: {
                        key:'status',
                        name:'状态',
                        value:'',
                        formtype:'select',
                        selectOption:'reviewEnterOptionType'
                    }*/
                }
            }
        },
        methods:{
            detail(item) {
                let url = "/saas/reviewEnter/company/detail/"+item.id
                this.$router.push(url)
            }
        },
    }
</script>
