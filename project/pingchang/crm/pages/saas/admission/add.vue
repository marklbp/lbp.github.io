<template>
	<Edit :edit="edit"/>
</template>

<script>
  //saas 集团、经销商、公司、门店、展厅 准入申请
	import Edit from '@/components/common/agency/saas/agency-edit.vue'
	import groupEdit from './add/group.js'
	import agencyEdit from './add/agency.js'
	import companyEdit from './add/company.js'
	import storeEdit from './add/store.js'
	import shopEdit from './add/shop.js'
	import DefaultOpts from '~/config/options'
  import API from '@/api'
	export default {
		data(){
			let edit = this.getEdit();
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
					return groupEdit
					break;
					case 'agency':
					return agencyEdit
					break;
					case 'company':
					return companyEdit
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
					 edit.contactForm.apis = this.contactFormAPIs();
					 edit.contactForm.submit = this.contactFormSubmit();
            edit.accountForm.acountInfoApi =  this.accountFormInfoAPI();
					case 'agency':
					case 'company':
					 	edit.guarantorForm.apis = this.guarantorFormAPIs();
					 	edit.accountForm.apis = this.accountFormAPIs();
					 	edit.guarantorForm.submit = this.guarantorFormSubmit()
					 	edit.accountForm.submit = this.accountFormSubmit()
					case 'group':
					default:
						edit.baseForm.apis = this.baseFormAPIs();
			  		edit.attachForm.apis = this.attachFormAPIs();
			  		edit.baseForm.submit = this.baseFormSubmit();
			  		edit.attachForm.submit = this.attachFormSubmit()
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
				let params = {agencyId}
        if(/store|shop/.test(agencyType)){
        	//展厅和门店
        	url = 'agency.getStore2ShopDetail';
        	params = {
        		stype: agencyType=='store'?40:50,
        		id: agencyId
        	}
        	return this.s2sbaseFormAPIs(url, params)
        }
				return [{
	        url
	        ,form: 'baseForm'
	        ,params: params
	        ,name: 'agencyDetail' // 获取对应的字段对象
	        ,fns: ['parseAddress'] // 字段对象中个别字段需要加工处理函数名，在Detail里实现
	        ,fnArgs: [['address', 'province', 'city', 'area']]//对应加工处理需传入的字段参数
	        ,transform: (data, dataForm)=>{
	          let form = {...data.agencyDetail};
	          form.contactsList = data.contactsList;
	          let hasList = data.noBindLenderList;
	          let noList = data.noBindLenderList;
	          /*if(!this.$route.path)
	          if(noList){
          		form.lenderId = [...noList].map(l=>({
		            name: l.lenderName,
		            value: l.id
		          }))
	          }else{
	          	form.lenderId = [...dataForm.preData.baseForm.lenderId]
	          }*/
	          form.cardType = [...DefaultOpts.company_type];//[...dataForm.preData.baseForm.cardType]
	          dataForm.baseForm.agencyId = form.id;

	          return form
	        }
	      }, {
	      	url: 'agency.getLenderId'
	      	,form: 'baseForm'
	      	,transform: (data, dataForm)=>{
	      		dataForm.preData.baseForm.lenderId = [{name: data.lenderName, value: data.lenderId}]
	      		dataForm.baseForm.lenderId = data.lenderId;
	      		//dataForm.baseForm.lenderId = '144582';
	      		return dataForm.preData.baseForm
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

            let agencyType = this.$route.query.agencyType;
		          let form = {...data.storeDetail};
		          // 所属车厂 | 层级 | 业务类型
            let objKey = agencyType === 'shop' ?
              [{k: 'hierarchy', v: 'StoreHierarchyTypeList'},
                {k: 'bussType', v: 'StoreBussTypeList'}] : [
                {k: 'belongCarFactory', v: 'storeVehicleBrands'},
                {k: 'hierarchy', v: 'StoreHierarchyTypeList'},
                {k: 'bussType', v: 'StoreBussTypeList'}];
            objKey.forEach(n=>{
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
		      }, {
	      	url: 'agency.getLenderId'
	      	,form: 'baseForm'
	      	,transform: (data, dataForm)=>{
	      		dataForm.preData.baseForm.lenderId = [{name: data.lenderName, value: data.lenderId}]
	      		dataForm.baseForm.lenderId = data.lenderId;
	      		//dataForm.baseForm.lenderId = '144582';

            API.agency.getRepresentUserIdByLenderId({lenderId:data.lenderId}).then((res)=>{
              res.success?(dataForm.preData.baseForm.representUserId = res.success.map((item)=>{
                return {
                  name:item.realName,
                  value:item.id
                }
              })):null;
            }).catch((error)=>{
              this.isClickFlag = false;
            })
	      		return dataForm.preData.baseForm
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
	        },
					transform: (data)=>{
						// let form = {...data.storeDetail};
						// // // 所属车厂 | 层级 | 业务类型
						// // [{k:'belongCarFactory', v: 'storeVehicleBrands'},
						// //  {k: 'hierarchy', v: 'StoreHierarchyTypeList'},
						// //  {k: 'bussType', v: 'StoreBussTypeList'}].forEach(n=>{
						// // 	form[n.k] = data[n.v].map(y=>({
						// // 		name: y.value,
						// // 		value: y.key
						// // 	}));
						// // })
						// // // 所属经销商
						// // form.parentId = [...data.parentList].map(l=>({
						// // 	name: l.name,
						// // 	value: l.id
						// // }));
						// return form
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
			,accountFormAPIs() {
        let id = this.getAdmissionBaseId();
        let type = /agency|group|company/.test(this.$route.query.agencyType)?'ccg':'cc';
        let url = 'agency.getAccountList';
        let params = {
          id,
          type
          ,transform: (data,dataform) => {
            dataform.preData.dialogAccountForm.accountType= DefaultOpts.accountOption;
            return data;
          }
        }
        return this.s2sAccountFormAPIs(url, params)
      }
      ,accountFormInfoAPI(){//门店与展厅的账号信息页面需多调一个接口查询资方数组
        return {
          url: 'agency.getAccountInfo',
          form: 'dialogAccountForm',
          params: {
            type:'ss',
            id:this.$route.query.itemId
          },
          transform: (data,dataform) => {
            dataform.preData.accountForm = data;
          }
        }
      }
      , s2sAccountFormAPIs(url, params) {
        return [{
          url: url,
          form: 'dialogAccountForm',
          params: params,
          transform: (data) => {
            // 所属经销商
            let form = {};
            form.accountType = [];
            form.bankName = [];
            // form.accountType = [...data].map((l,index)=>({
            //   name: l.accountType,
            //   value: index
            // }));
            // form.bankName = [...data].map((l,index)=>({
            //   name: l.bankName,
            //   value: index
            // }));
            if(/shop|store/.test(this.$route.query.agencyType)){
              let arr = [...data];
              arr.forEach((l, index) => {
                form.accountType.push({
                  ...arr[index],
                  name: l.accountType,
                  value: index
                })
                form.bankName.push({
                  name: l.bankName,
                  value: index
                })
              });
            }else{
              form.accountType = DefaultOpts.accountOption;
            }
            return form
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
	        ,transform: (data)=>{
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
						sType: this.$route.query.agencyType == 'store' ? 40 : 50
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
				type = type.replace(/group|agency|company/,'').length == 0 ? 'ccg' : 'ss'
				return {
          action: "agency.postAccountInfoList" //表单提交接口api
          ,preParams: {
          	type
          	,id
            ,transform: (data,dataform) => {
              dataform.preData.dialogAccountForm.accountType= DefaultOpts.accountOption;
              return data;
            }
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
		,layout: 'org_layouts'
	}
</script>
