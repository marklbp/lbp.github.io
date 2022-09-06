<template>
  <page-init :loading="pageInit" :message="message" :code="code">
    <router-back
      class="router-back"
      :text="label"
      v-if="$route.query.showPublish"
    >
      <router-link
        class="router-back-right el-button el-button--primary el-button--small"
        :to="`/${$route.params.storeId}/flow-start/${modelId}`"
        >启用</router-link
      >
    </router-back>
    <router-back class="router-back" :text="label" v-else>
      <span class="attr-item" v-if="categoryName && categoryName !== 'null'"
        >分类：{{ categoryName }}</span
      >
      <el-tag
        class="item-title-tag"
        type="info"
        size="small"
        v-if="status && status === '2'"
        >已停用</el-tag
      >
      <div
        class="router-back-right mr__xs mr-16"
        v-if="categoryName && categoryName !== 'null'"
      >
        <router-link
          v-if="!isStandard"
          :to="'/editor/' + $route.params.storeId + '/' + modelId + '/1'"
        >
          <el-button v-if="!isStandard" class="el-button--primary" size="small"
            >编辑</el-button
          >
        </router-link>
        <el-dropdown>
          <el-button type="primary">
            {{ isStandard ? '引用' : '更多' }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" v-if="isStandard">
            <el-dropdown-item>
              <a
                class="btn-more-action knowledge-list-btn-more-action"
                href="javascript:void(0)"
                @click="quoteTemplate($route.params.modelId)"
                >直接引用</a
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link
                class="btn-more-action knowledge-list-btn-more-action"
                :to="
                  `/editor/${$route.params.storeId}/${$route.params.modelId}/0/1`
                "
                >编辑并引用</router-link
              >
            </el-dropdown-item>
          </el-dropdown-menu>

          <el-dropdown-menu slot="dropdown" v-else>
            <el-dropdown-item>
              <a
                class="btn-more-action knowledge-list-btn-more-action"
                href="javascript:void(0)"
                v-if="status === '1'"
                @click="stop($route.params.fid)"
                >停用</a
              >
              <a
                class="btn-more-action knowledge-list-btn-more-action"
                href="javascript:void(0)"
                v-if="status === '0' || status === '2'"
                @click="publish(modelId, status)"
                >{{ status === '0' ? '发布' : '启用' }}</a
              >
            </el-dropdown-item>
            <el-dropdown-item v-if="status !== '1'">
              <a
                class="btn-more-action knowledge-list-btn-more-action"
                href="javascript:void(0)"
                @click="remove($route.params.fid)"
                >删除</a
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div></div>
      </div>
    </router-back>
    <div class="block">
      <div class="title">流程图</div>
      <div class="content">
        <flow-display
          :xml="xml"
          :message="message"
          :persons="persons"
          :hasHover="false"
          @click="clickTaskHandler"
        ></flow-display>
      </div>
    </div>
    <div class="block">
      <div class="title">相关知识</div>
      <div class="content">
        <page-init
          :loading="pageInit"
          :message="!relatedKnowledge ? '暂无数据' : ''"
          :code="0"
        >
          <knowledge-edit v-model="relatedKnowledge" :canEdit="false" />
        </page-init>
      </div>
    </div>
  </page-init>
</template>
<script>
import { getPersons } from '~/mixins'
export default {
  name: 'flow-detail',
  mixins: [getPersons],
  data() {
    return {
      pageInit: true,
      size: 100,
      xml: '',
      knowledge: '',
      message: '',
      modelId: 0,
      code: 0,
      label: '...',
      relatedKnowledge: '',
      enable: true,
      categoryName: this.$route.params.categoryName,
      isStandard: typeof this.$route.params.modelId !== 'undefined',
      status: this.$route.params.status,
      persons: []
    }
  },
  components: {
    'page-init': _ => import('~/components/page-init'),
    'router-back': _ => import('~/components/router-back'),
    'knowledge-edit': _ => import('~/components/knowledge-edit'),
    'flow-display': _ => import('~/components/flow-display')
  },
  created() {
    this.getDetail()
  },
  methods: {
    clickTaskHandler({ event, cell }) {
      if (/subflow-btn/.test(event.target.className)) {
        console.log(11)
      }
    },
    async getDetail() {
      try {
        await this.getPersons(null, null, -1)
        this.persons = JSON.parse(JSON.stringify(this.$persons))
        let { data } = await this.$api.template.detail(
          { id: this.$route.params.fid },
          { needToast: false, headers: { groupId: this.$route.params.storeId } }
        )
        this.xml = this.preParseXML(data.flowXml)
        this.relatedKnowledge = data.relatedKnowledge
        this.knowledge = data.knowledge
        this.modelId = data.modelId
        this.label = data.label
      } catch (ex) {
        this.code = ex.code
        this.message = ex.message || ex.msg
      } finally {
        this.pageInit = false
      }
    },
    preParseXML(xml) {
      xml = JSON.parse(xml)
      xml.cells.forEach(t => {
        if (t.style) {
          if (t.flow) {
            t.style.fillColor = '#ededed'
            t.style.strokeWidth = 0
            t.style.strokeColor = 'transparent'
          } else {
            t.style.strokeColor = '#999'
          }
        }
      })
      xml.tasks.forEach(t => {
        t.value = t.attrs.label
        if (t.style) {
          t.style.fillColor = '#ededed'
          t.style.strokeWidth = 0
          t.style.strokeColor = 'transparent'
        }
      })
      return JSON.stringify(xml)
    },
    // 直接引用标准模板
    async quoteTemplate(id) {
      if (!this.enable) {
        return
      }
      try {
        this.enable = false
        let data = await this.$api.template.quote(
          { id, label: this.label },
          {
            headers: { groupId: this.$route.params.storeId }
          }
        )
        if (data.success) {
          this.$message({
            message: '引用成功',
            type: 'success'
          })
          this.$router.push(
            `/${this.$route.params.storeId}/setting/operation/1`
          )
        }
      } catch (ex) {
        this.$message({
          message: ex.message || ex.msg,
          type: 'error'
        })
      } finally {
        this.enable = true
      }
    },
    // 停用模板
    async stop() {
      const modelId = this.modelId
      try {
        await this.$confirm(
          '停用该流程模版后，可再次启用。是否确认要停用该流程模版？',
          '提示',
          {
            type: 'info',
            iconClass: 'none',
            confirmButtonText: '确定停用',
            cancelButtonText: '取消',
            customClass: 'custom_class_none_icon'
          }
        )
        this.loading = true
        await this.$api.template.stop(
          { modelId },
          { headers: { groupId: this.$route.params.storeId }, needToast: false }
        )
        this.$message.success('停用成功')
        this.$router.push(`/${this.$route.params.storeId}/setting/operation`)
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
      } finally {
        this.loading = false
      }
    },
    // 发布模板
    async publish(id, status) {
      try {
        this.loading = true
        let promiseFn = this.$api.template.publish
        if (status != 0) {
          promiseFn = this.$api.template.boot
        }
        await promiseFn(status == 0 ? { id } : { modelId: id }, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
        this.$message.success(`${status == 0 ? '发布' : '启动'}成功`)
        this.$router.push(`/${this.$route.params.storeId}/setting/operation`)
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
      } finally {
        this.loading = false
      }
    },
    // 删除模板
    async remove(id) {
      try {
        await this.$confirm(
          '删除该流程模版后，不可恢复。是否确认要删除该流程模版？',
          '提示',
          {
            type: 'danger',
            iconClass: 'none',
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            customClass: 'custom_class_none_icon'
          }
        )
        this.loading = true
        await this.$api.template.remove(
          { id },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        this.$message.success('删除成功')
        this.$router.push(`/${this.$route.params.storeId}/setting/operation`)
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  margin-bottom: 16px;
  background-color: #fff;
  .title {
    height: 56px;
    line-height: 56px;
    padding-left: 32px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  .content {
    padding: 24px 32px;
  }
}
.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  height: 56px;
  line-height: 56px;
  background: rgba(250, 250, 250, 1);
  text-align: center;
  min-width: calc(100% - 240px);
}
.attr-item {
  color: #333333;
  font-size: 14px;
  margin-right: 10px;
}
.router-back-right {
  position: absolute;
  right: 0;
  .el-button--primary {
    background-color: #fff;
    border: 1px solid #3366ff;
    color: #3366ff;
    &:hover {
      border: 1px solid #ffffff;
      color: #ffffff;
      border-radius: 2px;
    }
  }
}
/deep/ {
  .mr-16 {
    margin-right: 16px !important;
    &:hover {
      outline: none !important;
    }
    &:focus {
      outline: none !important;
    }
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
  .el-message-box__message {
    padding-left: 12px !important;
  }
}
</style>
