<template>
  <div class="policy-modal">
    <el-dialog
      title="审核"
      @close="closeHandler"
      :visible.sync="modalVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="form" label-position="top" ref="form">
        <el-form-item label="是否审核通过?">
          <el-radio v-model="form.agree" label="0">通过</el-radio>
          <el-radio v-model="form.agree" label="1">拒绝</el-radio>
        </el-form-item>
        <el-form-item label="审核备注" :rules="rules" prop="comment">
          <el-input
            type="textarea"
            placeholder="请输入审核备注"
            v-model="form.comment"
            rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button type="primary" @click="submitHandler">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const initForm = {
  agree: '0',
  comment: ''
}
export default {
  props: {
    // 控制模态框显示
    value: {
      type: Boolean,
      default: false
    },
    // 该子任务的id
    processExecId: {
      type: String,
      default: ''
    },
    // 再全局任务中需要传
    storeId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      form: { ...initForm }
    }
  },
  methods: {
    //
    closeHandler() {
      this.$emit('close')
      this.form = { ...initForm }
    },
    submitHandler() {
      this.$refs.form.validate(v => {
        if (v) {
          this.updateStatus(this.form)
        }
      })
    },
    // 提交审核结果，成功后会发送一个policyOver自定义事件
    async updateStatus(formData) {
      let loadingInst 
      try {
        loadingInst = this.$loading({target: this.$refs.form.$el.parentNode.parentNode})
        const { changeStatus } = this.$api.myTask
        const { storeId } = this.$route.params
        const httpConfig = {
          headers: {
            groupId: storeId || this.storeId
          }
        }
        const params = {
          processExecId: this.processExecId,
          status: 2,
          ...formData
        }
        await changeStatus.query(params, httpConfig)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('policyOver', formData)
        this.$emit('input', false)
      } finally {
        loadingInst && loadingInst.close()
      }
    }
  },
  computed: {
    rules() {
      return [{ required: this.form.agree === '1', message: '请输入审核备注' }]
    },
    modalVisible: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .el-dialog__footer {
  padding-top: 0;
}
</style>
