<template>
  <el-select
    v-loadmore="loadMoreHandler"
    v-model="selectItem"
    @visible-change="toggleHandler"
    @change="changeHandler"
    style="width:100%;"
  >
    <el-option
      :style="{ 'text-align': isCenter ? 'center' : null }"
      v-for="({ name, id, disabled, isCenter }, i) in options"
      :key="i"
      :label="name"
      :value="id"
      :disabled="disabled"
    ></el-option>
  </el-select>
</template>
<script>
import { throttle } from '~/utils/util'
export default {
  data() {
    return {
      selectItem: ''
    }
  },
  props: {
    optionList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectWrap = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        function scrollHandler() {
          const arriveBottom =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (arriveBottom) {
            binding.value()
          }
        }
        selectWrap.addEventListener('scroll', throttle(scrollHandler))
      }
    }
  },
  methods: {
    loadMoreHandler() {
      this.$emit('loadmore')
    },
    toggleHandler(v) {
      v && this.optionList.length <= 1 && this.$emit('loadmore')
    },
    changeHandler(v) {
      this.$emit('input', v)
    }
  },
  computed: {
    options() {
      return this.loading
        ? this.optionList.concat({
            name: '加载中...',
            id: '1111122222222',
            disabled: true,
            isCenter: true
          })
        : this.optionList
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.selectItem = v
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
