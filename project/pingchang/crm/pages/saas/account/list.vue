<template>
	<List :list="list">
		<router-link v-if="menuBtnsList.wrapButtonList.length > 0" tag="el-button" style="margin-bottom: 20px;" :to="'/saas/account/add/group?buttonId='+list.buttonId" slot="addApply">开户申请</router-link>
	</List>
</template>
<script>
  //saas 开户列表
	import List from '@/components/common/agency/saas/agency-list.vue';
	import {mapState} from 'vuex';
	export default {
		data(){
			return {
        list: {
        	module: 'agency',
					params: {
						code: ''
						,name: ''
						,agencyType: ''
					}
					,search: [
						{
							type: 'text'
							,label: '机构编码'
							,name: 'code'
							,placeholder: '机构编码'
						}
						,{
							type: 'text'
							,label: '机构名称'
							,name: 'name'
							,placeholder: '机构名称'
						}
						,{
							type: 'select'
							,label: '机构类型'
							,name: 'agencyType'
							,placeholder: '请选择'
							,options: [...this.$store.state.select.agencyTypes]
						}
					]
					,table: {
						url: 'agency.getInfoList'
						,cols: [
							{
								prop: 'code'
								,label: '机构编码'
							}
							,{
								prop: 'name'
								,label: '机构名称'
							}
							,{
								prop: 'shortName'
								,label: '机构简称'
							}
							,{
								prop: 'agencyTypeName'
								,label: '类型'
							}
							,{
								prop: 'createdAt'
								,label: '开户时间'
							}
							,{
								prop: 'createdUser'
								,label: '开户人'
							}
						]
						,actions: {
							detail: (item, agencyTypes)=>{
								let type = agencyTypes.find(t=>t.value == item.agencyType);
								let url = "/saas/account/detail/" + item.id + '?agencyType='+type.en
            		this.$router.push(url)
							}
							,add: (item, agencyTypes)=>{
								let type = agencyTypes.find(t=>t.value == item.agencyType);
								this.$router.push("/saas/account/add/" + type.en)
							}
							,modify: (item, agencyTypes)=>{
								let type = agencyTypes.find(t=>t.value == item.agencyType);
								this.$router.push("/saas/account/add/" + type.en + '?agencyId=' + item.id)
							}
						}
					}
          ,buttonId:this.$route.query.buttonId
        }
			}
		},
    computed: mapState({
        menuBtnsList: state => state.global.menuBtnsList
        ,agencyTypes: state => state.select.agencyTypes
    }),
		components: {
			List
		}
    ,layout: 'org_layouts'
	}
</script>
