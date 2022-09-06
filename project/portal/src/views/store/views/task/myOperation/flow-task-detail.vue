<template>
  <page-init
    :loading="pageInit"
    :code="code"
    :message="message"
    ref="page_inner"
  >
    <detail-pane
      class="detail-pane"
      ref="detailPane"
      @update="updateDetail"
      :persons="persons"
      :type="paneType"
      :detail="detail"
      :taskDefinitionKey="taskDefinitionKey"
      :is-sub="isSub"
      :breads="breads"
      :flowDetail="flowDetail"
      :parentPath="parentPath"
      :xmlData="{
        xml,
        message
      }"
      :privileges="privileges"
    />
  </page-init>
</template>
<script>
import detailMixin from './detail.mixin'
export default {
  name: 'flow-task-detail',
  mixins: [detailMixin]
}
</script>
<style lang="scss" scoped>
page-init {
  display: flex;
  flex-direction: column;
  margin-top: -3px;
}

.detail-pane {
  // padding: 0 !important;
  height: unset;
  background-color: $--global-bg;
  /deep/ {
    .form-label {
      margin-bottom: 26px;
      padding-left: 32px;
      /deep/ .text {
        font-size: 20px;
        max-width: 300px;
        height: 32px !important;
        line-height: 32px !important;
      }
      /deep/ .router-back {
        max-width: 600px;
      }
    }
    .form-body {
      padding: 28px 32px;
      display: block;
      flex: none;
      .groups {
        margin-top: 20px;
      }
      .copy2assignee {
        margin-top: 0;
      }
    }
    .bar {
      padding-top: 16px;
      background: #f5f5f5;
    }
    .form-body:not(.task-detail) {
      position: relative;
      /deep/ .editable-box.editable-box-4.button {
        position: absolute;
        right: 32px;
        top: 12px;
      }
      .check,
      .check-show {
        position: absolute;
        right: 32px;
        top: 12px;
      }
    }
    .form-body.task-detail {
      padding-top: 0;
      /deep/ .el-tabs {
        .form-block {
          display: flex;
          .tit {
            min-width: 60px;
            margin-right: 10px;
          }
          .content {
            width: 422px;
          }
          /deep/ .editable-box-2 {
            flex: 1;
          }
        }
      }
      /deep/ .el-tabs .el-tabs__nav.is-top {
        margin-left: 0;
      }
      /deep/ .el-tabs__content {
        overflow: unset;
      }
    }
    .flow-display-warrper {
      /deep/ .flow-container {
        margin-top: 20px;
      }
      .flow-show-btn {
        display: flex;
        justify-content: flex-end;
        font-size: 12px;
        color: #3366ff;
        span {
          cursor: pointer;
        }
        .font-icon {
          font-size: 12px;
        }
      }
    }
    .ross-time-range {
      margin-right: 8px;
      .time-text {
        margin: 0;
      }
    }
    .el-tabs__header.is-top {
      &:before,
      &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 2px;
        background-color: #e4e7ed;
        z-index: 1;
      }
      &:before {
        left: -32px;
      }
      &:after {
        left: 32px;
      }
    }
  }
}
</style>
