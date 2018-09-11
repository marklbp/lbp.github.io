<template>
	<List :list="list">
		<router-link v-if="list.module == 'store' || list.module == 'shop' " tag="el-button" style="margin-bottom: 20px;" :to="'/agency/admission/add?agencyType=' + list.module+($route.query.buttonId ? '&buttonId=' + $route.query.buttonId: '')" slot="addApply">准入申请</router-link>
	</List>
</template>
<script>
  //集团、经销商、公司、门店、展厅 准入申请列表
	import List from '@/components/common/agency/crm/agency-list.vue';
	import {mapState} from 'vuex';
  import defaultOption from '~/config/options'
	export default {
		data(){
			let list = this.genDataByType();
			let admissionBaseId = this.$route.query.admissionBaseId;
			if(this.$route.params.open!='store' && this.$route.params.open!='shop') {
				list.table.url = 'agency.' + (admissionBaseId ? 'getAdmissionRecordList' :'getAdmissionList');
			}
			list.module = this.$route.params.open;
      list.isAcountModule = true;
			list.table.actions = {
				detail: (item, agencyTypes)=>{
					let url = "/agency/admission/detail/" + item.id + '?agencyType=' + list.module;
					if(admissionBaseId)url += '&admissionBaseId='+ admissionBaseId;
      		this.$router.push(url)
				}
				,add: (item, agencyTypes)=>{
					/*let url = "/agency/admission/add?agencyType=" + list.module + "&agencyId=" + item.id+"&buttonId="+this.$route.query.buttonId
					+"&itemId="+item.id;
      		this.$router.push(url)*/
				}
				,modify: (item, agencyTypes)=>{
					// 编辑
					let url = "/agency/admission/ssedit?agencyType=" + list.module + "&agencyId=" + item.id+"&buttonId="+this.$route.query.buttonId
					+"&itemId="+item.id;
      		this.$router.push(url)
					return this.list.table.actions.add(item, agencyTypes)
				}
				,record: (item, agencyTypes)=>{
          let url = "/agency/admission/recordency?agencyId="+ item.id +"&agencyType="+ list.module+"&buttonId="+this.$route.query.buttonId ;
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
				let url = 'agency.getAdmissionList';
				return {
					params: {
						code: ''
						,name: ''
						,agencyType: 20
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
							//,...cols
							,{
								prop: 'regCapital'
								,label: '注册资本'
							}
						]
					}
				}
			}
			,genAgencyData(){
				return {
					params: {
						code: ''
						,name: ''
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
					]
					,table: {
						url: 'agency.getAdmissionList'
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
								prop: 'regCapital'
								,label: '注册资本'
							}
						]
					}
				}
			}
			,genCompanyData(){
				return {
					params: {
						code: ''
						,name: ''
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
						url: 'agency.getAdmissionList'
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
							}
							,{
								prop: 'regCapital'
								,label: '注册资本'
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
						,lenderName: ''
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
							,label: '所属状态'
							,name: 'status'
							,placeholder: '请选择'
							,options: defaultOption.recordStatus
						}
						,{
							type: 'text'
							,label: '所属集团'
							,name: 'parentName'
							,placeholder: '所属集团'
						}
						,{
							type: 'text'
							,label: '所属资方'
							,name: 'lenderName'
							,placeholder: '所属资方'
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
							,{
								prop: 'lenderName'
								,label: '所属资方'
							}
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
						,status: -1
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
						,{
							type: 'select'
							,label: '状态'
							,name: 'status'
							,placeholder: '请选择'
							,options: defaultOption.recordStatus
						}
						,{
							type: 'text'
							,label: '所属公司'
							,name: 'parentName'
							,placeholder: '所属公司'
						}
						,{
							type: 'text'
							,label: '所属资方'
							,name: 'lenderName'
							,placeholder: '所属资方'
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
								prop: 'lenderName'
								,label: '所属资方'
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
	}
</script>
