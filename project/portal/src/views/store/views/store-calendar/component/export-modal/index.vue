<template>
  <el-dialog
    title="导出报表"
    @close="closeHandler"
    @open="modalOpenHander"
    :visible.sync="modalVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="400px"
  >
    <el-form label-position="top" ref="form">
      <p>请选择您要导出的报表内容</p>
      <el-checkbox-group v-model="exportFileds">
        <el-checkbox label="goalsShowTag">业务目标</el-checkbox>
        <el-checkbox label="activityShowTag">活动</el-checkbox>
      </el-checkbox-group>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button
        type="primary"
        :disabled="!exportFileds.length"
        @click="submitHandler"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 控制模态框显示
    value: {
      type: Boolean,
      default: false
    },
    // 该父级查看的字段
    parentFildeds: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      exportFileds: []
    }
  },
  methods: {
    // 模态框打开时继承日历的显示状态
    modalOpenHander() {
      this.exportFileds = this.parentFildeds.slice()
    },
    // 关闭模态框
    closeHandler() {
      this.$emit('close')
    },
    // 导出
    submitHandler() {
      this.$emit('exported', this.exportFileds)
    }
  },
  computed: {
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

<style></style>
