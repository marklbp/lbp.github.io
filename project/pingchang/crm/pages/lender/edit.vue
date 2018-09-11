<template>
	<Edit :initpage="page" :dictionary="dictionary" />
</template>
<script>
	import Edit from '@/components/common/lender2guarantor2sp/edit.vue'
	export default {
		data(){
			return {
				page: {
					codeName:"资方编码",
					formName:"资方名称",
          formShortName:"资方简称",
          isSp:false,
          regCapitalName:"注册资本",
          regCapitalNameHolder:"注册资本（万元美金）",
          module: "lender"
				},
				dictionary: {
				  zh_CN: {
				    attributes: {
				      name: '资方名称',
				      shortName: '资方简称',
				      regCapital: '注册资本（万元美金）'
				    }
				  }
				}
			}
		},
		components: {
			Edit
		}
	}
</script>