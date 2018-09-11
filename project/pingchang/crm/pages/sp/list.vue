<template>
	<List :table="table" :titleFormat="titleFormat" />
</template>
<script>
	import List from '@/components/common/lender2guarantor2sp/list.vue';
	export default {
		data(){
			return {
				table: {
					module: 'sp',
					url: 'sp.getInfoList',
					code: 'SP编码',
					name: 'SP名称',
					bindText: '绑定资方'
				},
				titleFormat: ['资方列表', '已选资方']
			}
		},
		components: {
			List
		}
	}
</script>