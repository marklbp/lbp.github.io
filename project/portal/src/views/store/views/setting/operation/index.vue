<template>
  <div class="container">
    <div class="container_inner">
      <h2 class="title" v-if="type === '0'">流程模板设置</h2>
      <router-back text="标准模板设置" style="margin-bottom: 26px;" v-else />
      <div
        class="search"
        :style="{
          'justify-content': type === '0' ? 'space-between' : 'flex-end'
        }"
      >
        <div class="search_left" v-if="type === '0'">
          <el-dropdown @command="handleCommand">
            <el-button icon="el-icon-plus" size="small" type="primary">
              新建<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>
                <router-link
                  class="create-new-template"
                  :to="`/editor/${$route.params.storeId}`"
                >
                  新建空白模板
                </router-link>
              </el-dropdown-item> -->
              <el-dropdown-item command="0">
                新建空白模板
              </el-dropdown-item>
              <el-dropdown-item command="1">
                从店铺模版库引用
              </el-dropdown-item>
              <el-dropdown-item command="2">
                从标准模版库引用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text">
            <router-link
              :to="'/' + $route.params.storeId + '/setting/operation' + '/1'"
            >
              标准模板库
            </router-link>
          </el-button>
        </div>
        <el-input
          v-model="searchWords"
          placeholder="输入内容后按回车键搜索"
          style="width:254px;"
          @change="searchHandler"
          ><i slot="prefix" class="el-input__icon el-icon-search"></i
        ></el-input>
      </div>
      <div class="dialog-content">
        <el-tabs
          v-if="items.length"
          tabPosition="left"
          class="slider-tab"
          v-model="itemIndex"
          @tab-click="clickHandler"
        >
          <el-tab-pane
            v-for="(val, i) in items"
            :key="i + ''"
            :label="val.name"
          ></el-tab-pane>
        </el-tabs>
        <div class="all-items" ref="itemWrap">
          <page-init :loading="loading" :message="message">
            <div
              class="item-detail"
              v-for="(val, k) in items"
              :key="k"
              :ref="k"
            >
              <h4>{{ val.name }}</h4>
              <ul>
                <li v-for="(item, i) in val.list" :key="i">
                  <div class="item-left">
                    <div class="item-title">
                      <div class="item-title-draft" v-if="item.status === 0">
                        【草稿】
                      </div>
                      <div class="item-title-text">
                        <overflow-tip :words="item.name"></overflow-tip>
                      </div>
                      <el-tag
                        class="item-title-tag"
                        type="info"
                        size="small"
                        v-if="item.status == 2"
                      >
                        已停用
                      </el-tag>
                    </div>
                    <p class="item-instruc" v-if="item.description">
                      <overflow-tip :words="item.description"></overflow-tip>
                    </p>
                    <p class="item-time">
                      {{ $helper.formatTime(item.updateTime) }}
                    </p>
                  </div>
                  <div class="item-right">
                    <span
                      class="el-dropdown-link"
                      @click="checkoutHandle(item)"
                    >
                      查看 </span
                    >&nbsp;
                    <el-dropdown v-if="type === '0'">
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <router-link
                            class="btn-more-action knowledge-list-btn-more-action"
                            :to="
                              '/editor/' +
                                $route.params.storeId +
                                '/' +
                                item.modelId +
                                '/1'
                            "
                          >
                            编辑
                          </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.status == 0 || item.status == 2"
                        >
                          <a
                            class="btn-more-action knowledge-list-btn-more-action"
                            href="javascript:void(0)"
                            @click="publish(item.modelId, item.status)"
                            >{{ item.status == 0 ? '发布' : '启用' }}</a
                          >
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.status != 0 && item.status != 2"
                        >
                          <a
                            class="btn-more-action knowledge-list-btn-more-action"
                            href="javascript:void(0)"
                            @click="stop(item.modelId)"
                            >停用</a
                          >
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.status == 0 || item.status == 2"
                        >
                          <a
                            class="btn-more-action knowledge-list-btn-more-action"
                            href="javascript:void(0)"
                            @click="remove(item.id)"
                            >删除</a
                          >
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown v-else>
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <a
                            class="btn-more-action knowledge-list-btn-more-action"
                            href="javascript:void(0)"
                            @click="quoteTemplate(item)"
                            >直接引用</a
                          >
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <router-link
                            class="btn-more-action knowledge-list-btn-more-action"
                            :to="
                              `/editor/${$route.params.storeId}/${item.modelId}/0/1`
                            "
                            >编辑并引用</router-link
                          >
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </li>
              </ul>
            </div>
          </page-init>
        </div>
      </div>
    </div>
    <template-dialog v-model="showTemplateDialog" />
    <template-dialog :isStandard="true" v-model="showTemplateDialog1" />
  </div>
</template>
<script>
export default {
  name: 'TaskOperationManagement',
  data() {
    return {
      items: [],
      itemIndex: '0',
      searchWords: '',
      loading: true,
      message: '',
      enable: true,
      showTemplateDialog: false,
      showTemplateDialog1: false,
      timer: null,
      timer1: null
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '0'
    }
  },
  components: {
    pageInit: _ => import('~/components/page-init'),
    overflowTip: _ => import('~/components/overflow-tip'),
    'router-back': _ => import('~/components/router-back'),
    'template-dialog': _ => import('../../../components/template-dialog')
  },
  methods: {
    closeHandle() {
      this.$emit('input', false)
    },
    checkoutHandle(template) {
      // 点击流程列表跳转
      const status =
        '/' + (template.status !== undefined ? template.status : 'null')
      const categoryName =
        status +
        '/' +
        (template.categoryName !== undefined ? template.categoryName : 'null')
      const pro =
        this.type === '0' ? categoryName : categoryName + '/' + template.modelId
      this.$router.push(
        '/' +
          this.$route.params.storeId +
          '/template-detail/' +
          template.id +
          pro
      )
    },
    useHandle(template) {
      // 点击启用按钮跳转
      this.$router.push(
        '/' + this.$route.params.storeId + '/flow-start/' + template.modelId
      )
    },
    searchHandler() {
      this.getAll()
    },
    scrollHandler() {
      // 楼层效果处理
      if (this.timer || this.preventScrollHandler) return
      this.timer = setTimeout(() => {
        this.timer = null
        const scrollTop = this.$refs.itemWrap.scrollTop
        let currentIndex = 0
        for (let i = this.items.length - 1; i > -1; i--) {
          if (this.$refs[i][0] && scrollTop > this.$refs[i][0].offsetTop - 30) {
            currentIndex = i
            break
          }
        }
        this.itemIndex = currentIndex + ''
      }, 100)
    },
    clickHandler(item) {
      for (let i = 0; i < this.items.length; i++) {
        if (i + '' === item.index) {
          this.preventScrollHandler = true
          this.timer1 = setTimeout(() => {
            this.preventScrollHandler = false
          })
          this.$refs.itemWrap.scrollTop = this.$refs[i][0].offsetTop - 16
          break
        }
      }
    },
    getProcessData(params) {
      const api =
        this.type === '0' ? this.$api.template.list : this.$api.template.list1
      return api(params, {
        headers: { groupId: this.$route.params.storeId }
      })
    },
    getAllCategory(params) {
      return (
        this.allCategory ||
        this.$api.flowSetting.getCategoryList(params, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
      )
    },
    getAll() {
      // 获取所有数据
      this.loading = true
      Promise.all([
        this.getAllCategory(),
        this.getProcessData({
          pageSize: -1,
          groupId: this.$route.params.storeId,
          name: this.searchWords,
          status: this.type === '0' ? -1 : 1
        })
      ])
        .then(arr => {
          this.allCategory = arr[0]
          const items = arr[0].data.map(val => {
            return { name: val.name, list: [] }
          })
          arr[1].data.records.forEach(val => {
            for (let item of items) {
              if (item.name === val.categoryName) {
                item.list.push(val)
                break
              }
            }
          })
          this.items = items.filter(val => val.list && val.list.length)
          this.loading = false
          if (!this.items.length) {
            this.message = '暂无数据'
          } else {
            this.message = ''
          }
        })
        .catch(err => {
          this.loading = false
          this.message = err.msg || err.message
          console.log(err)
        })
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
        this.getAll()
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
        this.loading = false
      }
    },
    // 停用模板
    async stop(modelId) {
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
        this.getAll()
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
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
          { headers: { groupId: this.$route.params.storeId }, needToast: false }
        )
        this.$message.success('删除成功')
        this.getAll()
      } catch (ex) {
        if (ex.message || ex.msg) {
          this.$message({
            message: ex.message || ex.msg,
            type: 'error'
          })
        }
        this.loading = false
      }
    },
    // 直接引用标准模板
    async quoteTemplate(item) {
      const modelId = item.modelId
      const name = item.name
      if (!this.enable) {
        return
      }
      try {
        this.enable = false
        let data = await this.$api.template.quote(
          { id: modelId, label: name },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (data.success) {
          this.$message({
            message: '引用成功',
            type: 'success'
          })
          this.$router.push(`/${this.$route.params.storeId}/setting/operation`)
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
    openProcessDlg() {
      this.showTemplateDialog = true
    },
    openProcessDlg1() {
      this.showTemplateDialog1 = true
    },
    init() {
      const { itemWrap } = this.$refs
      itemWrap && itemWrap.addEventListener('scroll', this.scrollHandler)
      this.getAll()
    },
    destory() {
      clearTimeout(this.timer)
      clearTimeout(this.timer1)
      const { itemWrap } = this.$refs
      itemWrap && itemWrap.removeEventListener('scroll', this.scrollHandler)
    },
    handleCommand(command) {
      if (command === '1') {
        this.openProcessDlg()
      } else if (command === '2') {
        this.openProcessDlg1()
      } else {
        this.$router.push(`/editor/${this.$route.params.storeId}`)
      }
      console.log('command===', command)
    }
  },
  mounted() {
    this.init()
  },
  beforeDestory() {
    this.destory()
  },
  watch: {
    $route(val, old) {
      this.destory()
      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  &_inner {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0;
    top: 0;
    width: auto !important;
    box-sizing: border-box;
    /deep/ {
      .slider-tab .el-tabs__header.is-left {
        margin-right: 32px;
      }
      .slider-tab .el-tabs__nav-wrap.is-left {
        padding-top: 20px;
      }
      .el-tabs__item {
        color: #666666ff;
      }
      .el-tabs__item.is-active {
        color: #3366ffff;
        font-weight: normal;
      }
      .el-tabs__item {
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.title {
  font-size: 20px;
  padding-left: 32px;
  padding: 0 0 26px 32px;
  margin: 0;
}
.search {
  height: 56px;
  background: white;
  margin-bottom: 16px;
  display: flex;
  padding: 0 32px;
  align-items: center;
  border-radius: 2px;
  &_left {
    display: flex;
    align-items: center;
  }
}
.slider-tab {
  height: 100%;
  margin-left: 34px;
}
.dialog-content {
  background: white;
  border-radius: 2px;
  overflow: hidden;
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 107px;
  display: flex;
  /* margin-bottom: 32px; */
}
.all-items {
  overflow: auto;
  flex: 1;
  height: 100%;
  padding-top: 32px;
  padding-right: 30px;
}
.item-detail {
  &:before {
    content: '';
    clear: both;
    display: block;
  }
  > h4 {
    font-size: 16px;
    color: #666;
    margin: 0 0 16px;
  }
  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-width: 650px;
    > li {
      width: 48%;
      overflow: hidden;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #d9d9d9;
      margin-bottom: 16px;
      box-sizing: border-box;
      padding: 0 16px 0 24px;
      border-radius: 4px;
      &:hover {
        /* border: 1px solid #3366ffff; */
      }
      .item-left {
        overflow: hidden;
        flex-grow: 1;
        white-space: nowrap;
        margin-right: 10px;
      }
      .item-right {
        width: 86px;
        flex-shrink: 0;
        flex-basis: 86px;
        flex-grow: 0;
        white-space: nowrap;
      }
    }
  }
}
.item-title {
  display: flex;
  font-size: 14px;
  color: #333;
  line-height: 1;
  margin: 0px;
  word-wrap: break-word;
  align-items: center;
  &-draft {
    color: #1d44ff;
  }
  &-text {
    overflow: hidden;
    white-space: nowrap;
    margin-right: 10px;
  }
  &-tag {
    border-radius: 14px;
    width: 54px;
    flex-shrink: 0;
    flex-basis: 54px;
    flex-grow: 0;
    white-space: nowrap;
  }
}
.item-instruc {
  font-size: 12px;
  color: #333333;
  width: 100%;
  margin: 10px 0 0 0;
  word-wrap: break-word;
}
.item-time {
  font-size: 12px;
  color: #999999;
  width: 100%;
  margin: 10px 0 0 0;
  word-wrap: break-word;
}
.empty-notice {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.el-dropdown-link {
  color: #3366ff;
  font-size: 12px;
  cursor: pointer;
}
.el-col-placeholder {
  height: 1px;
  border: 0 none;
  opacity: 0;
  overflow: hidden;
}
.create-new-template {
  color: #333333;
  &:hover {
    color: #3366ffff;
    background-color: #f5f5f5 !important;
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
