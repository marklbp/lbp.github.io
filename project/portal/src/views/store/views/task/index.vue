<template>
  <div class="page-inner">
    <router-back text="任务管理" :disableRoute="true" />
    <div class="btn-new">
      <el-dropdown>
        <el-button type="primary">
          <i class="font-icon add"></i>
          新建
          <i class="font-icon down"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" :show-timeout="0">
          <ul class="popover-box">
            <router-link to="task/create" tag="li" class="popover-item">
              <span class="font-icon batch"></span>
              <section>
                <b>独立任务</b>
                <div>单节点任务，不依赖于其他任务</div>
              </section>
            </router-link>
            <li @click="openProcessDlg" class="popover-item">
              <span class="font-icon framework"></span>
              <section>
                <b>流程任务</b>
                <div>多节点串行任务，需要多人协作</div>
              </section>
            </li>
          </ul>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tabs v-model="tabActive" @tab-click="tabClick" style="padding-bottom: 24px;">
      <el-tab-pane label="与我有关" name="0">
        <my-task v-if="0 == tabActive" />
      </el-tab-pane>
      <el-tab-pane label="店铺任务" name="2">
        <store-task v-if="2 == tabActive" />
      </el-tab-pane>
    </el-tabs>
    <process-dialog v-model="showProcessDialog" />
  </div>
</template>
<script>
export default {
  name: 'store-task-management',
  components: {
    'my-task': _ => import('./myTask'),
    'store-task': _ => import('./storeTask'),
    'process-dialog': _ => import('../../components/process-dialog'),
    'router-back': _ => import('~/components/router-back')
  },
  data() {
    return {
      tabActive: '0',
      showCreateDlg: false,
      showProcessDialog: false,
      tabOptions: [
        { name: '我的任务', id: '0' },
        { name: '我的流程', id: '1' },
        { name: '店铺任务', id: '2' },
        { name: '店铺流程', id: '3' }
      ]
    }
  },
  created() {
    const { query } = this.$route
    if (!query.taskTab) {
      this.$route.query.taskTab = '0'
    }
    this.tabActive = query.taskTab || '0'
  },
  methods: {
    openProcessDlg() {
      this.showProcessDialog = true
    },
    toPlace2File() {
      const { storeId } = this.$route.params
      this.$router.push(`/${storeId}/place-on-file`)
    },
    tabClick(e) {
      const { path, query } = this.$route
      this.$router.push({
        path,
        query: {
          taskTab: e.name,
          myTab: '0',
          view: query.view
        }
      })
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
.breadcrumb {
  margin-bottom: 8px !important;
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
}
.el-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  /deep/ &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: visible;
    .el-tab-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
  /deep/ .el-tabs__nav.is-top {
    margin-left: 32px;
  }

  /deep/ .el-tabs__item {
    &.is-active {
      font-weight: normal;
    }
  }
}
.btn-new {
  position: absolute;
  right: 0;
  z-index: 1;
  top: -4px;
  .place-on-file {
    font-size: 14px;
    color: #333;
    font-weight: 600;
    cursor: pointer;
    margin-right: 25px;
    i {
      font-weight: 600;
      font-size: 15px;
      margin-right: 2px;
    }
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
.btn-box {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  .btn-a {
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
/deep/ {
  .el-tabs__item {
    color: #666666;
    font-weight: bold !important;
  }
  .is-active {
    color: #333;
    font-weight: bold !important;
  }
}
</style>
