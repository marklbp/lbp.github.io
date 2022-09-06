<template>
  <div
    class="people-select"
    @mouseenter="toggleShow(true)"
    @mouseleave="toggleShow(false)"
  >
    <div v-if="edit">
      <span class="btn-add el-dropdown-link" ref="btn">
        <div
          class="name_list"
          :style="{
            maxWidth: maxWidth
          }"
          v-show="list.length > 0"
        >
          <overflow-tip
            v-if="list.length > 0"
            :words="list.map(i => i.name).join('；')"
          ></overflow-tip>
        </div>
      </span>
      <el-dropdown
        trigger="click"
        @visible-change="setDropdownShow"
        :hide-on-click="!multiple && searching"
        @command="select"
      >
        <span
          class="btn-add el-dropdown-link"
          ref="btn"
          :style="{
            opacity: isEditShow || dropdownShow || list.length < 1 ? 1 : 0
          }"
        >
          <span class="font-icon edit"></span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="{ id: -1 }" class="search-input-li">
            <el-input
              v-if="filterable"
              v-model="input"
              @focus="searching = !searching"
              @blur="searching = !searching"
            >
              <i class="el-icon-search el-input__icon" slot="prefix"></i>
            </el-input>
          </el-dropdown-item>
          <li class="peoples-list">
            <ul class="peoples-list-ul">
              <el-dropdown-item
                :command="{ id, name, active, disable }"
                :class="{ active: active, disable: disable }"
                :key="id"
                v-for="{ id, name, active, disable } in filterData"
                >{{ name }}</el-dropdown-item
              >
            </ul>
          </li>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="name_list no_border" :style="{ maxWidth: maxWidth }" v-else>
      <overflow-tip
        v-if="list.length > 0"
        :words="list.map(i => i.name).join('；')"
      ></overflow-tip>
    </div>
  </div>
</template>
<script>
import overflowTip from '~/components/overflow-tip'
export default {
  name: 'select-people',
  props: {
    edit: {
      type: Boolean,
      default: _ => true
    },
    value: {
      type: Array,
      default: _ => []
    },
    filterable: {
      type: Boolean,
      default: _ => true
    },
    data: {
      type: Array,
      default: _ => []
    },
    multiple: {
      type: Boolean,
      default: _ => false
    },
    isDelete: {
      type: Boolean,
      default: _ => false
    },
    maxWidth: {
      type: String,
      default: '150px'
    }
  },
  components: {
    overflowTip
  },
  data() {
    return {
      input: '',
      searching: true,
      isEditShow: false,
      dropdownShow: false
    }
  },
  computed: {
    filterData() {
      if (!this.filterable) return this.data
      return this.data.filter(d => {
        return d.name.indexOf(this.input) > -1
      })
    },
    list: {
      set(v) {
        this.$emit('input', v)
      },
      get() {
        return this.value
      }
    }
  },
  methods: {
    select({ id, disable }) {
      if (id + '' === '-1' || disable) return
      this.data.forEach(d => {
        if (d.disable) return
        if (d.id === id) {
          if (this.multiple) {
            d.active = !d.active
            if (d.active) {
              // d.disable = !this.isDelete
              this.list = [...this.list, { ...d }]
            } else {
              this.list = [...this.list.filter(x => x.id + '' !== id + '')]
            }
          } else {
            d.active = true
            if (this.list.every(x => x.id + '' !== id + '')) {
              this.list = [{ ...d }]
            }
          }
        } else {
          if (!this.multiple) {
            d.active = false
          }
        }
      })
    },
    removeFn(index) {
      if (this.isDelete) {
        let list = this.list.map(l => ({
          ...l
        }))
        list.splice(index, 1)
        this.list = list
      }
    },
    toggleShow(isShow) {
      this.isEditShow = isShow
    },
    setDropdownShow(isShow) {
      this.dropdownShow = isShow
    }
  }
}
</script>
<style lang="scss" scoped>
.people-select {
  display: flex;
  align-items: center;
  .btn-add {
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-dropdown-menu {
  padding-bottom: 0;
  margin-bottom: 0;
  &__item {
    line-height: 28px;
    &:hover {
      background-color: #f5f5f5;
    }
    &.active {
      background-color: #f5f5f5;
      color: $--color-primary;
    }
    &.disable {
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
}
.search-input-li {
  &:hover {
    background-color: transparent;
  }
}
.peoples-list {
  margin-top: 12px;
  list-style: none;
  height: 200px;
  overflow: auto;
  &-ul {
    padding: 0;
  }
}
.name_list {
  position: relative;
  padding: 4px 0px;
  height: 24px;
  white-space: nowrap;
  font-size: 14px;
  color: #333333;
  border: 1px solid transparent;
  .name_item {
    font-size: 14px;
    color: #333333;
  }
}
.no_border {
  border: 1px dashed transparent;
  overflow: hidden;
  &:hover {
    border: 1px dashed transparent;
  }
}
/deep/ .el-dropdown {
  max-height: 24px;
}
.font-icon.edit {
  color: #999;
  &:hover {
    color: #3366ff;
  }
}
</style>
