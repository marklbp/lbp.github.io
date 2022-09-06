<template>
  <div
    class="ross-time-range"
    @mouseenter="handleMouserVisible(true)"
    @mouseleave="handleMouserVisible(false)"
  >
    <span class="time-text">
      <span class="label">时间：</span>
      <span>{{ startTimeText }} 至 {{ endTimeText }}</span>
    </span>
    <popover-warrper
      placement="bottom-end"
      :disabled="!canEdit"
      @confirm="handerConfirm"
      @popoverShow="handelPopoverShow"
      @popoverHide="handelPopoverHide"
    >
      <div slot="content">
        <div class="form-item">
          <label>开始时间</label>
          <el-date-picker
            prefix-icon="el-icon-date"
            ref="datePicker"
            v-model="startValue"
            format="yyyy-MM-dd HH:mm:ss"
            :value-format="valueFormat"
            type="datetime"
            class="datetime"
            size="100%"
            placeholder="请选择"
            :picker-options="startPickerOptions"
            :default-time="defaultStartTime"
            :disabled="!startCanEdit"
          ></el-date-picker>
        </div>
        <div class="form-item">
          <label>截至时间</label>
          <el-date-picker
            prefix-icon="el-icon-date"
            ref="datePicker"
            v-model="endValue"
            format="yyyy-MM-dd HH:mm:ss"
            :value-format="valueFormat"
            type="datetime"
            class="datetime"
            size="100%"
            placeholder="请选择"
            :picker-options="endPickerOptions"
            :default-time="defaultEndTime"
            :disabled="!endCanEdit"
          ></el-date-picker>
        </div>
      </div>
      <span
        data-v-41259d78
        slot="trigger"
        class="font-icon edit"
        v-show="canEdit"
        :style="{ opacity: popoverVisible || iconVisible ? 1 : 0 }"
      ></span>
    </popover-warrper>
  </div>
</template>

<script>
import PopoverWarrper from '~/components/popover-warrper'
import { formatTime } from '~/utils/index'

export default {
  name: 'ross-time-range',
  components: {
    PopoverWarrper
  },
  props: {
    startTime: {
      type: [String, Number]
    },
    endTime: {
      type: [String, Number]
    },
    startCanEdit: {
      type: Boolean
    },
    endCanEdit: {
      type: Boolean
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    }
  },
  data() {
    const that = this
    return {
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() > that.endTime
          )
        }
      },
      popoverVisible: false,
      iconVisible: false,
      defaultStartTime: '00:00:00',
      defaultEndTime: '23:59:59',
      startValue: '',
      endValue: ''
    }
  },
  // created() {},
  // mounted() {},
  methods: {
    handerConfirm() {
      if (this.endValue !== this.endTime && this.endCanEdit) {
        this.$emit('endPick', this.endValue)
      }
      if (this.startValue !== this.startTime && this.startCanEdit) {
        this.$emit('startPick', this.startValue)
      }
    },
    handelPopoverShow(visible) {
      this.popoverVisible = visible
      this.startValue = this.startTime
      this.endValue = this.endTime
    },
    handelPopoverHide(visible) {
      this.popoverVisible = visible
    },
    handleMouserVisible(visible, type) {
      this.iconVisible = visible
    }
  },
  computed: {
    canEdit() {
      return this.startCanEdit || this.endCanEdit
    },
    startTimeText() {
      const timeStamp = this.startTime
      if (!timeStamp) {
        return '-'
      }
      return this.valueFormat !== 'timestamp'
        ? timeStamp
        : formatTime(timeStamp)
    },
    endTimeText() {
      const timeStamp = this.endTime
      if (!timeStamp) {
        return '-'
      }
      return this.valueFormat !== 'timestamp'
        ? timeStamp
        : formatTime(timeStamp)
    },
    startPickerOptions() {
      let endTime
      if (this.valueFormat === 'timestamp') {
        endTime = this.endValue
      } else {
        endTime = new Date(this.endValue).getTime()
      }
      return {
        disabledDate(time) {
          if (
            time.getTime() < Date.now() - 8.64e7 ||
            (endTime && time.getTime() > endTime)
          ) {
            return true
          }
          return false
        }
      }
    },
    endPickerOptions() {
      let startTime
      if (this.valueFormat === 'timestamp') {
        startTime = this.startValue
      } else {
        startTime = new Date(this.startValue).getTime()
      }
      return {
        disabledDate(time) {
          if (
            time.getTime() < Date.now() - 8.64e7 ||
            (startTime && time.getTime() < startTime)
          ) {
            return true
          }
          return false
        }
      }
    }
  },
  watch: {
    startTime: function(val) {
      this.startValue = val
    },
    endTime: function(val) {
      this.endValue = val
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.time-text {
  font-size: 14px;
  color: #333333;
  margin-right: 5px;
  .label {
    color: #999999;
  }
}
.popover-warrper {
  display: inline-block;
}
.form-item {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
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
.edit {
  color: #999;
  opacity: 0;
  &:hover {
    color: #3366ff;
  }
  &:active {
    color: #2148d9;
  }
}
</style>
