<template>
	<List :table="table" :titleFormat="titleFormat" />
</template>
<script>
	import List from '@/components/common/lender2guarantor2sp/list.vue';
	let lenderList = {
		data(){
			return {
				table: {
					module: 'lender',
					url: 'lender.getInfoList',
					code: '资方编码',
					name: '资方名称',
					bindText: '绑定担保方'
				},
				titleFormat: ['担保方列表', '已选担保方']
			}
		},
		components: {
			List
		}
	}

	export default lenderList
</script>