<template>
  <div
    x-placement="top"
    class="el-popover el-popper"
    :style="style"
    v-show="visible"
  >
    <div class="el-popover__title">{{ ganttData.activityName }}</div>
    <div class="gantt-time">
      {{
        formatDate(ganttData.activityStartTime) +
          ' 至 ' +
          formatDate(ganttData.activityEndTime)
      }}
    </div>
    <div x-arrow class="popper__arrow" :style="{ left: style.arrowLeft }"></div>
  </div>
</template>

<script>
export default {
  name: 'gantt-popover',
  // components: {},
  // props: {},
  data() {
    return {
      visible: false,
      style: {
        left: '-1110px',
        top: 0,
        arrowLeft: 0
      },
      ganttData: {}
    }
  },
  // created() {},
  mounted() {},
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '无'
      const currentDate = new Date(timestamp)
      const Y = currentDate.getFullYear().toString()
      const M = (currentDate.getMonth() + 1).toString()
      const D = currentDate.getDate().toString()
      return Y + '-' + M.padStart(2, '0') + '-' + D.padStart(2, '0')
    }
  }
  // computed: {},
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.el-popover {
  width: 270px;
  .el-popover__title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8px;
  }
  .gantt-time {
    color: #999999;
    font-size: 12px;
  }
}
</style>
