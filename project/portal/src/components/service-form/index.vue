<template>
  <div class="service-form">
    <el-form :model="model" v-if="model" :rules="rules" ref="form">
      <service-form-item
        v-for="(item, i) in formDatas"
        :key="item.name + i"
        :itemData="item"
      />
    </el-form>
  </div>
</template>

<script>
import serviceFormItem from './service-form-item'
export default {
  name: 'service-form',
  components: {
    serviceFormItem
  },
  props: {
    formDatas: {
      type: Array,
      default: _ => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {}
    }
  },
  provide() {
    return {
      parentDisabled: this.disabled
    }
  },
  // created() {},
  mounted() {
    console.log(this.model)
  },
  methods: {
    validForm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, o) => {
          if (valid) {
            resolve(valid)
          } else {
            resolve(valid)
          }
        })
      }).catch(e => {})
    },
    getFormData(needRaw) {
      const resData = this.formDatas.map(item => {
        const { fieldValue, fieldName, name, value } = item
        const obj = { fieldValue, fieldName, name }
        if (value) {
          obj.value = value
        }
        return obj
      })
      if (needRaw) {
        return resData
      } else {
        return JSON.stringify(resData)
      }
    },
    resolveFormData() {}
  },
  computed: {
    model() {
      if (this.formDatas.length) {
        return {
          formDatas: this.formDatas
        }
      }
      return null
    }
  },
  watch: {
    formDatas() {
      console.log(this.formDatas, 'watch')
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped></style>
