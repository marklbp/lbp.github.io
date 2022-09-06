<template>
  <el-select
    size="small"
    :disabled="id ? true : false"
    multiple
    @change="changeName($event, options)"
    @visible-change="handleVisibleChange"
    v-model="name2"
    ref="elselect"
    popper-class="filter-prop-popper"
  >
    <el-input
      v-if="showSearch"
      size="mini"
      class="filter"
      prefix-icon="el-icon-search"
      placeholder="可输入姓名或工号搜索"
      v-model="searchStr"
      @input="handleSearchChange"
    />
    <el-option
      v-for="item in xoptions"
      :key="item[valueName]"
      :label="item[labelName]"
      :value="item[valueName]"
      :item="{ ...item }"
    >
      <span class="before"></span>
      <span class>{{ item[labelName] }}</span>
      <slot name="labelStyle" :item="item"></slot>
    </el-option>
    <el-option
      value="null"
      class="null-option"
      disabled
      v-show="options.length <= 0 && showSearch"
    >
      <span class="custom-empty">暂无数据</span>
    </el-option>
    <el-option value=""></el-option>
    <li class="reset-row">
      <el-button size="mini" type="text" @click="resetUserName">重置</el-button>
      <el-button
        size="mini"
        style="color:#3366ff;"
        type="text"
        @click="$refs.elselect.blur()"
        >确定</el-button
      >
    </li>
  </el-select>
</template>

<script>
import { debounce } from '~/utils'

export default {
  name: 'filter-props',
  props: {
    showSearch: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    options: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    name: {
      type: Array,
      required: true,
      default: function() {
        return []
      }
    },
    id: {
      type: Number,
      required: false
    },
    // 指定数据源中label和value的属性
    propsName: {
      type: Object,
      default: _ => ({
        label: 'name',
        value: 'code'
      })
    }
  },
  computed: {
    labelName() {
      return this.propsName.label
    },
    valueName() {
      return this.propsName.value
    },
    xoptions() {
      let options = this.options
      // console.log(this.name)
      return options
    }
  },
  model: {
    prop: 'name',
    event: 'updateName'
  },
  data() {
    return {
      name2: this.name.map(item => {
        const num = Number.parseInt(item)
        if (Number.isNaN(num)) {
          return item
        }
        return num
      }),
      searchStr: ''
    }
  },
  methods: {
    // 处理options
    handleOptions(arr, val) {
      let r = []
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (val[i].userName == arr[j]) {
            r.push(val[i])
          }
        }
      }
      this.$cache.session.set('newOptions', r)
    },
    /**
     * [changeName 更新name]
     * @param  {[type]} array [description]
     * @param  {[type]} obj
     * @return {[type]}       [description]
     */
    changeName(array, val) {
      if (this.showSearch) {
        this.handleOptions(array, val)
      }

      this.$emit('updateName', array)
    },
    /**
     * [resetUserName 重置成员]
     */
    resetUserName() {
      this.name2.splice(0)
      this.$emit('updateName', [])
    },
    /**
     * 防抖处理搜索
     */
    handleSearchChange: debounce(function(value) {
      this.$emit('search', value)
    }, 350),
    /**
     * 清空搜索的值
     */
    handleVisibleChange(visible) {
      if (this.showSearch) {
        visible ? this.$emit('search', '') : (this.searchStr = '')
        let sessionVal = this.$cache.session.get('newOptions')
        if (visible && sessionVal && sessionVal.length) {
          this.$emit('updateOptions', sessionVal)
        }
      }
    },
    /**
     * 检索姓名后原来的数据源会被新的覆盖
     * 暴露此方法获取所有选中的数据源
     */
    handleSelectList(list) {
      const { elselect } = this.$refs
      if (elselect) {
        const selectlist = elselect.selected.map(item => {
          let optionItem = {}
          if (item.$attrs && item.$attrs.item) {
            optionItem = item.$attrs.item
          }
          return {
            ...optionItem,
            [this.labelName]: item.currentLabel,
            [this.valueName]: item.currentValue
          }
        })
        return selectlist
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-input__prefix {
  margin-left: 16px;
  margin-top: 4px;
}
.filter {
  padding: 12px 16px 8px 16px;
  // width: calc(100% - 32px);
}
// 自定义空提示
.null-option {
  line-height: 34px;
  text-align: center;
  cursor: default;
  .custom-empty {
    color: #999;
  }
  &:hover {
    background-color: #fff;
  }
}
.reset-row {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 20px;
  border-top: 2px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  text-align: right;
  /deep/ .el-button--text {
    font-size: 14px;
    padding: 7px 0;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
  }
}
.before {
  display: inline-block;
  position: relative;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 2px solid rgba(217, 217, 217, 1);
  width: 16px;
  height: 16px;
  margin-right: 8px;
  top: 5px;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  left: 22px;
  top: 3px;
  color: white;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected .before {
  background-color: #3366ff;
  border-color: #3366ff;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #606266;
  font-weight: 500;
}
</style>
<style lang="scss">
.el-tag--light {
  display: inline-flex;
  align-items: flex-end;
}
.el-select__tags-text {
  max-width: 280px !important;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* .filter-prop-popper {
  max-width: 400px;
  .el-scrollbar {
    padding-bottom: 38px;
  }
} */
/* .el-select-dropdown__list {
  padding: 14px 0;
} */
/* .el-scrollbar__wrap {
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
} */
</style>
