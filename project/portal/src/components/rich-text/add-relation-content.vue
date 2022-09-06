<template>
  <el-dialog
    title="添加关联内容"
    v-if="showDialog"
    :visible.sync="showDialog"
    width="720px"
    :before-close="toggleDialog"
    append-to-body
  >
    <el-row :gutter="24" class="filter">
      <el-col :md="8" :lg="8" :xm="12">
        <div class="label">来源</div>
        <el-select v-model="source" style="width: 100%">
          <el-option
            v-for="{ id, name } in sources"
            :key="id"
            :value="id"
            :label="name"
          />
        </el-select>
      </el-col>
      <el-col :md="8" :lg="8" :xm="12">
        <div class="label">分类</div>
        <el-select
          v-model="filter.type"
          style="width: 100%"
          :loading-text="categoriesLoadingText"
          :loading="categories.length <= 1"
        >
          <el-option
            v-for="{ id, name } in categories"
            :key="id"
            :value="id"
            :label="name"
          />
        </el-select>
      </el-col>
      <el-col :md="8" :lg="8" :xm="12">
        <div class="label">标题</div>
        <el-input
          v-model="filter.title"
          style="width: 100%"
          suffix-icon="el-icon-search"
        />
      </el-col>
      <el-col :xm="12" style="text-align: right; margin-top: 16px;">
        <el-button size="mini" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <portal-table
      module-name="knowledge"
      api-name="selectPageList"
      :headers="headers"
      :filter="filter"
      :loading="loading"
      :refresh="refresh"
      @loading="handlerLoading"
      @select="selectChange"
      layout="prev, pager, next"
      @done="done"
    >
      <el-table-column type="selection" width="55" reserve-selection>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" min-width="100px">
        <template slot-scope="scope">
          {{ cutName(scope.row.title) }}
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="分类" />
      <el-table-column prop="createDate" label="创建时间">
        <template slot-scope="scope">{{
          $helper.formatTime(scope.row.createDate)
        }}</template>
      </el-table-column>
    </portal-table>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="toggleDialog">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div> -->
    <div slot="footer" class="dialog-footer rich-text-container-dialog-footer">
      <div class="footer-left">
        共 <span class="blue">{{ totalCount }}</span> 条<!-- ，当前本页已选择
        <span class="blue">{{ checkedCount }}</span> 篇 -->
      </div>
      <div class="footer-right">
        <el-button @click="toggleDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {
    'portal-table': _ => import('~/components/table')
  },
  data() {
    return {
      headers: this.$route.params.storeId
        ? { groupId: this.$route.params.storeId }
        : {},
      filter: {
        title: '',
        type: -1,
        sources: 1,
        groupId: this.$route.params.storeId
      },
      loading: true,
      refresh: false,
      categories: [{ id: -1, name: '全部' }],
      sources: [{ id: 0, name: '系统文章' }, { id: 1, name: '店铺文章' }],
      categoriesLoadingText: '加载中',
      showDialog: false,
      totalCount: 0,
      source: 1 /*,
      checkedCount: 0*/
    }
  },
  mounted() {
    if (!Vue.prototype.$RichText) {
      Vue.prototype.$RichText = {}
    }
    Vue.prototype.$RichText.addRelationContent = function(cb) {
      this.addRelationContentCallback = cb
      this.toggleDialog()
    }.bind(this)
  },
  watch: {
    showDialog(v) {
      if (v) {
        this.getCategories()
        //this.checkedCount = 0
      }
    },
    source(v) {
      let groupId = 0
      if (v > 0) {
        groupId = this.$route.params.storeId
      }
      /* Object.assign(this.headers, {
        groupId
      }) */
      Object.assign(this.filter, {
        sources: v,
        groupId
      })
    }
  },
  methods: {
    confirm() {
      this.toggleDialog()
      let content = this.rows
        ? this.rows.reduce((s, { url, title }) => {
            s += `<a href="${url}" target="_blank">${title}</a>，`
            return s
          }, '')
        : ''
      this.$emit('confirm', this.rows)
      content = content.length > 0 ? content.slice(0, -1) : content
      if (this.addRelationContentCallback) {
        this.addRelationContentCallback(content)
      }
    },
    selectChange(val) {
      this.rows = val
      //this.checkedCount = val.length
    },
    getCategories() {
      let params = {
        /*dict: {
          groupId: this.$route.params.storeId
        }*/
      }
      let headers = this.$route.params.storeId
        ? {
            headers: {
              groupId: this.$route.params.storeId
            }
          }
        : {}
      this.$api.knowledge
        .selectListByCode(params, { needToast: false, ...headers })
        .then(({ data }) => {
          this.categories = [{ id: -1, name: '全部' }].concat(
            data.map(({ dictKey: id, dictValue: name }) => ({ id, name }))
          )
        })
        .catch(e => {
          this.categoriesLoadingText = e.message || e.msg
        })
    },
    reset() {
      this.filter = {
        title: '',
        type: -1,
        sources: 1,
        groupId: this.$route.params.storeId
      }
    },
    handlerLoading(v) {
      if (v + '' === '0') {
        this.loading = true
      } else {
        this.loading = false
        this.refresh = false
      }
    },
    toggleDialog() {
      this.showDialog = !this.showDialog
    },
    done(obj) {
      this.totalCount =
        typeof obj.total !== 'undefined' ? obj.total : this.totalCount
    },
    cutName(name) {
      return name.length > 20 ? name.substring(0, 21) + '...' : name
    }
  }
}
</script>
<style lang="scss" scoped>
.filter {
  margin-bottom: 16px;
  .label {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #666;
  }
}
.table-list {
  border: 1px solid #e8e8e8;
  /deep/ .el-pagination {
    &__total {
    }
  }
}
/deep/.el-table {
  .el-table__body-wrapper {
    padding-left: 0;
    padding-right: 0;
    .cell {
      color: #333;
      font-size: 12px;
    }
  }
}
.rich-text-container-dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footer-left {
    font-size: 14px;
    .blue {
      color: #3366ff;
    }
  }
}
</style>
