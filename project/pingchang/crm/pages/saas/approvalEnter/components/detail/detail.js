// import {titleField, pubDetail, Track} from '~/components/common'
// import Detail from '../../components/detail'
import pubDetail from '@/components/common/pub-detail'
import Track from '@/components/common/track'
import titleField from '@/components/common/title-field/title-field'
import api from '@/api'

import {mapActions, mapState} from 'vuex'
import defaultOption from '~/config/options'
import './detail.scss'

export default {
    components: {
        titleField,
        pubDetail,
        Track
    },
    data() {
        let data = {
            blackList:[],
            currTab: "0",
            tabOption: [
                {
                    name: '0',
                    value: '集团审查',
                },
                {
                    name: '1',
                    value: '审查轨迹'
                }
            ],
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
                        email: "电子邮件",
                        nationality: "国别",
                        province: "注册地址"
                    }
                }],
            tableData: [
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
                    name: '审查情况',
                    list: [
                        {
                            name: 'remark',
                            value: '审查意见'
                        },
                        {
                            name: 'status',
                            value: '审查结果',
                            list: defaultOption.reviewEnterOptionType
                        }
                    ]
                }
            },
            form: {
                status: '',
                remark: '',
                listType: 10
            },
            netWork: {
                api: 'postLenderAgencyAudit',
                url: '/saas/reviewEnter/group/processing'
            }
        };
        return data;
    },
    created() {
        let currTab = this.$route.query.currTab;
        this.currTab = currTab || '0';
        this.getTrackApproval({applyNumber:this.applyNumber})
    },
    computed: {
        ...mapState({
            detailData: state => state.reviewEnter.pageData,
            lenderAgency: state => state.reviewEnter.lenderAgency,
            trackList: state => state.reviewEnter.track,
            applyNumber: state => state.reviewEnter.applyNumber,
        })
    },
    methods: {
        ...mapActions(['getLenderAgencyAudit', 'getTrackApproval', 'getLenderAgencyAudit_ss']),
        onSubmit() {
            //console.log(11111)
            /*if(!this.form.remark || !this.form.status){
                this.$message.warning("dddd")
            }*/
            this.form.applyNumber = this.applyNumber
            api[this.netWork.api](this.form).then((res) => {
                if (res && res.data && res.data.status == 200) {
                    this.$message({
                        message: '修改成功～',
                        type: 'success'
                    });
                    setTimeout(() => {
                        this.$router.push(this.netWork.url)
                    }, 1000)
                    return false;
                }
                this.$message({
                    message: res.data.msg,
                    type: 'error'
                });
            })
        }
    }
}
