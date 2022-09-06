<template>
  <div class="knowledgeList">
    <h2 class="title">知识库</h2>
    <div class="Main">
      <filter-container
        @input-search="searchByTitle"
        @reset-search="resetSearch"
      >
        <template slot="filter_main">
          <div class="control_topbar" v-if="type === 'store'">
            <router-link
              :to="'/' + $route.params.storeId + '/knowledge/add'"
              target="_blank"
            >
              <el-button type="primary" size="small" icon="el-icon-plus">
                新建文章
              </el-button>
            </router-link>
            <el-button
              size="small"
              :disabled="this.selectedList.length === 0"
              @click="removeList"
              >删除</el-button
            >
          </div>
        </template>
        <template slot="filter-more">
          <el-col :lg="8" :md="8" :xm="12">
            <div class="label">分类</div>
            <el-select
              class="mr__m"
              v-model="searchParams.type"
              placeholder="全部"
              filterable
            >
              <el-option
                v-for="(option, index) in categoryList"
                :key="'categoryOptions' + index"
                :label="option.dictValue"
                :value="option.dictKey"
              />
            </el-select>
          </el-col>
          <el-col :lg="8" :md="8" :xm="12"
            ><div class="el-col-placeholder">placeholder</div></el-col
          >
        </template>
      </filter-container>

      <div class="TableWrapper">
        <portal-table
          :module-name="moduleName"
          :api-name="apiName"
          :headers="headers"
          :filter="searchParams"
          :loading="loading"
          :keys="keys"
          :refresh="refresh"
          @loading="handlerLoading"
          @select="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" v-if="type === 'store'">
          </el-table-column>
          <el-table-column
            prop="title"
            label="文章标题"
            min-width="200px"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- {{ cutName(scope.row.title) }} -->
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="分类">
            <template slot-scope="scope">
              {{ scope.row.typeName }}
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人">
            <template slot-scope="scope">
              {{ filterDesc(scope.row.creator) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="updateTime"
            label="更新时间"
            :column-key="genRandomStr()"
          >
            <template slot-scope="scope">
              <span style="white-space: nowrap;">
                {{
                  $helper.formatTime(
                    scope.row.modifyDate
                      ? scope.row.modifyDate
                      : scope.row.createDate
                  )
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :align="type === 'store' ? 'center' : 'right'"
          >
            <template slot-scope="scope">
              <div style="text-align: right !important;">
                <router-link
                  :to="
                    `/${
                      typeof $route.params.storeId !== 'undefined'
                        ? $route.params.storeId
                        : '0'
                    }/knowledge/preview/${scope.row.id}`
                  "
                  target="_blank"
                >
                  查看
                </router-link>
                <el-dropdown class="table__dropdown" v-if="type === 'store'">
                  <a class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </a>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <router-link
                        class="btn-more-action knowledge-list-btn-more-action"
                        :to="
                          `/${$route.params.storeId}/knowledge/edit/${scope.row.id}`
                        "
                        target="_blank"
                      >
                        编辑
                      </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <a
                        class="btn-more-action knowledge-list-btn-more-action"
                        href="javascript:void(0)"
                        @click="remove(scope.row.id)"
                      >
                        删除
                      </a>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </portal-table>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '~/components/pagination'
import Empty from '~/components/empty'
import { genRandomStr } from '~/utils'

export default {
  name: 'knowledgeList',
  components: {
    'portal-table': _ => import('~/components/table'),
    'filter-container': _ => import('~/components/filter')
  },
  props: {
    type: {
      type: String,
      default: 'store'
    }
  },
  data() {
    const searchParams = {
      sources: 1, // 店铺端传1，P端传0
      type: '-1', // 分类dictKey -1代表全部
      title: ''
    }
    const storeId = this.$route.params.storeId
    if (typeof storeId != 'undefined' && this.type === 'store') {
      searchParams.groupId = storeId
    } else {
      searchParams.sources = 0
    }
    return {
      list: [],
      categoryList: [],
      searchParams,
      pageTotalInfo: {
        totalCount: 10,
        totalPage: 1
      },
      isLoading: true,
      noDataType: 0,
      selectedList: [],
      headers:
        this.type === 'store'
          ? {
              groupId: this.$route.params.storeId
            }
          : null,
      keys: { records: 'records', total: 'totalCount' },
      loading: true,
      refresh: false,
      moduleName: this.type === 'store' ? 'knowledge' : 'standardKnowledge',
      apiName:
        this.type === 'store' ? 'selectPageList' : 'selectStandardknowledgeList'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.selectListByCode()
      this.selectPageList()
    },
    genRandomStr,
    searchByTitle(val) {
      this.searchParams.title = val
    },
    handleSelectionChange(val) {
      this.selectedList = val
    },
    resetSearch() {
      this.searchParams.title = ''
      this.searchParams.type = '-1'
      this.$nextTick(_ => {
        this.selectPageList()
      })
    },
    // 查询知识库分类列表接口
    async selectListByCode() {
      try {
        let { data: categoryList } = await this.$api.knowledge.selectListByCode(
          {
            /* dict: {
              groupId: this.$route.params.storeId
            } */
          },
          {
            needToast: false
          }
        )
        if (typeof categoryList === 'string') {
          categoryList = JSON.parse(categoryList)
        }
        if (!categoryList.some(item => item.dictKey == '-1')) {
          categoryList.unshift({
            createDate: null,
            deleted: null,
            dictKey: '-1',
            dictTypeId: 1,
            dictValue: '全部',
            id: -1,
            remark: null
          })
        }
        this.categoryList = categoryList
      } catch (ex) {}
    },
    selectPageList() {
      this.refresh = true
    },
    handlerLoading(v) {
      if (v == 0) {
        this.loading = true
      } else {
        this.loading = false
        this.refresh = false
      }
    },
    async saveDict(val) {
      val = (val + '').replace(/(^\s*)|(\s*$)/g, '')
      if (val === '') {
        this.$message({
          message: '请输入正确的分类',
          type: 'warning'
        })
        return
      }
      if (val == -1 || this.categoryList.some(item => item.dictValue == val)) {
        return
      }
      try {
        const data = await this.$api.knowledge.saveDict(
          {
            dict: {
              dictKey: this.createRandomStr(),
              dictValue: val
            }
          },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (data.success) {
          this.selectListByCode()
        }
      } catch (e) {
        this.$message.error(e.message || e)
      } finally {
        this.isLoading = false
      }
    },
    async createCategory(val) {
      await this.saveDict(val)
    },
    createRandomStr() {
      let str =
        Math.random()
          .toString(36)
          .substr(2) +
        Math.random()
          .toString(36)
          .substr(2)
      if (this.categoryList.some(item => str == item.dictKey)) {
        return this.createRandomStr()
      } else {
        return str
      }
    },
    cutName(name) {
      return name.length > 20 ? name.substring(0, 21) + '...' : name
    },
    filterDesc(val) {
      return this.cutName(val || '')
    },
    filterCreator(name) {
      return name || ''
    },
    async doRemove(type, id) {
      try {
        await this.$confirm(
          '删除文章后，流程模板中配置的该文章链接将无法访问，您确定要删除吗？',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            cancelButtonClass: 'knowledgeListCancelButtonClass',
            confirmButtonClass: 'knowledgeListConfirmButtonClass'
          }
        )
        this.isLoading = true
        const ids =
          type === 0
            ? [Number(id)]
            : this.selectedList.map(item => Number(item.id))
        await this.$api.knowledge.del(
          { ids },
          { headers: { groupId: this.$route.params.storeId }, needToast: false }
        )
        this.$message.success('删除成功')
        await this.selectPageList()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || e)
        }
      } finally {
        this.isLoading = false
      }
    },
    // 删除模板old
    remove(id) {
      this.doRemove(0, id)
    },
    removeList() {
      this.doRemove(1)
    }
  }
}
</script>
<style lang="scss">
.knowledgeListCancelButtonClass {
  border: 0 none !important;
}
.knowledgeListConfirmButtonClass {
  background-color: #ed4040 !important;
  border: 0 none !important;
}
.knowledgeList {
  min-width: 960px;
  .title {
    font-size: 20px;
    padding-left: 32px;
    padding: 0 0 26px 32px;
    margin: 0;
  }
  .el-dialog__header {
    border-bottom: 1px solid #d9d9d9;
  }
  .create-dlg__content {
    a {
      width: 207px;
      height: 207px;
      border-radius: 2px;
      border: 1px solid rgba(217, 217, 217, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 16px;
      .font-icon {
        margin-bottom: 25px;
        font-size: 46px;
      }
      &:hover {
        border-color: #3366ff;
        background-color: rgba(51, 102, 255, 0.05);
        color: #3366ff;
      }
    }
  }
  .Main {
    min-width: 960px;
    .el-tabs__item {
      font-size: 16px;
      color: #666;
      &.is-active {
        color: #333;
        font-weight: 550;
      }
    }
    .is-top.el-tabs__nav-wrap {
      padding-left: 16px;
      padding-right: 16px;
    }
    .el-tabs__active-bar {
      margin: 0 auto;
    }
  }
  .Filter {
    min-width: 960px;
    width: 100%;
    padding: 0 32px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    .filter__action {
      max-width: 130px;
      /* flex: 0 0 130px; */
    }
    .filter__main {
      flex: 1;
      text-align: left;
      padding-bottom: 24px;
      &_item {
        display: inline-block;
        width: 293px;
        &_title {
          padding: 25px 0 9px 0;
          color: #666666;
          font-size: 12px;
          &_input {
            width: 275px;
          }
        }
      }
      .el-select {
        width: 275px;
      }
    }
  }
  .control_topbar {
    background-color: #fff;
    padding: 10px 32px;
    height: 57px;
  }
  .TableWrapper {
    margin-top: 16px;
    min-width: 960px;
    .table__dropdown {
      margin-left: 16px;
      cursor: pointer;
      a {
        font-size: 12px;
      }
    }
    /deep/ .el-table__header-wrapper {
      padding-left: 16px;
      padding-right: 16px;
      border: 1px solid #ebeef5;
      background-color: #fafafa;
      .el-table__header {
        width: auto !important;
        th {
          border-bottom: 0 none;
          background-color: #fafafa;
          .cell {
            padding-left: 16px;
            padding-right: 16px;
            color: #333;
          }
        }
      }
    }
    /deep/ .el-table__body-wrapper {
      padding-left: 16px;
      padding-right: 16px;
      .el-table__body {
        width: auto !important;
      }
      .cell {
        padding-left: 16px;
        padding-right: 16px;
        font-size: 12px;
        color: #333;
      }
    }
  }
  .el-dropdown-link {
    &:hover {
      outline: none !important;
    }
    &:focus {
      outline: none !important;
    }
  }
}
.el-col-placeholder {
  height: 1px;
  border: 0 none;
  opacity: 0;
  overflow: hidden;
}
.el-dropdown-menu__item:hover,
.el-dropdown-menu__item:focus {
  .knowledge-list-btn-more-action {
    background-color: #f5f5f5 !important;
  }
}
.knowledge-list-btn-more-action {
  color: #333333;
}
</style>
