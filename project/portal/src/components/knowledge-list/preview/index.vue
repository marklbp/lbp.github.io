<template>
  <page-init
    :loading="pageLoading"
    :code="code"
    :message="message"
    style="height: 100%;"
  >
    <el-container class="knowledgePreview">
      <el-header>
        <div class="header-left flex-item-center">
          <div>
            <img class="logo" src="~/assets/img/headerbar/portal-logo.png" />
          </div>
          <div class="title_limit">{{ showData.title }}</div>
        </div>
      </el-header>
      <el-main>
        <div class="article">
          <div class="title">{{ showData.title }}</div>
          <div class="information">
            分类：{{ showData.typeName }}&nbsp;&nbsp;/&nbsp;&nbsp;创建人：{{
              showData.creator
            }}&nbsp;&nbsp;/&nbsp;&nbsp;最近更新：{{
              $helper.formatTime(showData.modifyDate)
            }}
          </div>
          <div class="article-body" v-html="showData.content"></div>
        </div>
      </el-main>
    </el-container>
  </page-init>
</template>
<script>
export default {
  name: 'knowledgePreview',
  components: {
    'page-init': _ => import('~/components/page-init')
  },
  data() {
    const storeId = this.$route.params.storeId
    return {
      noDataType: 0,
      html: '',
      noArticle: false,
      showData: {
        content: '',
        creator: '',
        groupId: 1,
        id: 17,
        modifyDate: 0,
        sources: '1',
        title: '',
        typeName: ''
      },
      pageLoading: true,
      code: 0,
      message: ''
    }
  },
  watch: {},
  mounted() {
    if (this.$route.params.storeId === '0') {
      this.showDetail(this.$route.params.id)
    } else {
      this.showArticle(this.$route.params.id)
    }
  },
  methods: {
    async showDetail(id) {
      try {
        const { data } = await this.$api.knowledge.showDetail(
          { id },
          {
            needToast: false
          }
        )
        if (data) {
          const showData = this.showData
          showData.title = data.title
          showData.content = ''
          showData.creator = data.creator
          showData.typeName = data.typeName
          showData.modifyDate = data.modifyDate
            ? data.modifyDate
            : data.createDate
          this.$nextTick(() => {
            showData.content = data.content
            this.$set(this.showData, 'content', data.content)
          })
        } else {
          this.code = 404
          this.message = '您好，你访问的文章已被删除或不存在'
        }
      } catch (error) {
        this.code = error.code
        this.message =
          error.message || error.msg || '您好，你访问的文章已被删除或不存在'
      } finally {
        this.pageLoading = false
      }
    },
    async showArticle(id) {
      try {
        const { data } = await this.$api.knowledge.selectDetailById(
          { id },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (data) {
          const showData = this.showData
          showData.title = data.title
          showData.content = ''
          showData.creator = data.creator
          showData.typeName = data.typeName
          showData.modifyDate = data.modifyDate
            ? data.modifyDate
            : data.createDate
          this.$nextTick(() => {
            showData.content = data.content
            this.$set(this.showData, 'content', data.content)
          })
        } else {
          this.code = 404
          this.message = '您好，你访问的文章已被删除或不存在'
        }
      } catch (error) {
        this.code = error.code
        this.message =
          error.message || error.msg || '您好，你访问的文章已被删除或不存在'
      } finally {
        this.pageLoading = false
      }
    },
    // 删除模板
    async remove(id) {
      try {
        await this.$confirm(
          '删除文章后，流程模板中配置的该文章链接将无法访问，您确定要删除吗？',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            cancelButtonClass: 'knowledgePreviewCancelButtonClass',
            confirmButtonClass: 'knowledgePreviewConfirmButtonClass'
          }
        )
        this.isLoading = true
        await this.$api.knowledge.del(
          { ids: [Number(this.$route.params.id)] },
          { headers: { groupId: this.$route.params.storeId }, needToast: false }
        )
        this.$message.success('删除成功')
        window.setTimeout(() => {
          this.goBack()
        }, 1500)
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e.message || e)
        }
      } finally {
        this.isLoading = false
      }
    },
    goBack() {
      this.$router.back()
      window.opener = null
      window.open('', '_self')
      window.close()
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
.knowledgePreviewCancelButtonClass {
  border: 0 none !important;
}
.knowledgePreviewConfirmButtonClass {
  background-color: #ed4040 !important;
  border: 0 none !important;
}
.knowledgePreview {
  position: relative;
  min-width: 960px;
  height: 100%;
  .el-button--primary {
    margin-left: 0;
  }
  .btn-more-action {
    padding-left: 0;
    margin-left: 14px;
  }
  .flex-item-center {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
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
    .title_limit {
      max-width: 80%;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-main {
    padding-top: 40px;
    padding-left: 12.5%;
    padding-right: 12.5%;
    text-align: center;
    .article {
      color: #333333;
      text-align: left;
      .title {
        font-size: 20px;
        font-weight: 600;
      }
      .information {
        padding-top: 16px;
        color: #999999;
        font-size: 12px;
      }
      .article-body {
        line-height: 28px;
        padding-top: 28px;
        word-wrap: break-word;
      }
    }
    .not-font {
      padding-top: 12%;
      color: #666666;
      font: 14px;
      img {
        margin-bottom: 24px;
      }
    }
  }
  /deep/ .article-body {
    img {
      max-width: 100% !important;
    }
  }
  .article-body {
    img {
      max-width: 100% !important;
    }
  }
}
</style>
