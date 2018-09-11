import elTablePage from '@/components/common/table-pagination/table-pagination'
import {mapState} from 'vuex';
import api from '@/api'
import setAdmin from '~/components/common/set-user/set-user'
import parseAddress from '@/plugins/parseAddress';

export default {
    props: {
      table: {
        type: Object,
        default: {
          url: '',
          code: '',
          name: '',
          bindText: '',
          module: '',
          params: {}
        }
      },
      titleFormat: Array,
      searchForm: {
        type: Object,
        default: ()=>({
          name: '',
          code: '',
          type: '',
          labelName: '名称',
          labelCode: '编码',
          labelType: '类型',
          placeholderName: '名称',
          placeholderCode: '编码',
          placeholderType: '类型',
          showType: false,
          //10：公司，20：集团，30：经销商，40=展厅，50=门店
          select:[]
        })
      }
    },
    components: {
        elTablePage,
        setAdmin
    },
    data() {
        return {
            params: {name: '', code: '', ...this.table.params},
            searchname: '',
            parentId: '',
            parentName: '',
            bindwayData: {
                key: 'id',
                label: 'name'
            },
            ownerId:'',
            postData: [],
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1;
            },
            organizationId: '',
            newUserAdmin: {
                userName: '',
                realName: '',
                idNumber: '',
                sex: ''
            },
            oldUserAdmin: {
                userName: '',
                realName: '',
            },
            lists: [],
            bindVal: [],
        }
    },
    computed: mapState({
        menuBtnsList: state => state.global.menuBtnsList
        ,agencyTypes: state => state.select.agencyTypes
    }),
    created() {
        this.$store.dispatch('getMenuButtonList', this.$route.query&&this.$route.query.buttonId);
    },
    filters: {
      transformType: (number, typeObj)=>{
        let name = number;
        let t;
        if(typeObj){
          t = typeObj.find(t=>t.value == number);
          if(t && t.name)name = t.name;
        }
        return name
      }
    },
    methods: {
        detail(item){
            let url = "/" + this.table.module + "/detail/" + (item[this.table.module == 'agency' ? 'id' : 'code'])
            this.$router.push(url)
        },
        modify(item){
            let url = "/" + this.table.module + "/update/" + item.code
            this.$router.push(url)
        },
        build(item){
            this.parentId = item.id
            this.parentName = item.name
            this.getData()
            this.showModal()
        },
        modify_sys(item){
            this.ownerId = item.id
            this.oldUserAdmin.name = item.name
            this._setAdmin()
        },
        eventBus(event,item){
            this[event](item)
        },
        parseAddress(p, c, a) {
            return parseAddress(p, c, a)
        },
        lookDetail(row, action) {
            let url;
            if (action == 'look') {
                url = "/" + this.table.module + "/detail/" + row.code
                this.$router.push(url)
            } else if (action == 'update') {
                url = "/" + this.table.module + "/update?code=" + row.code
                this.$router.push(url)
            } else if (action == 'set') {
                this.ownerId = row.id
                this.oldUserAdmin.name = row.name
                this._setAdmin()
            } else {
                this.parentId = row.id
                this.parentName = row.name
                this.getData()
                this.showModal()
            }
        },
        getData() {
            let params = {id: this.parentId, limit: 2000}
            if(this.table.module == 'lender'){
              api.getNoBindGuarantorList(params).then((res) => {
                  if (res.data && res.data.list) {
                      api.getHasBindGuarantorList(params).then((ress) => {
                          if (ress.data && ress.data.list) {
                              let data = ress.data.list;
                              let array = data.map((item) => {
                                  return item.id
                              });
                              this.bindVal = array
                              let result = [...res.data.list, ...data]
                              this.lists = result
                          }
                      });
                  }
              })
            }else if(this.table.module == 'sp'){
              api.getNoBindLenderList(params).then((res) => {
                  if (res.data && res.data.list) {
                      api.getHasBindLenderList(params).then((ress) => {
                          if (ress.data && ress.data.list) {
                              let data = ress.data.list;
                              let array = data.map((item) => {
                                  return item.id
                              });
                              this.bindVal = array
                              let result = [...res.data.list, ...data]
                              this.lists = result
                          }
                      });
                  }
              })
            }else{

            }
        },
        showModal() {
            this.$modal.show('bind-way');
        },
        bindDataChange(value, direction, movedKeys) {
            // this.$store.commit('BIND_GUARANTOR_LIST', value)
        },
        searchName() {
            //console.log('瞅啥')
        },
        qr() {
            // 绑定担保方提交操作
            var arr = [],
                result = [],
                _this = this;
            _this.bindVal.map(function (i, e) {
                for (let key in _this.lists) {
                    let item = _this.lists[key]
                    if (item.id === i) {
                        arr.push(item)
                    }
                }
            })
            arr.map(function (item) {
                result.push({
                    parentId: _this.parentId,
                    parentName: _this.parentName,
                    childId: item.id,
                    childName: item.name,
                    childType: 'Lender'
                })
            })

            if(this.table.module == "lender"){
              api.lenderBindGuarantor({lenderId: this.parentId, guarantorIds: this.bindVal}).then((res) => {
                  if (res.code == 200) {
                      this.hideModal()
                      this.$message({
                          message: '添加绑定成功成功',
                          type: 'success'
                      });
                  }
              })
            }else if(this.table.module == "sp"){
              api.spBindLender({spId: this.parentId, lenderIds: this.bindVal}).then((res) => {
                  if (res.code == 200) {
                      this.hideModal()
                      this.$message({
                          message: '添加绑定成功成功',
                          type: 'success'
                      });
                  }
              })
            }else{


            }
        },
        hideModal() {
            this.$modal.hide('bind-way');
            this.bindVal = []
            this.lists = []
        },
        _getQuery(data, key, val) {
            let res = data.key.indexOf(val) > -1;
            return res
        },
        hideAdminModal() {
            this.$modal.hide('adminModal');
            this.resetNewUserAdmin()
        },
        resetNewUserAdmin() {
            this.newUserAdmin = {
                userName: '',
                realName: '',
                idNumber: '',
                sex: ''
            }
        },
        _setAdmin() {
            api.getAdminByOrgId(this.ownerId).then((res) => {
                if (res.code === 200) {
                    let result = res.data
                    for (let i in result) {
                        this.oldUserAdmin[i] = result[i]
                    }
                    // this.oldUserAdmin.name = result.name
                    this.$modal.show('adminModal')
                }
            })
        },
        setOver() {
            let flag;
            if (this.newUserAdmin.idNumber) flag = true;
            if(!flag)return this.$message({
                message: '请填写正确的管理员变更信息',
                type: 'warning'
            })

            let parames = {
                oldUserName: this.oldUserAdmin.userName,
                newUserName: this.newUserAdmin.userName,
                ownerId: this.ownerId
            }

            api.modifyAdmin(parames).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.$modal.hide('adminModal');
                    this.resetNewUserAdmin()
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    });
                }

            })
        },
        getTableData() {
            console.log(this.params)
            this.$refs.tablePagination.getTableData()
        }
    }
}