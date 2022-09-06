<template>
  <div class="service-form-select">
    <el-select
      v-model="data.fieldValue"
      ref="select"
      v-if="data.dataSource"
      :disabled="parentDisabled"
      filterable
    >
      <el-option
        v-for="item in data.dataSource"
        :key="item.modelId"
        :disabled="!!item.disable"
        :label="item.label"
        :value="item.modelId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'service-form-select',
  // components: {},
  props: {
    data: {
      type: Object,
      default: _ => ({})
    }
  },
  data() {
    return {
      value: ''
    }
  },
  inject: ['parentDisabled'],
  // created() {},
  mounted() {
    this.handleLabel()
  },
  methods: {
    handleLabel() {
      const selectRef = this.$refs.select
      this.$nextTick(() => {
        if (selectRef) {
          this.data.value = selectRef.selectedLabel
        }
      })
    }
  },
  computed: {},
  watch: {
    data: {
      deep: true,
      handler() {
        this.handleLabel()
      }
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.service-form-select {
  .el-select {
    width: 100%;
  }
}
</style>
