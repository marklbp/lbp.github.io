<template>
	<Edit :initpage="page" :dictionary="dictionary"></Edit>
</template>
<script>
  //saas 集团、经销商、公司 开户申请
	import Edit from '@/components/common/agency/saas/xedit.vue'
	export default {
		data(){
			return {
				page: {
					codeName:"机构编码",
					formName:"机构名称",
          formShortName:"简称",
          regCapitalName:"注册资本",
          regCapitalNameHolder:"注册资本(万)美金",
          module: "agency"
          ,showNationality: true
          ,hiddenType: true
          ,showAgencyType: true
          ,child: this.$route.params.type
					,showTaxerType: this.$route.params.type == 'group'
					,showGroup: this.$route.params.type == 'agency'
				},
				dictionary: {
				  zh_CN: {
				    attributes: {
				      name: '机构名称',
				      shortName: '简称',
				      regCapital: '注册资本(万)美金',
				      taxPayerType: '纳税人类型',
				      taxPayerCode: '纳税人识别号',
				      nationality: '国籍',
				      group: '所属集团'
				    }
				  }
				}
			}
		},
		components: {
			Edit
		}
    ,layout: 'org_layouts'
	}
</script>
