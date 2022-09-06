<template>
  <div class="tool-container">
    <div class="tool-list">
      <div
        class="tool-item"
        :class="{ deletable }"
        v-for="{ id, name, icon, url } in values"
      >
        <a class="tool-link" :href="url" target="_blank"
          ><img :src="icon" :alt="name"
        /></a>
        <span class="btn-delete-tool" @click="remove(id)">
          <i class="el-icon-delete"></i>
        </span>
        <a class="tool-text" :href="url" target="_blank">{{ name }}</a>
      </div>

      <el-dropdown
        v-if="addable"
        trigger="click"
        :hide-on-click="false"
        @command="toggleSelect"
      >
        <div class="el-dropdown-link">
          <span class="btn-add-tool" v-if="values && values.length === 0">
            <i class="el-icon-plus"></i>
          </span>
          <span class="edit_button" v-if="values && values.length > 0">
            <i class="font-icon icon-edit"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" class="tools-checkboxes">
          <el-dropdown-item
            class="tool-checkbox"
            :command="{ id, name, icon, url, checked, disable }"
            :class="{ checked, disable }"
            :key="id"
            v-for="{ id, name, icon, url, checked, disable } in tools"
          >
            <span class="checkbox"></span>
            <img :src="icon" :alt="name" />
            <span class="name">{{ name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tools',
  props: {
    value: {
      type: String,
      default: _ => ''
    },
    deletable: {
      type: Boolean,
      default: _ => true
    },
    addable: {
      type: Boolean,
      default: _ => true
    }
  },
  computed: {
    values: {
      set(v) {
        this.$emit('input', v.map(({ id }) => id).join(','))
      },
      get() {
        return this.$constant.TOOLS.filter(t => this.value.indexOf(t.id) > -1)
      }
    },
    tools() {
      return this.$constant.TOOLS.map(t => {
        return {
          ...t,
          checked: this.value.indexOf(t.id) > -1,
          disable: t.disable
        }
      })
    }
  },
  methods: {
    async remove(id) {
      try {
        await this.$confirm('是否确认删除该工具？删除后也可重新添加', '提示', {
          confirmButtonText: '确定删除'
        })
        let values = JSON.parse(JSON.stringify(this.values))
        let i = values.findIndex(v => v.id == id)
        if (i > -1) {
          values.splice(i, 1)
          this.values = values
        }
      } catch (e) {}
    },
    toggleSelect({ id, name, icon, url, checked, disable }) {
      if (disable) return
      let values = JSON.parse(JSON.stringify(this.values))
      let v = values.findIndex(x => x.id == id)
      if (v > -1) {
        values.splice(v, 1)
      } else {
        values.push({ id, name, icon, url })
      }
      this.values = values
    }
  }
}
</script>
<style lang="scss" scoped>
.tool-container {
  .tool-list {
    overflow: hidden;
    .tool-item {
      position: relative;
      float: left;
      margin-right: 24px;
      text-align: center;
      .tool-link {
        display: block;
        width: 40px;
        height: 40px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 8px;
        overflow: hidden;
        img {
          max-width: 100%;
        }
      }
      .tool-text {
        line-height: normal;
        color: #333;
        font-size: 14px;
      }
      .btn-delete-tool {
        display: none;
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: -20px;
        width: 40px;
        height: 40px;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        cursor: pointer;
      }
      &.deletable {
        &:hover {
          .btn-delete-tool {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
  .tool-text {
    margin-top: 8px;
  }
  .btn-add-tool-default {
    display: none;
  }
  .btn-add-tool {
    display: inline-block;
    width: 49px;
    height: 49px;
    line-height: 49px;
    background: #fff;
    border: 1px dashed #d9d9d9;
    color: #999;
    text-align: center;
    cursor: pointer;
    &:hover {
      border-color: $--color-primary;
    }
  }
}
.tools-checkboxes {
  overflow: hidden;
}
.tool-checkbox {
  display: flex;
  align-items: center;
  line-height: normal;
  cursor: pointer;
  padding: 12px 16px 12px 16px;
  &:hover {
    background-color: transparent;
  }
  .checkbox {
    position: relative;
    width: 16px;
    height: 16px;
    margin-right: 12px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    &:after {
      box-sizing: content-box;
      content: '';
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
  img {
    width: 24px;
    height: 24px;
  }
  .name {
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.checked {
    .checkbox {
      background-color: rgba(51, 102, 255, 1);
      border-color: rgba(51, 102, 255, 1);
      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
  }
  &.disable {
    border-color: #d9d9d9;
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.edit_button {
  display: inline-block;
  padding: 16px;
  margin-left: -16px;
  cursor: pointer;
  &:hover {
    color: #3366ff;
  }
  .font-icon {
    font-size: 20px;
  }
}
</style>
