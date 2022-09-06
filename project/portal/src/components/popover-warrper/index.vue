<template>
  <div class="popover-warrper">
    <el-popover
      popper-class="ross-popover"
      width="320"
      v-model="visible"
      @show="handleShow"
      @hide="handleHide"
      :disabled="disabled"
      :placement="placement"
    >
      <div class="popover-content">
        <slot name="content"></slot>
        <div class="footer">
          <slot name="footer" v-if="$slots.footer"></slot>
          <template v-else>
            <el-button type="text" @click="handleCancel">取消</el-button>
            <el-button type="text" class="confirm" @click="handleconfirm"
              >确认</el-button
            >
          </template>
        </div>
      </div>
      <span slot="reference" class="trigger-element">
        <slot name="trigger"></slot>
      </span>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'popover-warrper',
  // components: {},
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // manual/auto  手动为自己控制 visible
    mode: {
      type: String,
      default: 'auto'
    },
    value: {
      type: Boolean
    }
  },
  data() {
    return {
      visible: false
    }
  },
  // created() {},
  mounted() {},
  methods: {
    handleCancel() {
      this.visible = false
      this.handleManual()
    },
    handleconfirm() {
      this.visible = false
      this.$emit('confirm')
      this.handleManual()
    },
    handleShow() {
      this.$emit('popoverShow', this.visible)
      this.handleManual()
    },
    handleHide() {
      this.$emit('popoverHide', this.visible)
      this.handleManual()
    },
    handleManual() {
      if (this.mode === 'manual') {
        this.$emit('input', this.visible)
      }
    }
  },
  // computed: {},
  watch: {
    value(val) {
      if (this.mode === 'manual') {
        this.visible = val
      }
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.ross-popover {
  padding: 24px;
  .popover-content {
    text-align: left;
    padding-bottom: 58px;
    min-height: 80px;
    .footer {
      position: absolute;
      height: 48px;
      width: 100%;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
      border-top: 2px solid #e8e8e8;
      .el-button {
        &:not(.confirm) {
          color: #666;
          padding-right: 0;
        }
        &.confirm {
          padding-right: 24px;
          color: #3366ff;
        }
      }
    }
  }
}
.trigger-element {
  cursor: pointer;
}
// .popover-warrper {
//   }
</style>
