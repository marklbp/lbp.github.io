<template>
  <div class="page-control">
    <el-select
      style="position:absolute;left:32px;"
      v-model="pageSize"
      @change="pageSizeChangeHandler"
    >
      <el-option
        v-for="{ id, name } in $constant.PAGE_SIZES"
        :key="id"
        :value="id"
        :label="name"
      ></el-option>
    </el-select>
    <el-pagination
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="pageChangeHandler"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1
    }
  },
  props: {
    pageData: {
      type: Object,
      default: () => ({})
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  watch: {
    pageData: {
      deep: true,
      handler(val) {
        this.currentPage = val.currentPage
      }
    }
  },
  methods: {
    pageSizeChangeHandler() {
      this.currentPage = 1
      this.pageChangeHandler()
    },
    pageChangeHandler() {
      this.$emit('pageChange', {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-control {
  color: #999;
  font-size: 14px;
  height: 56px;
  background: white;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  padding-right: 20px;
  /deep/ {
    .el-pagination {
      color: #999999ff;
    }
    .el-pagination__jump {
      float: left;
      margin-left: 0;
      margin-right: 30px;
    }
    .el-pagination__rightwrapper {
      float: left;
    }
    .el-pagination__total {
      margin-right: 16px;
    }
  }
}
.total-number {
  margin-right: 16px;
  > span {
    color: #333;
  }
}
.to-page {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  > span {
    width: 48px;
    height: 32px;
    margin: 0 5px;
    border: 1px solid #d9d9d9;
  }
}
</style>
