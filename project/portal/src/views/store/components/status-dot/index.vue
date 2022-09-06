<template>
  <span class="status-dot">
    <span
      class="dot"
      :class="status == 2 ? 'done' : ''"
      v-if="status == 2"
      @click="dropdownClick"
    ></span>
    <el-dropdown placement="bottom" @command="dropCommand" v-else>
      <span class="el-dropdown-link">
        <span
          class="dot"
          :class="status == 2 ? 'done' : ''"
          @click="dropdownClick"
        ></span>
      </span>
      <el-dropdown-menu slot="dropdown" v-show="status == 2">
        <el-dropdown-item
          :key="item.id"
          :command="item.id"
          v-for="item in statusList"
          >{{ item.name }}</el-dropdown-item
        >
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
      const statusMap = [[2], [2], [], [2]]
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

.dot {
  cursor: pointer;
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #cccccc;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    border-color: $--color-primary;
  }
  &.done {
    position: relative;
    border-color: $--color-primary;
    background: $--color-primary;
    opacity: 0.7;
    cursor: auto;
    &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 7px;
      border-right: $--white-border;
      border-bottom: $--white-border;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -55%) rotate(45deg);
    }
  }
}
/deep/ .el-dropdown-link.el-dropdown-selfdefine:focus {
  outline: none;
}
</style>
