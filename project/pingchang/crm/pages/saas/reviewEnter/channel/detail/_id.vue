<script>
    import detail from '../../components/detail/detail.vue'

    export default {
        mixins: [detail],
        layout: 'org_layouts',
        data() {
            return {
                // blackList:[''],
                tabOption: [
                    {
                        name: '0',
                        value: '经销商审查',
                    },
                    {
                        name: '1',
                        value: '审查轨迹'
                    }
                ], infoDataCustom: [
                    {
                        type: 'info',
                        title: '经销商信息',
                        listName: 'lenderAgency',
                        list: {
                            name: "经销商名称",
                            groupName: "所属集团",
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
                    }],tableData: [
                    {
                        title: '联系人信息',
                        listName: 'contactsList',
                        type: 'table',
                        list: {
                            realName: {
                                name: "姓名",
                                custom: false
                            },
                            typeName: {name: '职位'},
                            mobile: {name: '手机号码'},
                            email: {name: '电子邮箱'},
                            remark: {name: '备注'},
                        },
                    },
                    {
                        title: '影像信息',
                        listName: 'fileList',
                        type: 'table',
                        list: {
                            typeName: {
                                name: "集团准入材料清单",
                                custom: false
                            },
                            setting: {
                                name: '操作',
                                list: [{
                                    id: 101,
                                    name: "查看",
                                    value: "detail",
                                    parentId: 20,
                                    icon: "",
                                    checked: false,
                                    target: "_parent"
                                }]
                            },
                        },
                    },
                    {
                        title: '账号信息',
                        listName: 'accountList',
                        type: 'table',
                        list: {
                            accountType: {
                                name: "账户类型",
                                custom: false
                            }, bankName: {
                                name: "开户银行",
                                custom: false
                            }, branchBank: {
                                name: "所属支行",
                                custom: false
                            }, accountName: {
                                name: "户名",
                                custom: false
                            }, accountCode: {
                                name: "开户账号",
                                custom: false
                            },
                        },
                    },
                ],
                netWork: {
                    api: 'postLenderAgencyAudit',
                    url: '/saas/reviewEnter/channel/over'
                }
            }
        },
        created(){
            let id = this.$route.params.id
            this.getLenderAgencyAudit(id)
        }
    }
</script>
