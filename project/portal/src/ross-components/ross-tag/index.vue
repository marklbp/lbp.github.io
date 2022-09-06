<template>
  <div class="ross-tag" ref="rossTag">
    <div
      v-popover:popoverTips
      class="el-select el-select--small ross-tag-select"
      style="width: 100%;"
      v-if="!isEdit"
    >
      <div
        class="el-select__tags"
        ref="tagsContainer"
        style="width: 100%;"
        :style="{ maxWidth: this.tagWidth - 42 + 'px' }"
      >
        <span>
          <el-tag
            size="small"
            type="info"
            effect="light"
            disable-transitions
            closable
            v-for="(item, index) in selectOption"
            @close="handdleCloseTag(item, index)"
            :key="item.id"
            >{{ item.name }}</el-tag
          >
        </span>
      </div>
      <div class="el-input el-input--small el-input--suffix">
        <input
          type="text"
          readonly="readonly"
          autocomplete="off"
          :placeholder="selectOption.length ? '' : '请选择'"
          ref="inputPlace"
          class="el-input__inner"
          style="height: 32px;"
        />
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
          </span>
        </span>
      </div>
    </div>
    <div v-else class="edit-trigger">
      <span @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <span class="tag-item" v-for="item in selectOption" :key="item.id">
          <span></span>
          {{ item.name }}
        </span>
        <span style="font-size: 14px;" v-if="!selectOption.length && !canEdit"
          >无</span
        >
      </span>
      <span
        class="trigger-warrper"
        :style="{ left: !this.selectOption.length ? '0' : '' }"
        v-show="canEdit"
      >
        <span
          v-popover:popoverTips
          @mouseenter="handleHover(true)"
          @mouseleave="handleHover(false)"
          v-show="editIconShow || !selectOption.length || popoverShow"
          class="font-icon edit"
        ></span>
      </span>
    </div>
    <el-popover
      ref="popoverTips"
      placement="bottom-end"
      trigger="click"
      v-model="popoverShow"
      :width="tagWidth"
      popper-class="ross-tag-popper"
    >
      <div class="popover-dropdown">
        <div class="text-warrper">
          <el-input
            type="text"
            v-model="name"
            @input="getRossTags"
            placeholder="搜索或新增标签"
            maxlength="10"
            size="mini"
          />
          <el-button
            type="text"
            size="mini"
            :disabled="name === ''"
            @click="addRassTag"
            >新增标签</el-button
          >
        </div>
        <el-scrollbar
          wrap-style="max-height: 214px;"
          view-class="el-select-dropdown__list"
          tag="section"
          class="option-list"
        >
          <tag-option
            v-for="item in tagsOption"
            @change="handleChechboxChange"
            @select="handleOptionSelect(item)"
            @delete="deleteRassTag"
            @edit="editRassTag"
            :key="item.id"
            :data="item"
          />
          <p class="el-select-dropdown__empty" v-if="!tagsOption.length">
            无匹配数据
          </p>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script>
import tagOption from './tag-option'
export default {
  name: 'ross-tag',
  components: {
    tagOption
  },
  props: {
    value: {
      type: Array,
      default: _ => []
    },
    storeId: {
      type: [String, Number]
    },
    processId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chacheOption: {},
      tagsOption: [],
      name: '',
      tagWidth: 412,
      editIconShow: false,
      popoverShow: false
    }
  },
  created() {
    this.getRossTags()
  },
  mounted() {
    if (!this.isEdit) {
      window.addEventListener('resize', this.setTagSelectWidth, false)
      this.setTagSelectWidth()
    }
  },
  methods: {
    // 获取标签列表
    async getRossTags() {
      try {
        const { get } = this.$api.tag
        const params = {
          likeName: this.name,
          groupId: this.groupId
        }
        const result = await get(params, this.httpConfig)
        this.tagsOption = this.chachedTagOptions(result.data)
      } catch (error) {
        console.log(error)
      }
    },
    // 新增标签
    async addRassTag() {
      try {
        const { post } = this.$api.tag
        const params = {
          name: this.name
        }
        const result = await post(params, this.httpConfig)
        this.$message.success('操作成功')
        this.getRossTags()
      } catch (error) {
        console.log(error)
      }
    },
    // 删除
    async deleteRassTag(id) {
      try {
        const { delete: deleteTag } = this.$api.tag
        const params = {
          id,
          processInstanceId: !this.processId ? '' : this.processId
        }
        const result = await deleteTag(params, this.httpConfig)
        this.$message.success('操作成功')
        this.getRossTags()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑
    async editRassTag(params) {
      try {
        const { put } = this.$api.tag
        const result = await put(params, this.httpConfig)
        this.$message.success('操作成功')
        this.getRossTags()
      } catch (error) {
        console.log(error)
      }
    },
    handleHover(val) {
      this.editIconShow = val
    },
    // 处理tag点击标签删除
    handdleCloseTag(tag, index) {
      const value = [...this.value]
      value.splice(value.indexOf(tag.id), 1)
      this.tagsOption.map(item =>
        item.id === tag.id ? (item.selected = false) : ''
      )
      const selecteds = this.getSelectOptions(value)
      this.$emit('input', value, selecteds)
    },
    // 处理点击复选框勾选或去勾选
    handleChechboxChange(selected, item) {
      const value = [...this.value]
      if (selected && !value.includes(item.id)) {
        value.push(item.id)
      } else {
        value.splice(value.indexOf(item.id), 1)
      }
      // this.$emit('change', this.selectOption)
      console.log(value)
      const selecteds = this.getSelectOptions(value)
      this.$emit('input', value, selecteds)
    },
    // 缓存数据
    chachedTagOptions(tags = []) {
      tags.map(el => {
        this.$set(el, 'selected', this.value.includes(el.id))
        this.$set(el, 'popoverVisible', false)
        this.$set(this.chacheOption, el.id, el)
      })
      return tags
    },

    handleOptionSelect(vItem) {
      this.tagsOption.map(item => {
        if (item.id !== vItem.id) {
          item.popoverVisible = false
        }
      })
    },
    setTagSelectWidth() {
      setTimeout(() => {
        const { rossTag } = this.$refs
        const { width } = rossTag.getBoundingClientRect()
        this.tagWidth = width
      }, 0)
    },
    getSelectOptions(vals = []) {
      return vals.map(item => this.chacheOption[item])
    }
  },
  computed: {
    selectOption: {
      get() {
        const value = this.value || []
        if (!Object.keys(this.chacheOption).length) {
          return []
        }
        return value.map(item => this.chacheOption[item])
      },
      set(val) {
        console.log('set')
      }
    },
    groupId() {
      const { storeId } = this.$route.params
      return !storeId ? this.storeId : storeId
    },
    httpConfig() {
      return {
        headers: {
          groupId: this.groupId
        }
      }
    },
    tagsContainer() {
      return this.$refs.tagsContainer
    },
    inputPlace() {
      return this.$refs.inputPlace
    }
  },
  watch: {
    selectOption(val) {
      if (val.length && !this.isEdit) {
        setTimeout(() => {
          const { height } = this.tagsContainer.getBoundingClientRect()
          this.inputPlace.style.height = (!height ? 32 : height + 4) + 'px'
        }, 0)
      }
    },
    value(val) {
      this.tagsOption.map(el => {
        this.$set(el, 'selected', this.value.includes(el.id))
        if (this.chacheOption[el.id]) {
          this.$set(
            this.chacheOption[el.id],
            'selected',
            this.value.includes(el.id)
          )
        }
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTagSelectWidth, false)
  }
}
</script>

<style lang="scss" scoped>
.ross-tag {
  display: inline-block;
  width: 100%;
  .ross-tag-select {
    cursor: pointer;
  }
}
.popover-dropdown {
  .text-warrper {
    display: flex;
    padding: 12px 12px 8px 12px;
  }
}
.edit-trigger {
  .trigger-warrper {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
    span {
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      &:hover {
        color: #3366ff;
      }
    }
  }
  .tag-item {
    display: inline-block;
    color: #333;
    font-size: 14px;
    margin-right: 16px;
    position: relative;
    span {
      display: inline-block;
      vertical-align: middle;
      margin-right: 2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3366ff;
      margin-bottom: 2px;
    }
  }
}
</style>
