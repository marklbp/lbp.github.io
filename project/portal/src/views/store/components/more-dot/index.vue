<template>
  <span class="more-dot">
    <el-dropdown placement="bottom" @command="dropCommand" v-if="status == 2">
      <span class="el-dropdown-link">
        <div class="action" @click="dropdownClick">
          <i class="iconfont icon-more-horizontal"></i>
        </div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="4">归档</el-dropdown-item>
        <!-- <el-dropdown-item
          :key="item.id"
          :command="item.id"
          v-for="item in statusList"
        >{{ item.name }}</el-dropdown-item>-->
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
export default {
  props: {
    // 当前状态
    status: {
      type: [String, Number],
      default: 0,
      require: true
    }
  },
  methods: {
    // 阻止冒泡，防止触发拖拽
    dropdownClick(e) {
      e.stopPropagation()
    },
    // 当改变状态时
    dropCommand(status) {
      this.$emit('change', status)
    }
  },
  computed: {
    // 可操作的状态
    statusList() {
      const statusMap = [[1, 2, 3], [2, 3], [], [0, 1, 2]]
      const currentStautsAuths = statusMap[this.status]
      const allTaskStatus = this.$constant.TASK_STATUS
      return allTaskStatus.filter(v => currentStautsAuths.includes(v.id))
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-primary: #3366ff;
$--white-border: 2px solid #fff;

.more-dot {
  float: right;
  .action {
    height: 34px;
    line-height: 34px;
    cursor: pointer;
  }
}
/deep/ .el-dropdown-link.el-dropdown-selfdefine:focus {
  outline: none;
}
</style>
