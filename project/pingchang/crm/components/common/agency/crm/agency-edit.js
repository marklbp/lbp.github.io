//crm 展厅、门店准入申请 (pages/agency/admission/add)
//crm 集团、经销商、公司的准入申请 (pages/agency/admission/ssedit)
//crm 展厅、门店的编辑 (pages/agency/admission/ssedit)
//crm 集团、公司、经销商 申请记录->编辑 (pages/agency/admission/edit)
import titleField from '~/components/common/title-field/title-field'
import vDistpicker from '~/components/common/v-distpicker/v-distpicker'
import API from '@/api'
import dictionary from './dictionary';
import {Validator} from 'vee-validate';
import parseAddress from '@/plugins/parseAddress';
import Upload from '~/components/common/upload/upload';

export default {
  components: {
    titleField
    , Upload
    , vDistpicker
  },
  props: {
    edit: {
      type: Object,
      default: () => ({
        // 定制显示指定的form
        showGuarantorForm: true
        , showAccountForm: true
        // form渲染的指定input集合
        , baseForm: {title: '', table: [], apis: [], fields: []}
        , accountForm: {title: '', name: '', model: '', table: [], apis: [], fields: []}
        , guarantorForm: {title: '担保信息', table: [], apis: [], fields: []}
        , attachForm: {
          title: '附件信息' /*表单标题*/
          , table: [/*表单域集合*/]
          , apis: [/*表单预加载接口集合*/]
          , submit: {/*action: 表单提交接口api, preParams: {} // 表单提交数据子集*/}
        }
        , steps: [/*'baseForm', 'guarantorForm', 'accountForm', 'attachForm'*/]
        , dictionary: {}
      })
    }
  },
  data() {
    let currentForm = this.edit.steps[0] || 'baseForm';
    // 当存在itemId表示从列表编辑按钮点击进入
    let isEdit = this.$route.query.itemId;
    let data = {
      isClickFlag:false,
      isChange:true
      , currentFormIndex: 0
      , currentForm: currentForm
      , currentFormStatus: false //false add  true edit
      , form: {
        preData: {
          //预加载的表单数据
          baseForm: {
            lenderId: isEdit ? '' : []
            , parentName: ""
            , contactsList: []
            , parentId: isEdit ? '' : []
            , belongCarFactory: []
            , hierarchy: []
            , bussType: []
            , representUserId: isEdit ? '' : []
            , pca: '' //省市区
          }
          , outerForm: []
          , accountForm: []
          , contactForm: {
            contactTypes: []
          }
          , attachForm: {
            files: []
          }
          , dialogAccountForm: {}
          ,guarantorForm:{}
        }
        //实际提交的表单数据
        , baseForm: {...this.arr2map(this.edit.baseForm.fields)}
        , guarantorForm: this.edit.showGuarantorForm && {...this.arr2map(this.edit.guarantorForm.fields)}
        , accountForm: this.edit.showAccountForm && {...this.arr2map(this.edit.accountForm.fields)}
        , outerForm: this.edit.showOuterForm && {...this.arr2map(this.edit.outerForm.fields)}
        , attachForm: {...this.arr2map(this.edit.attachForm.fields),formList:[]}
        , contactForm: {
          contactsList: []
        }
        , admissionBaseId: this.$route.query.admissionBaseId
      }
      , dialogAccountForm: {
        visible: false
        , inputs: [{
          type: this.dialogType('accountType').type
          //,options: []
          , label: '账户类型'
          , placeholder: '账户类型'
          , model: 'accountType',
          attach: ['bankName']
        }, {
          type: this.dialogType('bankName').type
          , label: '开户银行'
          , model: 'bankName'
          , placeholder: '开户银行'
          ,attach:['accountType']
        }, {
          type: 'text'
          , label: '所属支行'
          , placeholder: '所属支行'
          , model: 'branchBank'
          ,disabled: this.dialogType().disabled
        }, {
          type: 'text'
          , label: '户名'
          , placeholder: '户名'
          , model: 'accountName'
          ,disabled: this.dialogType().disabled
        }, {
          type: 'text'
          , label: '开户账号'
          , placeholder: '开户账号'
          , model: 'accountCode'
          ,disabled: this.dialogType().disabled
        }]
        , form: {
          accountType: "",
          bankName: "",
          branchBank: "",
          accountName: "",
          accountCode: ""
        }
      }
    }
    return data
  },
  created() {
    this.edit.dictionary.zh_CN.messages = Object.assign(dictionary.messages, this.edit.dictionary.zh_CN.messages);
    this.edit.dictionary.zh_CN.attributes = Object.assign(dictionary.attributes, this.edit.dictionary.zh_CN.attributes);
    Validator.localize(this.edit.dictionary);
    this.initForm();
  },
  methods: {
    arr2map(arr) {
      let map = {};
      if (!arr) return map;
      arr.forEach(a => {
        map[a] = ''
      })
      return map
    },
    pow(x) {
      return Math.pow(2, x)
    },
    initForm() {

      if (this.edit[this.currentForm].apis) this.edit[this.currentForm].apis.forEach(a => {
        let [mod, api] = a.url.split(".");
        if (!API[mod][api]) return;
        if (/store|shop/.test(this.$route.query.agencyType) && this.currentForm == 'accountForm') {
          a.params.type==='ccg'|| a.params.type==='cc'?a.params.id = this.form.baseForm.parentId:null;
        } else if (this.$route.query.admissionBaseId) {
          a.params.id = this.$route.query.admissionBaseId;
        }
        this.currentFormStatus =false;
        API[mod][api](a.params).then(res => {
          if(this.currentForm!=='baseForm'){
            if(res.success===""||res.success===undefined||res.success.id===undefined){
              this.currentFormStatus =false;
              this.form[this.currentForm]._addId = this.form[this.currentForm].id||-1;
            }else{
              this.currentFormStatus =true;
              this.form[this.currentForm]._editId = res.success.id;
            }
          }else if(this.currentForm==='baseForm'&&(this.$route.query.agencyType=='store'||this.$route.query.agencyType=='shop')){
            if(res.success.storeDetail){
              this.currentFormStatus =true;
              this.form[this.currentForm]._editId = res.success.storeDetail.id;
            }else{
              this.currentFormStatus =false;
              this.form[this.currentForm]._addId = this.form[this.currentForm].id||-1;
            }
          }

          if (!res || res.error || !res.success || 'object' != typeof res.success) return;
          let data = res.success;
          this.form.preData[a.form] = (() => {
            if (a.fns) {
              a.fns.forEach((fn, i) => {
                if (this[fn]) {
                  let fnArg = a.fnArgs[i]
                  let args = fnArg.map(s => data[a.name][s]);
                  data[a.name][fnArg[0]] = this[fn].apply(this, args)
                }
              })
            }
            return 'function' == typeof a.transform && a.transform(data, this.form) || data;
          })();
        }).catch(err => err)
      })

      //门店与展厅的账号信息页面需多调一个查询账户信息接口
      if(this.currentForm==='accountForm'&&(this.$route.query.agencyType=='store'||this.$route.query.agencyType=='shop')){
        let acountInfoApi = this.edit[this.currentForm].acountInfoApi;
        let [mod, api] = acountInfoApi.url.split(".");
        acountInfoApi.params.id = this.$route.query.admissionBaseId;
        API[mod][api](acountInfoApi.params).then(res => {
          if( 'function' == typeof acountInfoApi.transform) acountInfoApi.transform(res.success, this.form);
        })
      }
    },
    parseAddress(add, p, c, a) {
      try {
        return parseAddress(p, c, a) + (add || '');
      } catch (e) {
        return '无效的省市区' + ' ' + (add || '');
      }
    }
    , onSave(strType) {

      if(strType==='next'&&!this.isChange){//点击下一步 如果已经保存过则直接初始化下一个表单
        this.currentForm = this.edit.steps[++this.currentFormIndex];
        this.isChange = true;
        this.initForm();
        return;
      }
      if(strType!=='next'&&!this.isChange){//点击保存 如果数据没有改变则不掉接口
        return;
      }
      // 保存过无需保存
      if(this.currentForm==='accountForm'){
        //账户信息提交接口需提交所有的账户信息数组
        if(this.$route.query.agencyType==='shop'||this.$route.query.agencyType==='store'){
          if(!this.form[this.currentForm].accountInfoFormList&&
            !this.form.preData.accountForm[0]){
            this.$message({type: 'warning', message: '请添加账户信息'});
            return;
          }else{
            this.form[this.currentForm].accountInfoFormList = this.form.preData.accountForm;
          }
        }else{
          if(!this.form[this.currentForm].accountInfoFormList[0]&&
            !this.form.preData.accountForm[0]){
            this.$message({type: 'warning', message: '请添加账户信息'});
            return;
          }else{
            this.form[this.currentForm].accountInfoFormList = this.form.preData.accountForm;
          }
        }

      }

      if(this.currentForm==='contactForm'){
        if(!this.form[this.currentForm].contactsList[0]){
          this.$message({type: 'warning', message: '请添加联系人信息'});
          return;
        }
      }

      // if (this.saved) return;
      let params = {...this.form[this.currentForm]};
      if (this.edit[this.currentForm].transform) this.edit[this.currentForm].transform(params);

      // 校验当前显示的form，通过后提交数据
      this.$validator.validateAll(params).then(ok => {
        if (!ok || (this.errors && this.errors.items && this.errors.items.length > 0)) return;

        if(this.isClickFlag) return;
        this.isClickFlag = true;

        let form = this.edit[this.currentForm];
        // props中传入的表单不存在
        if (!form || !form.submit) return;
        let submit = form.submit;
        let formAction = submit.action;
        // 传入的表单没有提供action字段
        if (!formAction) return;
        let [mod, method] = formAction.split(".");
        // 没有在api对应的模块下定义action指代的接口
        if (!API[mod] || !API[mod][method]) return;
        let _params = submit.preParams;
        Object.keys(_params).forEach(p => {
          params[p] = params[p] || _params[p]
        })

        if (params.id == -1 || this.$route.query.admissionBaseId) params.id = this.$route.query.admissionBaseId || params.id;

        API[mod][method](params).then(res => {
          this.isClickFlag = false;
          // this.saved = !res.error;
          if(this.currentForm==='attachForm'){
            this.form.preData.attachForm.saveFilesLen =this.form.attachForm.formList.length;
          }
          this.isChange = false;//点击保存 调用保存接口成功后 isChange改为false 防止连续调用保存接口
          if (!res.error) this.$message({type: 'success', message: res.msg});
          if (this.currentForm == 'baseForm') {
            this.addBaseId2Query(res.success)
          }else{
            if(res.success!==''){
              this.currentFormStatus=true;
              this.form[this.currentForm]._editId = res.success;
              this.form[this.currentForm]._addId?delete this.form[this.currentForm]._addId:null;
            }
          }

          if(strType==='next'){//如果是点击下一步 调用保存接口成功后 初始化下一个表单 isChange初始化为true
            this.currentForm = this.edit.steps[++this.currentFormIndex];
            this.isChange = true;
            setTimeout(this.initForm.bind(this),0);
          }

          return res;
        }).catch(err => {
          this.isChange = true;
          this.isClickFlag = false;
          return err
        })
      })
    }
    , removeError(name) {
      //this.errors.remove(name);
    }
    , onPrev() {
      // 提示要保存
      // if (!this.saved) return this.$message({type: 'warning', message: '请确认保存后回退上一步'})
      // // 跳到下一步后，当前表单对象未保存
      // this.saved = !this.saved;
      // 保存过，可回退到上一步
      this.currentForm = this.edit.steps[--this.currentFormIndex];
      this.initForm()
    }
    , onNext() {
      // 提示要保存
      // if (!this.saved) return this.$message({type: 'warning', message: '请确认保存后继续下一步'})
      // // 跳到下一步后，当前表单对象未保存
      // this.saved = !this.saved;
      // // 保存过，可回前进到下一步
      // this.currentForm = this.edit.steps[++this.currentFormIndex];
      // 回退或前进都需要再次调接口渲染form
      this.onSave('next');
      // this.initForm();
    }
    ,
    beforeClose(){
      this.errors.clear();
      this.dialogAccountForm.visible=false;
    }
    , saveAddAccount() {
      // 账号新增
      this.$validator.validateAll().then(ok => {

        if (!ok) return;
        let obj = {};
        if(/store|shop/.test(this.$route.query.agencyType)){
          this.dialogAccountForm.form.bankName =this.form.preData.dialogAccountForm['bankName'][this.dialogAccountForm.form.bankName].name;
          this.dialogAccountForm.form.accountType =this.form.preData.dialogAccountForm['accountType'][this.dialogAccountForm.form.accountType].name;
        }
        if(/agency|company/.test(this.$route.query.agencyType)){
          this.form.preData.dialogAccountForm['accountType'].map((item,index)=>{
            if(this.dialogAccountForm.form.accountType===item.value){
              this.dialogAccountForm.form.accountType = item.name;
            }
          })
        }
        Object.keys(this.dialogAccountForm.form).forEach(k => {
          obj[k] = this.dialogAccountForm.form[k];
          this.dialogAccountForm.form[k] = ''
        })
        //账号信息提交页面新增账户的保存的时候门店主题与另外三种不一样的处理方式
        if(/agency|group|company/.test(this.$route.query.agencyType)){
          this.form.preData.accountForm.push(obj);
          if (!this.form.accountForm.accountInfoFormList) this.form.accountForm.accountInfoFormList = []
          this.form.accountForm.accountInfoFormList.push(obj);
        }else{
          this.form.accountForm.accountInfoFormList =[obj];
          this.form.preData.accountForm=[obj];
          if (!this.form.accountForm.accountInfoFormList) this.form.accountForm.accountInfoFormList = []
          this.form.accountForm.accountInfoFormList.push(obj);
        }

        this.dialogAccountForm.visible = !this.dialogAccountForm.visible;
      })
    }
    , uploadSuccess(res, file, fileList, vmUpload) {
      if ('object' != typeof this.form.attachForm.formList && !this.form.attachForm.formList.length) {
        this.form.attachForm.formList = []
      }
      this.form.attachForm.formList.push({
        type: vmUpload.uploadCfg.index,
        fileId: vmUpload.fileIds[vmUpload.fileIds.length-1]
      })
    }
    ,uploadRemove(file){
      // if(!file.response){
      //   return;
      // }
      this.form.attachForm.formList && (this.form.attachForm.formList = this.form.attachForm.formList.filter((item,index)=>{
        return (file.id||file.response.data.id) === item.fileId ?  false:true;
      }))
    }
    , addBaseId2Query(id) {
      if ((!this.admissionBaseId || !this.$route.query.admissionBaseId) && id) {
        this.admissionBaseId = id;
        let path = this.$route.fullPath.replace(/admissionBaseId=(\w+)/, 'admissionBaseId=' + id);
        path = path.indexOf('admissionBaseId') > -1 ? path : (path + '&admissionBaseId=' + id)
        this.$router.replace(path);
      }
    }
    // 地址联动
    , addressSelect(data) {
      let {province, city, area} = data;
      let baseForm = this.form.baseForm;
      baseForm.provinceId = province.code;
      baseForm.cityId = city.code;
      baseForm.areaId = area.code;
    }
    // 附属联动
    , attachSelect(value, name, attach) {
      if(!value){
        let baseForm = this.form.baseForm;
        switch(name){
          case 'parentId':
            baseForm.groupName ='';
            baseForm.lenderId ='';
            baseForm.representUserId ='';
            this.form.preData.baseForm.lenderId=[];
            this.form.preData.baseForm.representUserId=[];
            break;
          case 'lenderId':
            baseForm.representUserId ='';
            this.form.preData.baseForm.representUserId=[];
            break;
        }
        return;
      }
      if(/lenderId/.test(name)) this.lenderIdChange();
      if (!attach) return;
      //console.log(value, this.form.baseForm[name], attach, arguments)
      attach.forEach(a => {
        let method = 'get' + a[0].toUpperCase() + a.slice(1);
        if (!this[method]) return;
        this[method](value);
      })
    }
    // 账号附属联动
    , acountAttachSelect(value, attach) {
      //经销商、公司、集团不需要联动
      if(/agency|group|company/.test(this.$route.query.agencyType)){
        return;
      }else {
        if (!attach) return;
        if(attach[0]==='accountType'){
          this.dialogAccountForm.form.bankName = value;
          this.dialogAccountForm.form.accountType = value;
          this.dialogAccountForm.form.branchBank = this.form.preData.dialogAccountForm['accountType'][value].branchBank;
          this.dialogAccountForm.form.accountName = this.form.preData.dialogAccountForm['accountType'][value].accountName;
          this.dialogAccountForm.form.accountCode = this.form.preData.dialogAccountForm['accountType'][value].accountCode;
        }else if(attach[0]==='bankName'){
          this.dialogAccountForm.form.bankName = value;
          this.dialogAccountForm.form.accountType = value;
          this.dialogAccountForm.form.branchBank = this.form.preData.dialogAccountForm['accountType'][value].branchBank;
          this.dialogAccountForm.form.accountName = this.form.preData.dialogAccountForm['accountType'][value].accountName;
          this.dialogAccountForm.form.accountCode = this.form.preData.dialogAccountForm['accountType'][value].accountCode;
        }
      }
    }
    // 获取所属集团
    , getGroupName(agencyId) {
      let api = API.agency.getGroupNameByAgencyId
      if (!api) return;
      api({agencyId})
        .then(res => {
          if (res.error || (!res.success&&res.success!=='')) return;
          this.form.baseForm.groupName = res.success?res.success.ccgName:'';
        })
        .catch(err => err)
    }
    , getLenderId(agencyId) {
      this.form.baseForm.lenderId ='';
      this.form.preData.baseForm.lenderId=[];
      this.form.baseForm.representUserId ='';
      this.form.preData.baseForm.representUserId=[];
      return this.getValueByAPI2Id('getLenderIdByAgencyId', {agencyId}, 'lenderId', 'lenderName')
    }
    , getRepresentUserId(lenderId) {
      this.form.baseForm.representUserId ='';
      this.form.preData.baseForm.representUserId=[];
      return this.getValueByAPI2Id('getRepresentUserIdByLenderId', {lenderId}, 'representUserId', 'realName')
    }
    , getValueByAPI2Id(method, params, name, apiName) {
      let api = API.agency[method];
      if (!api) return;
      api(params)
        .then(res => {
          if (res.error || !res.success) return;

            this.form.preData.baseForm[name] = res.success.map(l => ({
              name: l[apiName],
              value: l.id
            }));
            this.$forceUpdate();

        })
        .catch(err => err)
    }
    , showAddAccountModal() {
      this.dialogAccountForm.visible = !this.dialogAccountForm.visible;
      if (!/store|shop/.test(this.$route.query.agencyType)) return;
      let id = this.form.baseForm.parentId;

    }
    , addIndex() {
      let contactsList = this.form.contactForm.contactsList;
      //添加index用作name动态
      if (!contactsList) return false
      contactsList.map(function (el, ind) {
        if (el.index) delete el.index;
        return el.index = ind
      })
    }
    , addRow() {
      let contactsList = this.form.contactForm.contactsList;
      //新增一行
      if (!contactsList) contactsList = [];
      contactsList.push({
        type: '',
        realName: '',
        mobile: '',
        email: '',
        remark: ''
      })
      this.addIndex()
    },
    removeRow(data) {
      //删除行
      let contactsList = this.form.contactForm.contactsList;
      let index = data.$index,
        row = data.row;
      contactsList.splice(index, 1)
    },
    dialogType(param) {
      switch (this.$route.query.agencyType) {
        case 'store':
        case 'shop':
          return {type:'select',disabled:true};
          break;
        case 'agency':
        case 'company':
        case 'group':
          let type;
          if(param==='accountType'){
            type = 'select';
          }else{
            type = 'text';
          }
          return {type:type,disabled:false};
          break;
      }
    },
    onCheck() {

      if(this.isChange){
        this.$message({type: 'warning', message: '请先保存上传的附件'});
        return;
      }

      if(this.form.preData.attachForm.isExitFilesLen<1&&this.form.preData.attachForm.saveFilesLen<1){//如果上传过的附件小于一个则不可提交
        this.$message({type: 'warning', message: '请确认至少上传且保存了一个附件'});
        return;
      }

      if(this.isClickFlag) return;
      this.isClickFlag = true;

      let type = this.$route.query.agencyType;
      let id = this.$route.query.admissionBaseId || -1;
      type = type.replace(/group|agency|company/, '').length == 0 ? 'ccg' : 'ss';
      //console.log(type, id);
      API.agency.postCheckSubmitInfo({type, id}).then((res) => {
        let url = "/agency/admission/" + this.$route.query.agencyType + "?buttonId=" + this.$route.query.buttonId;
        this.$router.push(url);
        this.isClickFlag = false;
      }).catch((error) => {
        this.isClickFlag = false;
      })

    },
    lenderIdChange(){

      if(/agency|group|company/.test(this.$route.query.agencyType)){
        let url =this.$route.path+"?";
        url = Object.keys(this.$route.query).reduce((a,b,currentIndex)=>{
          if(b==='admissionBaseId') return a;
          if(currentIndex===0){
            return a+""+b+"="+this.$route.query[b];
          }else {
            return a + "&" + b + "=" + this.$route.query[b];
          }
        },url);
        this.$router.replace(url);
        // window.history.pushState({}, 0, window.location.origin+url);
      }
    }
    ,attachGuarantorChange(event, name, value){
      if(name==='bail'){
        this.form.guarantorForm.openBank ='';
        this.form.guarantorForm.branchBank ='';
        this.form.guarantorForm.bailNo ='';
        this.form.guarantorForm.accountName ='';
        this.form.guarantorForm.bailAmount ='';
        this.form.guarantorForm.bondPercent ='';
      }else if(name==='applyMaxLimit'){
        this.form.guarantorForm.bondBegin ='';
        this.form.guarantorForm.bondEnd ='';
        this.form.guarantorForm.tempAgreeLimit ='';
        this.form.guarantorForm.tempLimitBegin ='';
        this.form.guarantorForm.tempLimitEnd ='';
        this.form.guarantorForm.agreeLimit ='';
      }
    }
  },
  watch: {
    'form.baseForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    },
    'form.guarantorForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    },
    'form.accountForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    },'form.outerForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    }
    ,'form.attachForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    }
    ,'form.contactForm': {
      handler(newValue, oldValue) {
        this.isChange = true;
      },
      deep: true
    }
  },
  layout: 'detail'
}
