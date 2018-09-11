<template>
	<List :table="table" :titleFormat="titleFormat" />
</template>
<script>
	import List from '@/components/common/lender2guarantor2sp/list.vue';
	export default {
		data(){
			return {
				table: {
					module: 'guarantor',
					code: '担保方编码',
					name: '担保方名称',
					bindText: '绑定资方',
					url: 'guarantor.getInfoList'
				},
				titleFormat: ['资方列表', '已选资方']
			}
		},
		components: {
			List
		}
	}
</script>