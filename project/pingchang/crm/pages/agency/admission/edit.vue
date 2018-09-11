
<template>
  <Edit :edit="edit"/>
</template>

<script>
  //集团、公司、经销商 申请记录->编辑

  import Edit from '@/components/common/agency/crm/agency-edit.vue'
  import groupEdit from './add/group.js'
  import agencyEdit from './add/agency.js'
  import companyEdit from './add/company.js'
  import storeEdit from './add/store.js'
  import shopEdit from './add/shop.js'
  import DefaultOpts from '~/config/options'

  export default {
    data(){
      let editCopy = this.getEdit();
      //解决对象引用问题
      let edit=JSON.stringify(editCopy);
      edit = JSON.parse(edit);
      this.initAPIs(edit);
      return {
        edit: {
          ...edit
          ,dictionary: {
            zh_CN: {
              custom: {
                lenderId: {required: '请选择资方'},
                formList: {required: '请确认有新上传且需要保存的附件'},
                advancePay: {required: '请选中是否垫付'},
                applyMaxLimit: {required: '请选中是否申请最高担保额'},
                bail: {required: '请选中是否需要经销商保证金'}
              }
              ,attributes: {
                lenderId: '资方'
                ,cooperativeStartDate: '合作开始日期'
                ,cooperativeEndDate: '合作结束日期'
                ,applyMaxLimit: '最高担保额'
                ,formList: '附件上传'
                ,advancePay: '垫付'
                ,agreeLimit: '协议担保额度'
                ,bondBegin: '担保开始日期'
                ,bondEnd: '担保结束日期'
                ,tempAgreeLimit: '临时额度'
                ,tempLimitBegin: '临时额度开始日期'
                ,tempLimitEnd: '临时额度结束日期'
                ,openBank: '开户行'
                ,branchBank: '所属支行'
                ,bailNo: '经销商保证金账号'
                ,accountName: '户名'
                ,bailAmount: '保证金金额'
                ,bondPercent: '担保占比'
                ,parentId: '所属经销商'
                ,belongCarFactory: '所属车厂'
                ,hierarchy: '层级'
                ,area: '面积'
                ,belongCity: '所属城市'
                ,bussType: '业务类型'
                ,nationality: '国籍'
                ,representUserId: '融资代表'
                ,areaId: '省市区'
                ,groupName: '所属集团'
                ,accountLevel: '出账等级'
                ,accountMode: '出账模式'
                ,carCount: '车辆数量'
                 ,accountType: "账户类型"
                , bankName: "开户银行"
                , branchBank: "所属分行"
                , accountName: "账户名"
                , accountCode: "卡号"
              }
            }
          }
        }
      }
    }
    ,methods: {
      getEdit(){
        switch(this.$route.query.agencyType){
          case 'group':
            let groupEditCopy=JSON.stringify(groupEdit);
            groupEditCopy = JSON.parse(groupEditCopy);
            groupEditCopy.baseForm.table[0][0].html[0].disabled = true;
            groupEditCopy.baseForm.table[0][0].type = 'text';
            return groupEditCopy
            break;
          case 'agency':
            let agencyEditCopy=JSON.stringify(agencyEdit);
            agencyEditCopy = JSON.parse(agencyEditCopy);
            agencyEditCopy.baseForm.table[0][0].html[0].disabled = true;
            agencyEditCopy.baseForm.table[0][0].type = 'text';
            return agencyEditCopy
            break;
          case 'company':
            let companyEditCopy=JSON.stringify(companyEdit);
            companyEditCopy = JSON.parse(companyEditCopy);
            companyEditCopy.baseForm.table[0][0].html[0].disabled = true;
            companyEditCopy.baseForm.table[0][0].type = 'text';
            return companyEditCopy
            break;
          case 'store':
            return storeEdit
            break;
          case 'shop':
            return shopEdit
            break;
        }
      }
      ,getAdmissionBaseId(){
        return this.$route.query.admissionBaseId || -1
      }
      ,initAPIs(edit){
        switch(this.$route.query.agencyType){
          case 'store':
          case 'shop':
            edit.outerForm.apis = this.outerFormAPIs();
            edit.outerForm.submit = this.outerFormSubmit();
          //edit.contactForm.apis =
          case 'agency':
          case 'company':
            edit.guarantorForm.apis = this.guarantorFormAPIs();
            edit.accountForm.apis = this.accountFormAPIs();
            edit.guarantorForm.submit = this.guarantorFormSubmit()
            edit.accountForm.submit = this.accountFormSubmit();
          case 'group':
          default:
            edit.baseForm.apis = this.baseFormAPIs();
            edit.attachForm.apis = this.attachFormAPIs();
            edit.baseForm.submit = this.baseFormSubmit();
            edit.attachForm.submit = this.attachFormSubmit();
            break;
        }
      }
      ,getAPIs(){
        let t = this.$route.query.agencyType
        if(t && this[t+'APIs']){
          return this[t+'APIs']()
        }else{
          return []
        }
      }
      ,baseFormAPIs(){
        let agencyType = this.$route.query.agencyType;
        let agencyId = this.$route.query.agencyId || -1;
        let url = 'agency.getDetailBaseByAgencyId';
        let params = {agencyId};
        this.$route.query.lenderId?params.lenderId =this.$route.query.lenderId:null;
        if(/store|shop/.test(agencyType)){
          //展厅和门店
          url = 'agency.getStore2ShopDetail';
          params = {
            stype: 40,
            id: -1
          }
          return this.s2sbaseFormAPIs(url, params)
        }
        return [{
          url: url
          ,form: 'baseForm'
          ,params: params
          ,name: 'agencyDetail' // 获取对应的字段对象
          ,fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          ,fnArgs: [['address', 'province', 'city', 'area']]//对应加工处理需传入的字段参数
          ,transform: (data, dataForm)=>{
            let form = {...data.agencyDetail};
            form.contactsList = data.contactsList;

            dataForm.baseForm.lenderId = form.lenderId;
            dataForm.baseForm.agencyId  = form.id;
            dataForm.baseForm.id  = this.$route.query.itemId;
            dataForm.baseForm.cooperativeStartDate = form.cooperativeStartDate;
            dataForm.baseForm.cooperativeEndDate = form.cooperativeEndDate;
            form.lenderId = data.agencyDetail.lenderName;
            return form
          }
        }]
      }
      ,s2sbaseFormAPIs(url, params){
        return [{
          url: url
          ,form: 'baseForm'
          ,params: params
          ,name: 'storeDetail' // 获取对应的字段对象
          //,fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          //,fnArgs: [['address', 'province', 'city', 'area']]//对应加工处理需传入的字段参数
          ,transform: (data)=>{
            let form = {...data.storeDetail};
            // 所属车厂 | 层级 | 业务类型
            [{k:'belongCarFactory', v: 'storeVehicleBrands'},
              {k: 'hierarchy', v: 'StoreHierarchyTypeList'},
              {k: 'bussType', v: 'StoreBussTypeList'}].forEach(n=>{
              form[n.k] = data[n.v].map(y=>({
                name: y.value,
                value: y.key
              }));
            })
            // 所属经销商
            form.parentId = [...data.parentList].map(l=>({
              name: l.name,
              value: l.id
            }));
            return form
          }
        }]
      }
      ,guarantorFormAPIs(){
        let id =  this.getAdmissionBaseId();
        return [{
          url: 'agency.getGuarantorInfo'
          ,form: 'guarantorForm'
          ,params: {
            id
          }
          ,transform: (data,dataForm) => {
            dataForm.guarantorForm={...dataForm.guarantorForm,...data};
            // dataForm.guarantorForm={
            //   accountName:data.accountName,
            //   advancePay:data.advancePay,
            //   agreeLimit:data.agreeLimit,
            //   applyMaxLimit:data.applyMaxLimit,
            //   bail:data.bail,
            //   bailAmount:data.bailAmount,
            //   bailNo:data.bailNo,
            //   bondBegin:data.bondBegin,
            //   bondEnd:data.bondEnd,
            //   bondPercent:data.bondPercent,
            //   branchBank:data.branchBank,
            //   openBank:data.openBank,
            //   tempAgreeLimit:data.tempAgreeLimit,
            //   tempLimitBegin:data.tempLimitBegin,
            //   tempLimitEnd:data.tempLimitEnd
            // }
          }
        }]
      }
      ,outerFormAPIs(){
        let stype = this.$route.query.agencyType == 'store' ? 40 : 50;
        let id =  this.getAdmissionBaseId();
        return [{
          url: 'agency.getOutAccount'
          ,form: 'outerForm'
          ,params: {id,stype}
        }]
      }
      ,accountFormAPIs(){
        let type =  this.$route.query.agencyType;
        let id =  this.getAdmissionBaseId();
        type = type.replace(/group|company|agency/,'');
        type = type.length > 0 ? 'ss' : 'ccg';
        return [{
          url: 'agency.getAccountList'
          ,form: 'accountForm'
          ,params: {
            id
            ,type: type
          }
          ,transform: (data,dataform) => {
            dataform.preData.dialogAccountForm.accountType= DefaultOpts.accountOption;
            return data;
          }
        }]
      }
      ,contactFormAPIs(){
        let id =  this.getAdmissionBaseId();
        return [{
          url: 'agency.getContact'
          ,form: 'accountForm'
          ,params: {
            id
          }
        }]
      }
      ,attachFormAPIs(){
        let id =  this.getAdmissionBaseId();
        return [{
          url: 'agency.getFileList'
          ,form: 'attachForm'
          ,params: {
            id
          }
          //,name: 'agencyDetail' // 获取对应的字段对象
          //,fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
          //,fnArgs: [['address', 'province', 'city', 'area']]//对应加工处理需传入的字段参数
          ,transform: (data,dataForm)=>{
            let form = {
              head: [
                {
                  prop: 'index'
                  ,label: '序号'
                }
                ,{
                  prop: 'name'
                  ,label: '资料名称'
                }
                ,{
                  prop: 'file'
                  ,label: '已上传资料'
                }
              ],
              files: [],
              isExitFilesLen:0,
              saveFilesLen:0
            };
            let fileList = {};
            (data.fileList)&&(data.fileList = data.fileList.forEach(f => {
              if (!fileList[f.type]) {
                fileList[f.type] = [];
              }
              fileList[f.type].push(f);
            }));
            Object.keys(data.docList).forEach(i => {
              let file = fileList[i];
              form.files.push({
                index: i
                , name: data.docList[i]
                , file: []
              });
              if (file) {
                form.isExitFilesLen++;
                dataForm.attachForm.formList = [...dataForm.attachForm.formList,...file.map(item => {
                    return {
                      type: item.type,
                      fileId: item.id
                    }
                  })
                ];
                form.files[i].file = [...file.map((item) => {
                  return {
                    url: item.fileUrl,
                    id: item.id
                  }
                }),...form.files[i].file]
              }
            });
            return form
          }
        }]
      }
      ,baseFormSubmit(){
        let action = 'agency.postAdmissionBase';
        let id = this.$route.query.agencyId
        let params =  {
          agencyId: id
        }
        if(/store|shop/.test(this.$route.query.agencyType)){
          action = 'agency.postStore2ShopAdmissionBase';
          params = {
            sType: 40
          }
        }
        return {
          action: action
          ,preParams: params
        }
      }
      ,guarantorFormSubmit(){
        let type = this.$route.query.agencyType;
        let id =  this.getAdmissionBaseId();
        type = type.replace(/group|agency|company/,'').length == 0 ? 'ccg' : 'ss'
        return {
          action: 'agency.postGuarantorInfo'
          ,preParams: {
            type
            ,id
          }
        }
      }
      ,outerFormSubmit(){
        let sType = this.$route.query.agencyType == 'store' ? 40 : 50;
        let id =  this.getAdmissionBaseId();
        return {
          action: 'agency.postOutAccount'
          ,preParams: {sType,id}
        }
      }
      ,accountFormSubmit(){
        let type = this.$route.query.agencyType;
        let id =  this.getAdmissionBaseId();
        type = type.replace(/group|agency|company/,'').length == 0 ? 'ccg' : 'ss';
        return {
          action: "agency.postAccountInfoList" //表单提交接口api
          ,preParams: {
            type
            ,id
          } // 表单提交数据子集
        }
      }
      ,contactFormSubmit(){
        let id =  this.getAdmissionBaseId();
        return {
          action: "agency.postContact" //表单提交接口api
          ,preParams: {
            id
          } // 表单提交数据子集
        }
      }
      ,attachFormSubmit(){
        let type = this.$route.query.agencyType;
        let id =  this.getAdmissionBaseId();
        type = type.replace(/group|agency|company/,'').length == 0 ? 'ccg' : 'ss'
        return {
          action: 'agency.postAdmissionFileList'
          ,preParams: {
            id
            ,type
          }
        }
      }
    }
    ,components: {
      Edit
    }
  }
</script>
