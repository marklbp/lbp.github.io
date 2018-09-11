import {mapState} from 'vuex'
import titleField from '@/components/common/title-field/title-field'
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
            detail: {
                code: "担保方编码",
                name: "担保方名称",
                shortName: "担保方简称",
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
    computed: mapState({
        // 映射 this.count 为 store.state.count
        // form: state => state.lender.lists
    }),
    created() {
        // console.log(params)
        // console.log(this.$route.query.code)
        // console.log(params)
        // this.$store.dispatch('getLenderDetail', this.$route.params.id)
        this.page = this.$route.query.page
        detailId.call(this, "getGuarantorDetail")
    },
    methods: {
        getOptionsTypeVal(val) {
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
    components: {
        titleField
    },
    layout: 'detail'
}