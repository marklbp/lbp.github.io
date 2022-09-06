<template>
  <div class="drag_row">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'dragRow',
  components: {},
  data() {
    return {}
  },
  props: {
    row: {
      type: Array
    },
    overComs: {
      type: Object
    },
    inCommonRow: {
      type: Boolean
    }
  },
  mounted() {},
  computed: {
    /* overItem() {
      const item = this.overComs.item
      return item || null
    },
    overRow() {
      const row = this.overComs.row
      return row || null
    },
    hoverRow() {
      return this.overRow === this.row
    },
    fullRow() {
      return !this.inCommonRow && this.row.length === 7
    } */
  },
  beforeDestroy() {}
}
</script>
<style lang="scss" scoped>
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.drag_row {
  @include flex;
  @include border-box;
  /* &_box {
    @include flex;
    @include border-box;
  } */
  &_holder {
    width: 100%;
    height: 16px;
    background-color: #f5f5f5;
  }
}
/* .hover_row {
  .wd_0 {
    outline-color: rgba(51, 102, 255, 1);
  }
}
.full_row {
  .wd_0 {
    outline-color: rgba(51, 102, 255, 0) !important;
    background-color: transparent !important;
  }
} */
</style>
