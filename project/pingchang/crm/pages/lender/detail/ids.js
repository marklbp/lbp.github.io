import titleField from '~/components/common/title-field/title-field'
import {mapState} from 'vuex'
import utils from '@/utils/'
import api from '@/api'
import detailId from "@/components/common/lender2guarantor2sp/detailId"
import defaultOption from '~/config/options'

export default {
    validate({params, store}) {
        return true
        // return (!!params.article_id && !Object.is(Number(params.article_id), NaN))
    },
    fetch({store, params, error}) {
        // return store.dispatch('getLenderDetail', params).catch(err => {
        //   error({ statusCode: 404, message: '众里寻他 我已不再' })
        // })
    },
    data() {
        return {
            form: {},
            lenderList:[],
            detail: {
                code: "资方编码",
                name: "资方名称",
                shortName: "资方简称",
                type: "类型",
                cardType: "证件类型",
                cardNo: "证件号码",
                businessStartDate: "营业起始日",
                businessEndDate: "营业到期日",
                cooperativeStartDate: "合作开始日",
                cooperativeEndDate: "合作到期日",
                email: "电子邮件",
                regCapital: "资产资本（万美元）",
                legalPerson: "法人",
                province: "注册地址",
            }
        }
    },
    methods: {
        hasBindList(id) {
            api.getHasBindGuarantorList({id: id, limit: 2000}).then((res) => {
                if (res.data && res.data.list) {
                    this.lenderList = res.data.list
                }
            })
        },getOptionsTypeVal(val) {
            if (!val) return false;
            let result;
            let obj = defaultOption['ContactType']
            for (let i in obj) {
                if (obj[i].value == val) {
                    result = obj[i].name
                }
            }
            return result || '-'
        }
    },
    created() {
        this.page = this.$route.query.page
        detailId.call(this, 'getLenderDetail');
    },
    components: {
        titleField
    },
    layout: 'detail'
}