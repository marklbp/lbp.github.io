<template>
  <div class="container">
    <div class="container_inner">
      <router-back :text="roleState" style="margin-bottom: 26px;" />
      <el-form
        :model="roleForm"
        :rules="rules"
        ref="roleForm"
        label-width="100px"
        class="roleForm"
        label-position="top"
      >
        <div class="input-top">
          <span class="new-txt">创建信息</span>
          <el-form-item label="角色名称" prop="name">
            <el-row>
              <el-col :span="10">
                <el-input
                  v-model="roleForm.name"
                  placeholder="请输入内容"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div class="input-bottom">
          <el-form-item>
            <el-tabs
              v-model="activeTagIndex"
              @tab-click="handleClick"
              :stretch="true"
            >
              <el-tab-pane
                v-for="item in listLabel"
                :key="item.id"
                :label="item.name"
                :name="`${item.id}`"
              >
                <template v-for="item in treeData">
                  <div
                    class="tree-table"
                    :key="item.id"
                    v-show="String(item.id) === activeTagIndex"
                  >
                    <div class="border-table">
                      <el-tree
                        :data="item.children"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        :ref="`${item.id}`"
                        highlight-current
                        :props="defaultProps"
                        :render-content="renderContent"
                        @check-change="handleCheckChange"
                        :default-checked-keys="checkedkeys[String(item.id)]"
                      ></el-tree>
                    </div>
                  </div>
                </template>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </div>
        <div class="btn-bottom">
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="onSubmit('roleForm')"
              >确定</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    routerBack: _ => import('~/components/router-back')
  },
  data() {
    return {
      roleState: this.$route.query.id ? '编辑角色' : '新建角色',
      roleForm: {
        name: '',
        id: null,
        roleName: '',
        shopId: '',
        functionIds: []
      },
      rules: {
        name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      roleListOptions: [],
      roleListData: [],
      activeName: '1',
      tabId: 0,
      listLabel: [],
      activeTagIndex: '1',
      treeDataObj: {},
      checkedkeys: {},
      list: []
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    // 获取选中id列表
    getTreeId() {
      const promise = this.$api.groupUser.getTreeId(
        {
          roleId: this.$route.query.id ? this.$route.query.id : '',
          parentId: ''
        },
        this.httpconfig
      )
      promise
        .then(res => {
          if (res.data) {
            this.checkedkeys = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    handleCheckChange() {},
    handleClick(tab, event) {
      this.getRoleTabsLabelApi(Number(tab.name))
    },
    // 获取角色列表tab标签
    getRoleLabelApi() {
      const promise = this.$api.groupUser.getRoleLabel(
        {
          roleId: this.$route.query.id ? this.$route.query.id : ''
        },
        this.httpconfig
      )
      promise
        .then(res => {
          this.roleListData = res.data
          this.roleListData.map(item => {
            this.listLabel.push({
              id: item.id,
              name: item.name
            })
          })
          this.tabId = this.listLabel[0].id
          this.activeTagIndex = String(this.listLabel[0].id)
          this.listLabel.map(item => {
            this.getRoleTabsLabelApi(item.id)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    //点击 tab切换获取列表
    getRoleTabsLabelApi(idData) {
      if (this.treeDataObj.hasOwnProperty(this.activeTagIndex)) return
      const promise = this.$api.groupUser.getRoleTabsLabel(
        {
          roleId: '',
          parentId: idData
        },
        this.httpconfig
      )
      promise
        .then(res => {
          if (!res.data.length) return
          this.treeData.push(res.data[0])
          this.treeDataObj[res.data[0].id] = true
          this.$nextTick(() => {
            this.changeCss()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSubmit(roleForm) {
      this.$refs[roleForm].validate(valid => {
        if (valid) {
          let reflist = Object.keys(this.treeDataObj)
          this.list = []
          for (var i in reflist) {
            this.list.push(this.$refs[reflist[i]][i].getCheckedKeys(true))
          }

          // this.list = this.list.flat()
          this.list = this.list.reduce((acc, val) => acc.concat(val), [])
          var arr = new Set(this.list)
          this.list = Array.from(arr)
          if (!this.list.length) {
            this.$message.error('请至少选择一个角色权限')
            return
          }

          const promise = this.$api.groupUser.addRole(
            {
              name: this.roleForm.name,
              functionIds: this.list,
              groupId: this.$route.params.storeId,
              id: this.$route.query.id
            },
            this.httpconfig
          )
          promise
            .then(res => {
              if (this.$route.query.id) {
                this.$message({ message: '编辑角色成功!', type: 'success' })
                this.$router.go(-1)
              } else {
                this.$message({ message: '新建角色成功!', type: 'success' })
                this.$router.go(-1)
              }
            })
            .catch(err => err)
        } else {
          return false
        }
      })
    },
    //
    renderContent(h, { node, data, store }) {
      let classname = ''
      if (node.data.treeLabel === 2) {
        classname = 'levelparent'
      }
      if (
        node.data.treeLabel != 1 &&
        node.data.treeLabel != 2 &&
        node.childNodes.length == 0
      ) {
        classname = 'levelname'
      }
      return <p class={classname}>{node.label}</p>
    },
    changeCss() {
      var levelName = document.getElementsByClassName('levelname') // levelname是上面的最底层节点的名字
      var borderLevel = document.getElementsByClassName('levelparent')
      var levelNames = document.getElementsByClassName('levelnames')
      for (var b = 0; b < borderLevel.length; b++) {
        borderLevel[b].parentNode.style['border-top'] = '1px solid #e8e8e8'
        borderLevel[b].parentNode.style['margin-left'] = '20px'
        borderLevel[b].parentNode.style['margin-right'] = '20px'
      }
      for (var i = 0; i < levelName.length; i++) {
        levelName[i].parentNode.style.cssFloat = 'left'
        levelName[i].parentNode.style.styleFloat = 'left'
      }
      for (var j = 0; j < levelNames.length; j++) {
        levelNames[j].parentNode.style['width'] = '100%'
      }
    }
  },

  mounted() {
    this.httpconfig = {
      headers: {
        groupId: this.$route.params.storeId
      }
    }

    //获取树列表标签接口
    this.getRoleLabelApi()
    if (this.$route.query.id) {
      this.getTreeId()
    }
    if (this.$route.query.roleName) {
      this.roleForm.name = this.$route.query.roleName
    } else {
      this.roleForm.name = ''
    }
  },
  created() {}
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
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__item {
        color: #666666ff;
      }
      .el-tabs__item.is-active {
        color: #333;
      }
      .el-tabs__item {
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-select {
        width: 100%;
      }
      .el-tabs .el-tabs__nav .is-top.el-tabs__item {
        height: 50px;
      }
      .el-tree-node__content {
        height: 50px;
      }
      .el-tree-node__children .el-tree-node__content {
        margin-top: 0 !important;
      }
      .el-tree-node__children .el-tree-node__children .el-tree-node__content {
        padding-left: 0px !important;
        margin-left: 54px;
        padding-right: 20px;
        height: 40px;
        margin-bottom: 10px;
        width: 180px;
        //float: left;
      }
      .el-tree-node__children
        .el-tree-node__children
        .el-tree-node__children
        .el-tree-node__content {
        margin-left: 70px;
      }
    }
  }
  .roleForm {
    margin-bottom: 76px;
  }
  .input-top {
    background: #fff;
    padding: 24px 30px 1px 30px;
    .new-txt {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 16px;
    }
  }
  /deep/ .el-form-item__label {
    line-height: 0;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    padding-top: 30px;
  }
  .input-bottom {
    /deep/ {
      .el-form-item {
        padding: 10px 0 0px 0;
        background: #fff;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
  }
  .btn-bottom {
    height: 50px;
    padding: 10px 0px 10px 0px;
    text-align: center;
    position: fixed;
    right: 0;
    background: #fafafa;
    bottom: 0;
    z-index: 10;
    /deep/ {
      .el-form-item__content {
        width: calc(100vw - 240px);
        position: absolute;
        right: 0;
        background: #fafafa;
        height: 56px;
        padding: 10px;
        bottom: 0;
      }
      .el-button {
        width: 80px;
      }
    }
  }
}
</style>
