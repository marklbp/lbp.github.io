<template>
  <div class="service-form-item">
    <el-form-item
      :label="itemData.name"
      v-if="itemData"
      :rules="rules"
      prop="formDatas[0].fieldValue"
    >
      <service-form-select :data="itemData" />
    </el-form-item>
  </div>
</template>

<script>
import serviceFormSelect from '../service-form-select'
export default {
  name: 'service-form-item',
  components: {
    serviceFormSelect
  },
  props: {
    itemData: {
      type: Object,
      default: _ => null
    }
  },
  data() {
    return {}
  },
  // created() {},
  mounted() {},
  methods: {},
  computed: {
    rules() {
      const rules = []
      if (this.itemData.required) {
        rules.push({
          required: true,
          message: '必填'
        })
      }
      return rules
    }
  }
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped></style>
