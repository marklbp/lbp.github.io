<template>
	<Edit :initpage="page" :dictionary="dictionary" />
</template>
<script>
	import Edit from '@/components/common/lender2guarantor2sp/edit.vue'
	export default {
		data(){
			return {
				page: {
					codeName:"担保方编码",
					formName:"担保方名称",
	                formShortName:"担保方简称",
	                isSp:false,
	                regCapitalName:"注册资本",
	                regCapitalNameHolder:"注册资本（万元美金）",
	                module: "guarantor"
				},
				dictionary: {
				  zh_CN: {
				    attributes: {
				      name: '担保方名称',
				      shortName: '担保方简称',
				      regCapital: '注册资本（万元美金）',
				      phone: '手机号'
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