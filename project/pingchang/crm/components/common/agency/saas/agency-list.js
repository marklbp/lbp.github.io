//saas 集团、经销商、公司、门店、展厅 准入申请列表 (saas/admission/_open)
// saas 开户申请列表(saas/account/list)
import elTablePage from '@/components/common/table-pagination/table-pagination'
import {mapState} from 'vuex';
import api from '@/api'
import parseAddress from '@/plugins/parseAddress';

export default {
    props: {
      list: {
        type: Object,
        default: ()=>({
          search: []
          ,params: {}
          ,table: {
            url: ''
            ,cols:[{
              prop: ""
              ,label: ""
            }]
            // 操作列表行为数组
            ,actions: null
            // 列表字段转换数组，例如: cityId=>cityName
            ,transforms: null
          }
        })
      }
    },
    components: {
        elTablePage
    },
    data() {
        return {
            params: {...this.list.params}
        }
    },
    computed: mapState({
        menuBtnsList: state => state.global.menuBtnsList
        ,agencyTypes: state => state.select.agencyTypes
    }),
    created() {
        this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId);
    },
    methods: {
        detail(item){
            let url = "/" + this.list.module + "/detail/" + (item[this.list.module == 'agency' ? 'id' : 'code'])
            this.$router.push(url)
        },
        modify(item){
            let url = "/" + this.list.module + "/update?code=" + item.code
            this.$router.push(url)
        },
        eventBus(event,item){
            if(this.list.table.actions && this.list.table.actions[event])return this.list.table.actions[event](item, this.agencyTypes)
            if(this[event])this[event](item)
        },
        parseAddress(p, c, a) {
            return parseAddress(p, c, a)
        },
        getTableData() {
            this.$refs.tablePagination.getTableData()
        },
      clearDataHandler() {
        let obj = {};
        if (this.$route.params.open) {
          switch (this.$route.params.open) {
            case "group":
              obj = {
                code: ''
                , name: ''
                , status: -1
              };
              break;
            case "company":
              obj = {
                code: ''
                , name: ''
              }
              break;
            case "agency":
              obj = {
                code: ''
                , name: ''
                , status: -1
                , parentName: ''
              }
              break;
            case "store":
              obj = {
                code: ''
                , name: ''
                , status: -1
                , parentName: ''
                , belongCity: ''
              }
              break;
            case "shop":
              obj = {
                code: ''
                , name: ''
              }
              break;
          }
        } else if (/account\/list/.test(this.$route.fullPath)) {
          obj = {
            code: ''
            , name: ''
            , agencyType: ''
          }
        }
        this.params = {
          ...this.params,
          ...obj
        }
      }
    }
}
