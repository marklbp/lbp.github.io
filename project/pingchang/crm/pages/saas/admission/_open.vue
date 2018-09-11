<template>
	<List :list="list">
		<router-link v-if="list.module == 'store' || list.module == 'shop' || menuBtnsList.wrapButtonList.length > 0" tag="el-button" style="margin-bottom: 20px;" :to="'/saas/admission/add?agencyType=' + list.module + ($route.query.buttonId ? '&buttonId=' + $route.query.buttonId: '')" slot="addApply">准入申请</router-link>
	</List>
</template>
<script>
  //saas 集团、经销商、公司、门店、展厅 准入申请列表
	import List from '@/components/common/agency/saas/agency-list.vue';
	import {mapState} from 'vuex';
	import DefaultOpts from '~/config/options'
	export default {
		data(){
			let list = this.genDataByType();

			list.module = this.$route.params.open;
			list.parent = 'saas';
			let admissionBaseId = this.$route.query.admissionBaseId;
			let buttonId = this.$route.query.buttonId;
			list.table.actions = {
				detail: (item, agencyTypes)=>{
					let url = "/saas/admission/detail/" + item.id + '?agencyType=' + list.module;
					if(list.parent)url = "/saas/admission/detail/" + item.id + '?agencyType=' + list.module +"&detailType=recordDetail";
					if(admissionBaseId)url += '&admissionBaseId='+ admissionBaseId;
      		this.$router.push(url)
				}
				,add: (item, agencyTypes)=>{
					let url = "/saas/admission/add?agencyType=" + list.module + "&agencyId=" + item.id+"&buttonId="+buttonId;
      		this.$router.push(url)
				}
				,modify: (item, agencyTypes)=>{
					// 编辑
          let url;
          if(/store|shop/.test(this.$route.params.open)){
            url = "/saas/admission/ssedit?agencyType=" + list.module + "&agencyId=" + item.agencyId+'&lenderId='+item.lenderId+"&buttonId="+this.$route.query.buttonId+"&itemId="+item.id;
          }else{
            url = "/saas/admission/edit?agencyType=" + list.module + "&agencyId=" + item.agencyId+'&lenderId='+item.lenderId+"&buttonId="+this.$route.query.buttonId+"&itemId="+item.id;
          }
          if(!admissionBaseId)url += '&admissionBaseId='+item.id;
      		this.$router.push(url)
				}
				,record: (item, agencyTypes)=>{
          let url = "/saas/admission/recordency?id="+ item.id +"&type="+ list.module ;
          this.$router.push(url);
        }
			}
			return {list}
		},
    computed: mapState({
        menuBtnsList: state => state.global.menuBtnsList
    }),
		components: {
			List
		},
		methods: {
			genDataByType(){
				let type = this.$route.params.open;
				let data = {}
				switch(type){
					case "group":
					data = this.genGroupData();
					break;
					case "agency":
					data = this.genAgencyData();
					break;
					case "company":
					data = this.genCompanyData();
					break;
					case "store":
					data = this.genStoreData()
					break;
					case "shop":
					data = this.genShopData()
					break;
					default:
					data = this.genDefaultData()
					break;
				}
				return data;
			}
			,genDefaultData(){
				// 默认抽象
				return this.genGroupData();
			}
			,genGroupData(){
				let cols = [], search = [];
				let system = this.$route.query.system;
				let url = 'agency.getAdmissionRecordList'
					search.push({type: 'select', label: '状态', placeholder: '请选择', name: 'status', options: DefaultOpts.recordStatus});
					cols.push({
						prop: 'cooperativeStartDate', label: '合作开始日期'
					},{
						prop: 'cooperativeEndDate', label: '合作结束日期'
					},{
						prop: 'statusName', label: '状态'
					},{
						prop: 'createdAt', label: '申请时间'
					},{
						prop: 'createdUser', label: '申请人'
					})
				//}
				return {
					params: {
						code: ''
						,name: ''
						,id: -1
						,agencyType: 20
						,status:-1
					}
					,search: [
						{
							type: 'text'
							,label: '集团编码'
							,name: 'code'
							,placeholder: '集团编码'
						}
						,{
							type: 'text'
							,label: '集团名称'
							,name: 'name'
							,placeholder: '集团名称'
						}
						,...search
					]
					,table: {
						url
						,cols: [
							{
								prop: 'code'
								,label: '集团编码'
							}
							,{
								prop: 'name'
								,label: '集团名称'
							}
							,{
								prop: 'businessStartDate'
								,label: '营业起始日'
							}
							,{
								prop: 'businessEndDate'
								,label: '营业到期日'
							}
							,...cols
							,{
								prop: 'regCapital'
								,label: '注册资本'
							}
						]
					}
				}
			}
			,genAgencyData(){
				let cols = [], search = [];
				let url = 'agency.getAdmissionRecordList'
				search.push({type: 'select', label: '状态', placeholder: '请选择', name: 'status', options: DefaultOpts.recordStatus},{
					type: 'text',
					label: '所属集团',
					placeholder: '所属集团',
					name: 'parentName'
				});
				return {
					params: {
						code: ''
						,name: ''
						,id: -1
						,agencyType: 30
					}
					,search: [
						{
							type: 'text'
							,label: '经销商编码'
							,name: 'code'
							,placeholder: '经销商编码'
						}
						,{
							type: 'text'
							,label: '经销商名称'
							,name: 'name'
							,placeholder: '经销商名称'
						}
						,...search
					]
					,table: {
						url
						,cols: [
							{
								prop: 'code'
								,label: '经销商编码'
							}
							,{
								prop: 'name'
								,label: '经销商名称'
							}
							,{
								prop: 'parentName'
								,label: '所属集团'
							}
							,{
								prop: 'businessStartDate'
								,label: '营业起始日'
							}
							,{
								prop: 'businessEndDate'
								,label: '营业到期日'
							}
							,{
								prop: 'cooperativeStartDate'
								,label: '合作起始日'
							}
							,{
								prop: 'cooperativeEndDate'
								,label: '合作到期日'
							}
							,{
								prop: 'regCapital'
								,label: '注册资本'
							}
							,{
								prop: 'statusName'
								,label: '状态'
							}
							,{
								prop: 'createdAt'
								,label: '申请时间'
							}
							,{
								prop: 'createdUser'
								,label: '申请人'
							}
						]
					}
				}
			}
			,genCompanyData(){
				let url = 'agency.getAdmissionRecordList'
				return {
					params: {
						code: ''
						,name: ''
						,id: -1
						,agencyType: 10
					}
					,search: [
						{
							type: 'text'
							,label: '公司编码'
							,name: 'code'
							,placeholder: '公司编码'
						}
						,{
							type: 'text'
							,label: '公司名称'
							,name: 'name'
							,placeholder: '公司名称'
						}
					]
					,table: {
						url
						,cols: [
							{
								prop: 'code'
								,label: '公司编码'
							}
							,{
								prop: 'name'
								,label: '公司名称'
							}
							,{
								prop: 'businessStartDate'
								,label: '营业起始日'
							}
							,{
								prop: 'businessEndDate'
								,label: '营业到期日'
							},{
								prop: 'cooperativeStartDate'
								,label: '营业起始日'
							}
							,{
								prop: 'cooperativeEndDate'
								,label: '营业到期日'
							}
							,{
								prop: 'regCapital'
								,label: '注册资本'
							},{
								prop: 'statusName'
								,label: '状态'
							}
							,{
								prop: 'createdAt'
								,label: '申请时间'
							}
							,{
								prop: 'createdUser'
								,label: '申请人'
							}
						]
					}
				}
			}
			,genStoreData(){
				return {
					params: {
						code: ''
						,name: ''
						,status: -1
						,parentName: ''
						,belongCity: ''
						,agencyType: 40
					}
					,search: [
						{
							type: 'text'
							,label: '展厅编码'
							,name: 'code'
							,placeholder: '展厅编码'
						}
						,{
							type: 'text'
							,label: '展厅名称'
							,name: 'name'
							,placeholder: '展厅名称'
						}
						,{
							type: 'select'
							,label: '状态'
							,name: 'status'
							,placeholder: '请选择'
							,options: DefaultOpts.recordStatus
						}
						,{
							type: 'text'
							,label: '所属集团'
							,name: 'parentName'
							,placeholder: '所属集团'
						}
						,{
							type: 'text'
							,label: '所属城市'
							,name: 'belongCity'
							,placeholder: '所属城市'
						}
					]
					,table: {
						url: 'agency.getStore2ShopAdmissionList'
						,cols: [
							{
								prop: 'code'
								,label: '展厅编码'
							}
							,{
								prop: 'name'
								,label: '展厅名称'
							}
							,{
								prop: 'parentName'
								,label: '所属经销商'
							}
							,{
								prop: 'groupName'
								,label: '所属集团'
							}
							/*,{
								prop: 'lenderName'
								,label: '所属资方'
							}*/
							,{
								prop: 'statusName'
								,label: '审核状态'
							}
							,{
								prop: 'area'
								,label: '展厅面积'
							}
							,{
								prop: 'belongCity'
								,label: '所属城市'
							}
							,{
								prop: 'createdAt'
								,label: '申请时间'
							}
							,{
								prop: 'createdUser'
								,label: '申请人'
							}
						]
					}
				}
			}
			,genShopData(){
				return {
					params: {
						code: ''
						,name: ''
						,status: '-1'
						,companyName: ''
						,lenderName: ''
						,cityName: ''
						,agencyType: 50
					}
					,search: [
						{
							type: 'text'
							,label: '门店编码'
							,name: 'code'
							,placeholder: '门店编码'
						}
						,{
							type: 'text'
							,label: '门店名称'
							,name: 'name'
							,placeholder: '门店名称'
						}
					]
					,table: {
						url: 'agency.getStore2ShopAdmissionList'
						,cols: [
							{
								prop: 'code'
								,label: '门店编码'
							}
							,{
								prop: 'name'
								,label: '门店名称'
							}
							,{
								prop: 'parentName'
								,label: '所属公司'
							}
							,{
								prop: 'statusName'
								,label: '审核状态'
							}
							,{
								prop: 'area'
								,label: '门店面积'
							}
							,{
								prop: 'belongCity'
								,label: '所属城市'
							}
							,{
								prop: 'createdAt'
								,label: '申请时间'
							}
							,{
								prop: 'createdUser'
								,label: '申请人'
							}
						]
					}
				}
			}
		}
		,layout: 'org_layouts'
	}
</script>
