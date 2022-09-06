<template>
  <div class="collapse-bar">
    <span class="collapse" @click="toggleShow">
      <i class="icon" :class="`el-icon-arrow-${value ? 'down' : 'right'}`" />
      {{ title }}
    </span>
    <div class="collapse-inner" :class="scrollLeft !== 0 ? 'shadow' : ''"></div>
  </div>
</template>

<script>
export default {
  name: 'collapse-bar',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    scrollLeft: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  // data() {
  //   return {}
  // },
  // created() {},
  // mounted() {},
  methods: {
    toggleShow() {
      this.$emit('input', !this.value)
    }
  }
  // computed: {},
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.collapse-bar {
  position: relative;
  border-left: 1px solid #e8e8e8;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 23px;
  background: rgb(250, 250, 250);
  border-bottom: 1px solid #e8e8e8;
  color: #606266;
  .collapse {
    position: relative;
    z-index: 1;
  }
  .collapse-inner {
    width: 315px;
    position: absolute;
    width: 315px;
    height: 100%;
    top: 0;
    left: 0;
    &.shadow {
      border-right: 1px solid #e8e8e8;
      box-shadow: 5px 0 10px -6px rgba(0, 0, 0, 0.12);
    }
  }
  &:hover {
    background: #ebf0ff;
  }
  .collapse {
    padding-left: 10px;
    cursor: pointer;
  }
}
</style>
