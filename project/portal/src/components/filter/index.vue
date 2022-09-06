<template>
  <div
    class="filter-container"
    :class="{ active: activeFilter, 'filter-line': showFilteMore }"
    :style="{ height }"
  >
    <div class="filter-main">
      <div class="filter-main-inner">
        <slot name="filter_main"></slot>
        <div
          v-if="showInput"
          class="filter-input"
          :class="{ active: activeFilter }"
        >
          <el-input
            v-model="searchName"
            @change="searchByName"
            clearable
            :placeholder="inputPlaceholder"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </div>
      </div>
      <a
        href="javacript:void(0)"
        class="btn-toggle-filter-more"
        v-if="showFilteMore"
        @click="activeFilter = !activeFilter"
      >
        <i class="font-icon filter"></i>
        <span>筛选</span>
        <i class="font-icon down" :class="{ active: activeFilter }"></i>
      </a>
      <a
        href="javascript:;"
        class="btn-download"
        @click="downloadHandler"
        v-if="hasExport"
      >
        <i class="font-icon export"></i>
        <span>导出</span>
      </a>
    </div>
    <el-row
      class="filter-more"
      :gutter="24"
      v-if="showFilteMore"
      ref="filterMore"
    >
      <slot name="filter-more"></slot>
      <el-col :lg="8" :md="8" :xm="12">
        <el-button size="mini" @click="resetFilter">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'filter-compt',
  props: {
    showInput: {
      type: Boolean,
      default: _ => true
    },
    inputPlaceholder: {
      type: String,
      default: _ => '输入内容后按回车键搜索'
    },
    showFilteMore: {
      type: Boolean,
      default: _ => true
    },
    params: {
      type: Object,
      default: _ => ({})
    },
    hasExport: {
      type: Boolean,
      default: false
    },
    hasStore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchName: '',
      activeFilter: true
    }
  },
  computed: {
    height() {
      return this.activeFilter ? 'auto' : '56px'
    },
    exportFileName() {
      const { path } = this.$route
      const { taskTab, view } = this.$route.query
      const tabText = parseInt(taskTab, 10) === 0 ? '与我相关' : '店铺'
      const typeText = view === 'task' ? '任务' : '流程'
      const t = new Date()
      const tText = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('-')
      return (path === '/task/myTask' ? '我的任务' : tabText + typeText) + tText
    }
  },
  methods: {
    searchByName(v) {
      this.$emit('input-search', v)
    },
    resetFilter() {
      this.reset = true
      this.searchName = ''
      this.$emit('reset-search')
    },
    async downloadHandler() {
      try {
        const httpConfig = {
          headers: {
            groupId: this.$route.params.storeId
          }
        }
        let params
        if (this.$route.query.view === 'process') {
          params = Object.assign({}, this.params, {
            filed: +this.params.isHideFile ? 0 : null,
            type: this.params.searchType,
            groupId: this.$route.params.storeId
          })
          delete params.isHideFile
          delete params.searchType
          if (this.hasStore) {
            params.type = 4
          }
        } else {
          params = Object.assign({}, this.params, {
            searchType: !this.hasStore ? this.params.searchType : '4'
          })
        }
        const { storeId } = this.$route.params
        const { view } = this.$route.query
        const apiName = !storeId
          ? 'exportAllTask'
          : 'export' + (view === 'process' ? 'Process' : 'Task')
        const res = await this.$api.myTask[apiName](params, {
          ...httpConfig,
          responseType: 'blob'
        })
        if (!res.data) {
          throw new Error(res.message || '服务异常，请稍后再试')
        }
        this.$helper.downloadByBinary(
          res.data,
          `${this.exportFileName}.xls`,
          'application/vnd.ms-excel;charset=utf-8'
        )
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 2px;
  height: 56px;
  overflow: hidden;
  transition: 0.25s;
  &.active {
    // height: auto
  }
  &.filter-line {
    position: relative;
    .filter-main-inner {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        background-color: #e8e8e8;
      }
    }
  }
  .filter-main {
    display: flex;
    justify-content: flex-end;
    &-inner {
      display: flex;
      flex: 1;
    }
  }
  .filter-input {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    height: 57px;
    padding-right: 16px;
    /deep/ .el-input {
      width: 270px;
    }
  }
  .btn-toggle-filter-more {
    display: inline-block;
    width: 115px;
    text-align: center;
    height: 56px;
    line-height: 56px;
    color: #999;
    font-size: 14px;
    span {
      margin-left: 7px;
      margin-right: 12px;
    }
    .font-icon {
      display: inline-block;
      font-size: 18px;
      transition: 0.25s;
      &:last-child {
        font-size: 12px;
      }
      &.active {
        transform: rotate(180deg);
      }
    }
  }
  .btn-download {
    @extend .btn-toggle-filter-more;
    height: 57px;
    border-left: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  .filter-more {
    padding: 24px 20px;
    /deep/ .label {
      margin-bottom: 4px;
      font-size: 12px;
      color: #666;
    }
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .el-col {
      margin-top: 16px;
      @media only screen and (min-width: 992px) {
        &.el-col-md-8.el-col-lg-8:nth-of-type(1),
        &.el-col-md-8.el-col-lg-8:nth-of-type(2),
        &.el-col-md-8.el-col-lg-8:nth-of-type(3) {
          margin-top: 0;
        }
      }
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        height: 49px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }
    }
  }
}
// .filter-action{
//   border-right: 1px solid #e8e8e8;
// }
.btn-toggle-filter-more {
  border-left: 1px solid #e8e8e8;
}
</style>
