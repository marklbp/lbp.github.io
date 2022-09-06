<template>
  <div
    class="tag-option"
    @mouseenter="handelHover(true)"
    @mouseleave="handelHover(false)"
    @click="optionClick"
  >
    <span class="left">
      <el-checkbox
        v-model="data.selected"
        @change="handelChange($event, data)"
      />
      <label>{{ data.name }}</label>
    </span>
    <popoverWarrper
      placement="bottom-end"
      mode="manual"
      v-model="data.popoverVisible"
      @popoverShow="popoverShow"
      @popoverHide="popoverHide"
    >
      <div slot="content">
        <div class="edit" v-show="isEditing">
          <el-input v-model="tagName" maxlength="10" />
        </div>
        <p class="delete" v-show="!isEditing">确认删除标签？</p>
      </div>
      <template slot="footer">
        <el-button
          v-if="isEditing"
          type="text"
          @click="isEditing = false"
          :disabled="data.selected"
          style="position: absolute;left: 0px;top: 7px;color: #666666;"
          >删除标签</el-button
        >
        <el-button
          type="text"
          style="color: #666; padding-right: 0;"
          @click="handleCancel"
          >取消</el-button
        >
        <el-button
          type="text"
          class="confirm"
          @click="confirm"
          :style="{ color: isEditing ? '' : '#ED4040' }"
          >{{ isEditing ? '确认' : '确认删除' }}</el-button
        >
      </template>
      <span
        slot="trigger"
        v-show="iconVisible || data.popoverVisible"
        class="font-icon edit"
      ></span>
    </popoverWarrper>
  </div>
</template>

<script>
import popoverWarrper from '~/components/popover-warrper'
export default {
  name: 'tag-option',
  components: { popoverWarrper },
  props: ['data'],
  data() {
    return {
      popoverVisible: false,
      iconVisible: false,
      isEditing: true,
      tagName: ''
    }
  },
  // created() {},
  mounted() {},
  methods: {
    handelChange(selected, item) {
      this.$emit('change', selected, item)
    },
    handelHover(v) {
      this.iconVisible = v
    },
    popoverShow() {
      this.tagName = this.data.name
    },
    popoverHide() {
      this.isEditing = true
    },
    confirm() {
      console.log(this.tagName)
      if (this.isEditing) {
        // 编辑
        const params = {
          id: this.data.id,
          name: this.tagName
        }
        this.$emit('edit', params)
      } else {
        // 删除
        this.$emit('delete', this.data.id)
      }
    },

    handleCancel() {
      if (this.isEditing) {
        this.data.popoverVisible = false
      } else {
        this.isEditing = true
      }
    },
    optionClick(ev) {
      const { target } = ev
      const { className } = target
      this.$emit('select')
      if (
        className === 'el-checkbox__inner' ||
        className === 'el-checkbox__original' ||
        className === 'font-icon edit'
      ) {
        return
      }
      this.data.selected = !this.data.selected
      this.$emit('change', this.data.selected, this.data)
    }
  }
  // computed: {},
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.tag-option {
  display: flex;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
  .left {
    flex: 1;
    label {
      user-select: none;
      color: #333;
      cursor: pointer;
    }
  }
  .font-icon.edit {
    color: #999;
    &:hover {
      color: #3366ff;
    }
  }
  &:hover {
    background: #f5f7fa;
  }
  .el-checkbox {
    margin-right: 8px;
  }
}
.popover-warrper {
  .footer {
    justify-content: space-between;
  }
}
</style>
