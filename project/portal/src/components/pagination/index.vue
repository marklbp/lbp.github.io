<template>
  <el-pagination
    :current-page="page"
    :page-size="size"
    :page-sizes="sizes"
    :layout="layout"
    :total="total"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  />
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      default: 1
    },

    total: {
      type: Number,
      default: 0
    },

    size: {
      type: Number,
      default: 10
    },

    sizes: {
      type: Array,
      default() {
        return [10, 20, 50]
      }
    },

    layout: {
      type: String,
      default: 'total, sizes, jumper, prev, pager, next'
    }
  },

  methods: {
    onSizeChange(val) {
      this.$emit('sizeChange', val)
    },

    onCurrentChange(val) {
      this.$emit('pageChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-pagination {
  width: 100%;
  height: 56px;
  background-color: #fff;
  padding: 12px 30px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  /deep/ .el-pagination__sizes {
    position: absolute;
    left: 32px;
    top: 12px;
  }
}
</style>
