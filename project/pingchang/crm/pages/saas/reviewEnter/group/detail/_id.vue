<script>
    import detail from '../../components/detail/detail.vue'

    export default {
        mixins: [detail],
        layout: 'org_layouts',
        data() {
            return {
                // blackList:['bond'],
                infoDataCustom: [
                    {
                        type: 'info',
                        title: '集团信息',
                        listName: 'lenderAgency',
                        list: {
                            name: "集团名称",
                            cardTypeName: "证件类型",
                            cardNo: "证件号码",
                            businessStartDate: "营业起始日",
                            businessEndDate: "营业到期日",
                            cooperativeStartDate: "合作开始日",
                            cooperativeEndDate: "合作到期日",
                            regCapital: "注册资本",
                            taxPayerTypeName: "纳税人类型",
                            taxPayerCode: "纳税人识别号",
                            email: "电子邮件",
                            nationality: "国别",
                            province: "注册地址"
                        }
                    }
                ]
            }
        },
        created() {
            let id = this.$route.params.id
            this.getLenderAgencyAudit(id)
        }
    }
</script>
