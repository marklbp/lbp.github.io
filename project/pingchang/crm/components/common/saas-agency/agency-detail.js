//saas 集团、经销商、公司、门店、展厅 准入列表的详情 (saas/admission/detail/_id)
//saas 开户列表的查看详情 (sass/account/detail/_id)
import titleField from '~/components/common/title-field/title-field'
import API from '@/api'
import parseAddress from '@/plugins/parseAddress';
import defaultOption from '~/config/options'
import utils from '@/utils/';

export default {
  props: {
    detail: {
      type: Array,
      default: () => []
    }
    , apis: {
      type: Array
      , default: () => []
    }
  },
  data() {
    let form = {};
    this.detail.forEach(m => {
      let v;
      switch (m.data.type) {
        case "object":
          v = {}
          break;
        case "array":
          v = [];
          break;
        default:
          v = {}
          break;
      }
      form[m.module] = v;
      form[m.data.name] = {
        mod: m.module
        , fns: m.data.fns
        , fnArgs: m.data.fnArgs
      }
    })
    return {form}
  },
  created() {
    this.apis.forEach(a => {
      let [mod, api] = a.url.split(".");
      if (!API[mod][api]) return;
      API[mod][api](a.params).then(res => {
        if (res.error) return;
        if ('object' == typeof res.success && res.success) {
          let data = res.success;

          if(/shop|store/.test(this.$route.query.agencyType)){
            let storeDetailCopy=JSON.stringify(data.storeDetail);
            storeDetailCopy = JSON.parse(storeDetailCopy);
            data.storeDetail2 = storeDetailCopy;
          }

          Object.keys(data).forEach(k => {
            let parser = this.form[k]
            if (parser) {
              if (parser.fns) parser.fns.forEach((fn, i) => {
                let fnArg = parser.fnArgs[i]
                let args = fnArg.map(a => data[k][a]);
                if ('function' == typeof this[fn]) {
                  (data[k][fnArg[0]]!==undefined)&&(data[k][fnArg[0]] = this[fn].apply(this, args));
                }
              })
              this.form[parser.mod] = data[k]
            }
          })
        }
      }).catch(err => err)
    })
  },
  methods: {
    parseAddress(add, p, c, a) {
      try {
        return parseAddress(p, c, a) + (add || '');
      } catch (e) {
        return '无效的省市区' + ' ' + (add || '');
      }
    }
    , guarantorDataHandler(param) {
      return param === 0 || !param ? "否" : "是";
    }
    ,regCapitalHandler(regCapital,regCapitalTypeName){
      return utils.regCapitalHandler(regCapital,regCapitalTypeName);
    }
    ,bondPercentHandler(param){
      return param?param+'%':param;
    }
    ,openFileDeltail(url){
      window.open(url);
    }
  },
  components: {
    titleField
  },
  layout: 'detail'
}
