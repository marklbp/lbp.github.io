<script>
    import detail from '@/pages/saas/reviewEnter/shop/detail/_id.vue'
    import defaultOption from '~/config/options'
    export default {
        mixins: [detail],
        data() {
            return {
                pageStatus:20,
                tabOption: [
                    {
                        name: '0',
                        value: '展厅审批',
                    },
                    {
                        name: '1',
                        value: '审批轨迹'
                    }
                ],
                form: {
                    status: '',
                    remark: '',
                    listType:20
                },
                netWork: {
                    api: 'postLenderAgencyAudit_ss',
                    url: '/saas/approvalEnter/shop/over'
                },
                checkRight: {
                    info: {
                        name: '',
                        list: [
                            {
                                name: 'applyNumber',
                                value: '申请编号'
                            },
                            {
                                name: 'createdAt',
                                value: '申请时间'
                            }
                        ]
                    },
                    form: {
                        name: '审批情况',
                        list: [
                            {
                                name: 'remark',
                                value: '审批意见'
                            },
                            {
                                name: 'status',
                                value: '审批结果',
                                list: defaultOption.approvalOptionType
                            }
                        ]
                    }
                },
            }
        },
        created() {
            //let id = this.$route.params.id;
            //this.getLenderAgencyAudit_ss(id)
        },
    }
</script>
