import SidebarConfig from '~/config/sidebar.config'
import utils from '~/utils/index'
import { mapMutations, mapState } from 'vuex'
import request from '@/plugins/axios'
import API from '../../../api'
import parseAddress from '@/plugins/parseAddress';

export default {
  props: {
    url: String,
    params: Object,
    transforms: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      sourceData: [],
      sourceTotal: 1,
      start: 1,
      limit:  10,
      loading: true,
      ownerId: this.$route.query.buttonId || this.$route.query.ownerId
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      let params = Object.assign({}, this.params, {start: this.start, limit: this.limit})

      for (let i in params) {
          if (!params[i]&&i!=='status') delete params[i]
      }
      if(this.$route.query.ownerId){
          if(this.url.indexOf('ext')!==-1){
              params.ownerId = this.$route.query.ownerId
          }
      }
      this.loading = true;
      let res;
      if(this.url.indexOf("/") > -1){
        res = await request.get(this.url, params).catch(err=>err).finally(err=>this.loading = false)
      }else{
        let arr = this.url.split(".");
        let mod = arr[0];
        let method = arr[1]
        res = await API[mod][method](params).catch(err=>err).finally(err=>this.loading = false)
      }

      let { data } = res;
      this.loading = false;

      let sourceData = [];
      if(data && data.data && data.data.list instanceof Array){
        data.data.list.forEach((item,i)=>{
          if(this.transforms instanceof Array){
            this.transforms.forEach(ts=>{
              /*
                names: [转换的字段, ....依赖的字段],
                transform: function转换函数, arguments: [names同上, data字段对象, customTransform传入的转换函数]
              */
              item[ts.names[0]] = ts.transform(ts.names, item, (names, data)=>{
                if(this[ts.fn])return this[ts.fn](names, data)
                return data[names[0]]
              })
            })
          }
          sourceData.push(item);
        })
      }
      this.sourceData = sourceData;
      this.sourceData.forEach((item)=>{
        if(item.address)item.address = parseAddress(item.province, item.city, item.area).join("") + item.address
        else item.address = '-'

        if(item.regCapital) item.regCapital = utils.regCapitalHandler(item.regCapital,item.regCapitalTypeName="(万)美金");
      })
      this.sourceTotal= data.data && data.data.totalCount || 0;
    },
    getCityNameById(names, data){
      let [cId, pId] = names;
      let [cIdVal, pIdVal] = [data[cId], data[pId]]
      return parseAddress(pIdVal, cIdVal)[1]
    },
    handleSizeChange: function(size) {
      this.limit = size;
      this.start = 1;
      this.getTableData();
    },
    handleIndexChange: function(index) {
      this.start = index;
      this.getTableData();
    },
    reset(){
      if(process.browser){
        window.location.reload();
      }
    }
  }
}
