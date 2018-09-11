import {mapState} from 'vuex'
import titleField from '~/components/common/title-field/title-field'
import detailId from "@/components/common/lender2guarantor2sp/detailId"
import api from '@/api'
import defaultOption from '~/config/options'

export default {
    data() {
        return {
            form: {},
            lenderList: [],
            detail: {
                code: "SP编码",
                name: "SP名称",
                shortName: "SP简称",
                type: "类型",
                cardType: "证件类型",
                cardNo: "证件号码",
                businessStartDate: "营业起始日",
                businessEndDate: "营业到期日",
                cooperativeStartDate: "合作开始日",
                cooperativeEndDate: "合作到期日",
                email: "电子邮件",
                regCapital: "资产资本（万美元）",
                loanTypeName:'进件类型',
                legalPerson: "法人",
                province: "注册地址",
            }
        }
    },
    created() {
        this.page = this.$route.query.page;
        detailId.call(this, 'getSpDetail');
    },
    methods: {
        hasBindList(id) {
            api.getHasBindLenderList({id: id, limit: 2000}).then((res)=>{
                if(res.data&&res.data.list){
                    this.lenderList = res.data.list
                }
            })
        },
        getVal(type,val){
            if(!val)return false;
            let result;
            let obj = defaultOption[type]
            for(let i in obj){
                if(obj[i].value==val){
                    result = obj[i].name
                }
            }
            return result||'-'
        },
        getOptionsTypeVal(val){
            return this.getVal('ContactType',val)
        },
        getLoanVal(val){
            return this.getVal('Loan_Type',val)
        }
    },
    components: {
        titleField
    },

    layout: 'detail'
}