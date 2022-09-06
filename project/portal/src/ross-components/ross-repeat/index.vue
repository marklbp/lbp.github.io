<template>
  <div class="ross-repeat">
    <popover-warrper
      placement="bottom-end"
      :disabled="!canEdit"
      @confirm="handerConfirm"
      @popoverShow="handelPopoverShow"
    >
      <div slot="content">
        <div class="form-item">
          <label>重复</label>
          <el-select v-model="value">
            <el-option
              v-for="(k, v) in cyclicalObj"
              :value="v"
              :label="k"
              :key="v"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-tooltip slot="trigger" :content="cyclicalText" placement="bottom">
        <span class="font-icon" :class="repeatIcon"></span>
      </el-tooltip>
    </popover-warrper>
  </div>
</template>

<script>
import { cyclicalObj } from '../../config/constants'
import PopoverWarrper from '~/components/popover-warrper'

export default {
  name: 'ross-repeat',
  components: {
    PopoverWarrper
  },
  props: {
    cyclical: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean
    }
  },
  data() {
    return {
      cyclicalObj,
      value: ''
    }
  },
  // created() {},
  // mounted() {},
  methods: {
    handerConfirm() {
      this.$emit('pick', this.value)
    },
    handelPopoverShow() {
      this.value = this.cyclical
    }
  },
  computed: {
    // 重复周期文案
    cyclicalText() {
      const text = this.cyclicalObj[this.cyclical || 'once']
      return text === '不重复' ? text : text + '重复'
    },
    repeatIcon() {
      console.log(this.cyclical)
      return {
        repeatx: this.cyclical !== 'once',
        'icon-buzhongfux': this.cyclical === 'once',
        disabled: !this.canEdit
      }
    }
  },
  watch: {
    cyclical: function(val) {
      this.value = val
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.form-item {
  .el-select {
    width: 100%;
  }
  label {
    display: block;
    font-size: 12px;
    margin-bottom: 8px;
    color: #666;
  }
}
.font-icon {
  &.disabled {
    &:hover {
      color: #333333;
    }
    &:active {
      color: #333333;
    }
  }
  &:hover {
    color: #3366ff;
  }
  &:active {
    color: #2148d9;
  }
}
</style>
