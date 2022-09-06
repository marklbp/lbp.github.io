<template>
  <div class="detail-pane" :class="{ active: collapse }">
    <span
      class="btn-collapse-wrap"
      @click="toggleCollapse"
      :title="`${collapse ? '展开' : '收起'}`"
    >
      <span class="btn-collapse-wrap-inner">
        <i
          class="font-icon"
          :class="`double-${collapse ? 'left' : 'right'}`"
        ></i>
      </span>
    </span>
    <div class="detail-pane-inner">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'side-slide-pane',
  props: {
    collapse: {
      type: Boolean,
      defaulte: _ => false
    }
  },
  model: {
    prop: 'collapse'
  },
  data() {
    return {}
  },
  methods: {
    toggleCollapse() {
      this.$emit('input', !this.collapse)
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-pane {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
  width: 479px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  transition: 0.5s;
  &-inner {
    position: relative;
    height: 100%;
    z-index: 1;
    overflow: auto;
    background-color: #fff;
  }
  &.active {
    right: -479px;
  }
}
.btn-collapse {
  &-wrap {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: -20px;
    width: 20px;
    height: 44px;
    background-color: #fff;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    z-index: -1;
    cursor: pointer;
    &-inner {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0px;
      width: 100%;
      height: 84px;
      overflow: hidden;
      &:after,
      &:after {
        position: absolute;
        width: 100%;
        height: 40px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        content: '';
        transform: rotate(-45deg) translate(-29px, 44px);
        background-color: #fff;
      }
      &:before {
        position: absolute;
        width: 100%;
        height: 40px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        content: '';
        transform: rotate(45deg) translate(3px, -13px);
        background-color: #fff;
      }
      i {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.2);
        left: 0;
        height: 44px;
        background-color: #fff;
        z-index: 2;
        line-height: 44px;
        text-align: center;
        color: #bababa;
        font-size: 12px;
      }
    }
  }
}
</style>
