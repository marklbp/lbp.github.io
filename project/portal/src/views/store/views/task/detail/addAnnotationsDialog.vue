<template>
  <div>
    <el-dialog title="添加批注" :visible.sync="visable" width="30%">
      <span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onCancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'addAnnotationsDialog',
  components: {},
  props: ['value'],
  data() {
    return {
      textarea: ''
    }
  },
  methods: {
    onCancel() {
      this.visable = false
    }
  },
  computed: {
    visable: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
