<template>
  <div class="ross-remind">
    <popover-warrper
      placement="bottom-end"
      :disabled="!canEdit"
      @confirm="handerConfirm"
      @popoverShow="handelPopoverShow"
    >
      <div slot="content">
        <div class="form-item">
          <label>自定义提醒</label>
          <el-date-picker
            prefix-icon="el-icon-date"
            ref="datePicker"
            v-model="value"
            format="yyyy-MM-dd HH:mm:ss"
            :value-format="valueFormat"
            type="datetime"
            class="datetime"
            size="100%"
            placeholder="请选择"
            :picker-options="pickerOptions"
            default-time="00:00:00"
          ></el-date-picker>
        </div>
      </div>
      <el-tooltip slot="trigger" :content="remindTimeText" placement="bottom">
        <span class="font-icon" :class="remindIconClass"></span>
      </el-tooltip>
    </popover-warrper>
  </div>
</template>

<script>
import PopoverWarrper from '~/components/popover-warrper'
import { formatTime } from '~/utils/index'

export default {
  name: 'ross-remind',
  components: {
    PopoverWarrper
  },
  props: {
    remindTime: {
      type: [String, Number]
    },
    canEdit: {
      type: Boolean
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    }
  },
  data() {
    return {
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
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
      this.value = this.remindTime
    }
  },
  computed: {
    remindTimeText() {
      const timeStamp = this.remindTime
      return timeStamp ? '自定义提醒：' + formatTime(timeStamp) : '无自定义提醒'
    },
    remindIconClass() {
      const timeStamp = this.remindTime
      return {
        'icon-tixingx-copy': timeStamp,
        'icon-butixingx': !timeStamp,
        disabled: !this.canEdit
      }
    }
  },
  watch: {
    remindTime: function(val) {
      this.value = val
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.form-item {
  .el-date-editor {
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
  color: #999;
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
