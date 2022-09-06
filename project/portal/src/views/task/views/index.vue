<template>
  <div class="page-inner">
    <router-back text="我的任务" :disableRoute="true" />

    <!-- <el-tabs v-model="tabActive" @tab-click="tabClick">
      <el-tab-pane label="我的任务" name="/task/myTask"></el-tab-pane>
      <el-tab-pane label="我的流程" name="/task/myProcess"></el-tab-pane>
    </el-tabs> -->
    <el-dropdown class="btn-new">
      <el-button type="primary">
        <i class="font-icon add"></i>
        新建
        <i class="font-icon down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown" :show-timeout="0">
        <ul class="popover-box">
          <li class="popover-item" @click="showSelectStore('task')">
            <span class="font-icon batch"></span>
            <section>
              <b>独立任务</b>
              <div>单节点任务，不依赖于其他任务</div>
            </section>
          </li>
          <li class="popover-item" @click="showSelectStore('process')">
            <span class="font-icon framework"></span>
            <section>
              <b>流程任务</b>
              <div>多节点串行任务，需要多人协作</div>
            </section>
          </li>
        </ul>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="view-warpper" style="padding-bottom: 24px;">
      <router-view />
    </div>
    <el-dialog
      :visible.sync="selectStoreVisible"
      width="494px"
      title="选择店铺"
      append-to-body
      @close="handleClose"
    >
      <el-form :model="formData" label-position="top" ref="form">
        <el-form-item
          label="所属店铺"
          prop="storeId"
          :rules="{ message: '请选择所属店铺', required: true }"
        >
          <el-select v-model="formData.storeId" style="width:100%;">
            <el-option
              v-for="shop in shopList"
              :value="shop.id"
              :label="shop.groupName"
              :key="shop.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectStoreVisible = false" type="text"
          >取 消</el-button
        >
        <el-button type="primary" @click="create">下一步</el-button>
      </span>
    </el-dialog>
    <process-dialog v-model="showProcessDialog" :storeId="formData.storeId" />
  </div>
</template>
<script>
export default {
  name: 'task',
  components: {
    'process-dialog': _ => import('./process-dialog'),
    'router-back': _ => import('~/components/router-back')
  },
  data() {
    return {
      tabActive: '0',
      showCreateDlg: false,
      selectStoreVisible: false,
      showProcessDialog: false,
      createType: 'task',
      formData: {
        storeId: ''
      },
      tabOptions: [
        { name: '我的任务', id: '0' },
        { name: '我的流程', id: '1' },
        { name: '店铺任务', id: '2' },
        { name: '店铺流程', id: '3' }
      ]
    }
  },
  created() {
    const { path } = this.$route
    this.tabActive = path
  },
  methods: {
    tabClick(e) {
      this.$router.push({
        path: e.name
      })
    },
    handleClose() {
      this.$refs.form.resetFields()
    },
    showSelectStore(type) {
      this.createType = type
      this.selectStoreVisible = true
    },
    create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.createType === 'task') {
            this.$router.push(`/${this.formData.storeId}/task/create`)
          } else {
            this.showProcessDialog = true
          }
        }
      })
    }
  },
  computed: {
    shopList() {
      return this.$store.state.STORE_LIST || []
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown-menu {
  margin-top: 6px;
}
/deep/ .popper__arrow {
  display: none !important;
}
/deep/ .el-form-item__label {
  padding: 0;
}
.el-form-item {
  margin-bottom: 0;
}
.popover-box {
  padding: 4px 24px;
  .popover-item {
    padding: 16px 22px;
    list-style: none;
    width: 280px;
    height: 70px;
    display: flex;
    align-items: center;
    color: #333333;
    cursor: pointer;
    .font-icon {
      font-size: 30px;
      margin-right: 19px;
    }
    &:hover {
      background: rgba(51, 102, 255, 0.05);
      color: #3366ff;
      div {
        color: #3366ff;
      }
    }

    b {
      font-size: 14px;
    }
    div {
      font-size: 12px;
      color: #999999;
    }
  }
}
.page-inner {
  position: relative;
  display: flex;
  flex-direction: column;

  .view-warpper {
    flex: 1;
  }
  .btn-new {
    position: absolute;
    right: 0;
    z-index: 1;
    top: -4px;
    .font-icon {
      &.down {
        margin-left: 6px;
        font-size: 12px;
      }
      &.add {
        margin-right: 3px;
        font-size: 14px;
      }
    }
  }
}
</style>
