<script>
    import api from '@/api'
    import detail from '../../components/detail/detail.vue'
    import {mapActions, mapState} from 'vuex'
    export default {
        mixins: [detail],
        layout: 'org_layouts',
        data() {
            return {
                tabOption: [
                    {
                        name: '0',
                        value: '展厅审查',
                    },
                    {
                        name: '1',
                        value: '审查轨迹'
                    }
                ],
                form: {
                    status: '',
                    remark: '',
                    listType:10
                },
                netWork: {
                    api: 'postLenderAgencyAudit_ss',
                    url: '/saas/reviewEnter/shop/processing'
                },
                infoDataCustom: [
                    {
                        type: 'info',
                        title: '展厅信息',
                        listName: 'lenderStore',
                        list: {
                            name: "展厅名称",
                            agencyName: '所属经销商',
                            belongGroup: '所属集团',
                            lenderName: '所属资方',
                            storeArea: '展厅面积(平米)',
                            belongCity: '所属城市',
                            belongCarFactory: '所属车厂',
                            hierarchy: '展厅层级',
                            bussTypeName: '业务类型',
                            representUserName: '融资代表',
                            //cardTypeName: '证件类型',
                            //cardNo: '证件号码',
                            //cardTypeName: "证件类型",
                            //cardNo: "证件号码",
                            //businessStartDate: "营业起始日",
                            //businessEndDate: "营业到期日",
                            //cooperativeStartDate: "合作开始日",
                            //cooperativeEndDate: "合作到期日",
                            //regCapital: "注册资本",
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
                            bondPercent: "担保占比(%)"/*,
                            advancePay: "是否需要垫付"*/
                        }
                    }],
            }
        },
        created() {
            let id = this.$route.params.id;
            this.getLenderAgencyAudit_ss(id)
        },
    }
</script>
