<template>
  <div class="portal-calendar-header">
    <!-- header $refs 可以同步滚动条 -->
    <el-table :data="tableData" border style="width: 100%" ref="table">
      <el-table-column
        label="项目"
        :fixed="isFixed"
        :resizable="false"
        :width="205"
      ></el-table-column>
      <!-- <el-table-column
        :fixed="isFixed"
        :resizable="false"
        label="每日目标"
        :width="120"
        prop="labelStr"
      ></el-table-column>-->
      <el-table-column
        label="合计/平均"
        prop="numerical"
        :fixed="isFixed"
        :resizable="false"
        :width="110"
      ></el-table-column>
      <el-table-column
        v-for="item in scaleData"
        align="center"
        :resizable="false"
        :key="item.day"
        :label="`${item.day}日 ${item.weekDay}`"
        :width="columnWidth"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'calendar-header',
  components: {},
  props: {
    scaleData: {
      type: Array,
      default: _ => []
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  inject: ['calendar'],
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    columnWidth() {
      return this.calendar.columnWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.portal-calendar-header {
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 122;
  // padding-right: 6px;
  /deep/ .el-table {
    .el-table__body-wrapper {
      display: none;
    }
  }
}
</style>
