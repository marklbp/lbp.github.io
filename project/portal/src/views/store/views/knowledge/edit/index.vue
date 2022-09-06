<template>
  <el-container class="knowledgeEdit">
    <el-header>
      <div class="header-left flex-item-center">
        <div>
          <img class="logo" src="~/assets/img/headerbar/portal-logo.png" />
        </div>
        <div class="title_limit">
          {{
            typeof this.$route.params.id == 'undefined'
              ? '新建文章'
              : '编辑文章'
          }}
        </div>
      </div>
      <div class="header-right flex-item-center">
        <el-button size="small" @click="goBack">
          取消
        </el-button>
        <el-button
          v-if="saveAvailable"
          type="primary"
          size="small"
          @click="save"
          :loading="saveLoading"
        >
          {{ buttonText }}
        </el-button>
        <el-button v-else type="primary" size="small" :loading="saveLoading">
          {{ buttonText }}
        </el-button>
      </div>
    </el-header>
    <el-main style="height: 100%;">
      <div class="title-box">
        <div class="category category-left">
          <el-input
            class="filter__main_item_title_input"
            placeholder="页面标题"
            v-model="addPrame.title"
            maxlength="60"
            clearable
          >
          </el-input>
        </div>
        <div class="category category-right">
          <el-select
            class="mr__m"
            v-model="addPrame.type"
            placeholder="请先选择分类"
            @change="createCategory"
            filterable
          >
            <el-option
              v-for="(option, index) in categoryList"
              :key="'categoryOptions' + index"
              :label="option.dictValue"
              :value="option.dictKey"
            />
          </el-select>
        </div>
      </div>
      <div v-if="showRich" style="height: 85%;">
        <rich-text
          style="height: 100%;"
          v-model="addPrame.content"
          maxlength="20000"
          show-word-limit
        />
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'knowledgeEdit',
  components: {
    /* Empty */
    'rich-text': _ => import('~/components/rich-text')
  },
  data() {
    const storeId = this.$route.params.storeId
    const addOrUpdate = typeof this.$route.params.id !== 'undefined'
    const addPrame = {
      groupId: this.$route.params.storeId,
      title: '',
      type: null,
      content: '',
      sources: 1
    }
    if (addOrUpdate) {
      addPrame.title = ''
      addPrame.id = this.$route.params.id
    }
    return {
      saveLoading: false,
      buttonText: '保存',
      noDataType: 0,
      categoryList: [],
      addPrame,
      showRich: false,
      saveAvailable: true
    }
  },
  watch: {},
  mounted() {
    this.selectListByCode()
    if (typeof this.$route.params.id !== 'undefined') {
      // 是编辑操作页面
      this.showArticle(this.$route.params.id)
    }
  },
  methods: {
    async showArticle(id) {
      try {
        const detail = await this.$api.knowledge.selectDetailById(
          { id },
          {
            headers: { groupId: this.$route.params.storeId }
          }
        )
        if (detail.success) {
          this.addPrame.title = detail.data.title
          this.addPrame.content = ''
          this.$nextTick(() => {
            this.addPrame.content = detail.data.content
            this.$set(this.addPrame, 'content', detail.data.content)
            setTimeout(() => {
              this.$nextTick(() => {
                this.showRich = true
              })
            }, 0)
          })
          if (detail.data.type !== 'OTHER') {
            this.addPrame.type = detail.data.type
          }
        } else {
          this.showRich = true
        }
      } catch (error) {
        this.showRich = true
      }
    },
    async save() {
      if ((this.addPrame.title + '').replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$message.error('请输入标题')
        return
      }
      this.saveLoading = true
      this.buttonText = '保存中'
      try {
        let params = {
          ...this.addPrame
        }
        if (this.addPrame.type === null) {
          params.type = 'OTHER'
        }
        let data = await this.$api.knowledge.addArticle(
          {
            ...params
          },
          {
            headers: { groupId: this.$route.params.storeId }
          }
        )
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.saveAvailable = false
        setTimeout(() => {
          this.goBack()
        }, 1500)
      } catch (ex) {
      } finally {
        this.saveLoading = false
        this.buttonText = '保存'
      }
    },
    goBack() {
      this.$router.back()
      window.opener = null
      window.open('', '_self')
      window.close()
    },
    async createCategory(val) {
      await this.saveDict(val)
    },
    async saveDict(val) {
      val = (val + '').replace(/(^\s*)|(\s*$)/g, '')
      const arr = ['', -1, '-1']
      if (arr.indexOf(val) >= 0) {
        this.$message({
          message: '请输入正确的分类',
          type: 'warning'
        })
        this.addPrame.type = null
      }
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
    // 删除模板
    // 查询知识库分类列表接口
    async selectListByCode() {
      try {
        let { data: categoryList } = await this.$api.knowledge.selectListByCode(
          {},
          {
            needToast: false
          }
        )
        if (typeof categoryList === 'string') {
          categoryList = JSON.parse(categoryList)
        }
        categoryList = categoryList.filter(item => item.dictKey !== 'OTHER')
        this.categoryList = categoryList
      } catch (ex) {
        this.$message.error(ex.message || ex)
      } finally {
        if (typeof this.$route.params.id === 'undefined') {
          this.showRich = true
        }
      }
    },
    async remove(id) {
      try {
        await this.$confirm(
          '删除文章后，流程模板中配置的该文章链接将无法访问，您确定要删除吗？',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            cancelButtonClass: 'knowledgeEditCancelButtonClass',
            confirmButtonClass: 'knowledgeEditConfirmButtonClass'
          }
        )
        this.isLoading = true
        await this.$api.template.remove(
          { id },
          { headers: { groupId: this.$route.params.storeId } }
        )
        this.$message.success('删除成功')
      } catch (e) {
        this.$message.error(e.message || e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.flex-item-center {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.knowledgeEditCancelButtonClass {
  border: 0 none !important;
}
.knowledgeEditConfirmButtonClass {
  background-color: #ed4040 !important;
  border: 0 none !important;
}
.knowledgeEdit {
  position: relative;
  min-width: 960px;
  height: 100%;
  .title_limit {
    max-width: 80%;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .filter__main_item_title_input {
    width: 100%;
  }
  .logo {
    width: 25px;
    display: block;
    margin-right: 18px;
  }
  .el-header {
    @include flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
    .header-left {
      width: 80%;
      @include flex;
    }
    .header-right {
      @include flex;
    }
  }
  .el-main {
    padding-top: 0px;
    padding-left: 12.5%;
    padding-right: 12.5%;
    text-align: left;
    .title-box {
      .category {
        padding: 16px 0;
        display: inline-block;
      }
      .category-left {
        width: 500px;
        margin-right: 16px;
      }
      .category-right {
        min-width: 150px;
      }
    }
  }
  /deep/ .ke-edit {
    height: auto !important;
  }
  .ke-edit {
    height: auto !important;
  }
}
</style>
