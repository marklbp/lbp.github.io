export default {
  methods: {
    cancelTask_mixin(processInstanceId, groupId) {
      this.$confirm('确认取消该任务？', '提示', {
        confirmButtonText: '确定取消',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('d')
          const { cancleProcess } = this.$api.myTask
          const httpConfig = {
            headers: {
              groupId
            }
          }
          cancleProcess({ processInstanceId }, httpConfig).then(() => {
            this.$emit('changeStatus')
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        })
        .catch(() => {})
    }
  }
}
