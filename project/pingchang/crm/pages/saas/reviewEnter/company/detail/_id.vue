<script>
    import detail from '../../components/detail/detail.vue'

    export default {
        mixins: [detail],
        layout: 'org_layouts',
        data() {
            return {
                tabOption: [
                    {
                        name: '0',
                        value: '公司审查',
                    },
                    {
                        name: '1',
                        value: '审查轨迹'
                    }
                ], infoDataCustom: [
                    {
                        type: 'info',
                        title: '公司信息',
                        listName: 'lenderAgency',
                        list: {
                            name: "公司名称",
                            lenderName: "所属资方",
                            cardTypeName: "证件类型",
                            cardNo: "证件号码",
                            businessStartDate: "营业起始日",
                            businessEndDate: "营业到期日",
                            cooperativeStartDate: "合作开始日",
                            cooperativeEndDate: "合作到期日",
                            regCapital: "注册资本",
                            email: "电子邮件",
                            nationality: "国别",
                            province: "注册地址"
                        }
                    },{
                        type: 'info',
                        title: '担保信息',
                        listName: 'bond',
                        list: {
                            applyMaxLimit: "申请最高担保额",
                            agreeLimit: "协议担保额度/保证金",
                            bondBegin: "担保起始日期",
                            bondEnd: "担保结束日期",
                            tempAgreeLimit: "临时担保额度",
                            tempLimitBegin: "临时额度开始日期",
                            tempLimitEnd: "临时额度结束日期",
                            bail: "是否需要公司保证金",
                            openBank: "开户行",
                            branchBank: "所属支行",
                            bailNo: "公司保证金账号",
                            accountName: "户名",
                            bailAmount: "保证金金额",
                            bondPercent: "担保占比(%)",
                            advancePay: "是否需要垫付"
                        }
                    }],
                netWork: {
                    api: 'postLenderAgencyAudit',
                    url: '/saas/reviewEnter/company/processing'
                }
            }
        },
        created(){
            let id = this.$route.params.id
            this.getLenderAgencyAudit(id)
        }
    }
</script>
