<template>
  <div :class="`editable-box editable-box-${type}`">
    <div
      class="readonly"
      v-if="!isEdit && menuKey != 'status'"
      v-html="type == 4 ? transform(value) : value"
    ></div>
    <el-button
      type="primary"
      v-if="!isEdit && menuKey == 'status'"
      :disabled="+value === 2 ? true : false"
    >
      {{ transform(value) }}
    </el-button>
    <div
      class="readonly"
      :class="{
        hover: !value
      }"
      @click="toggleEdit"
      title="单击编辑"
      v-if="type != 4 && !edit && isEdit"
      v-html="
        value ||
          '<span style=color:#ccc;line-height:32px;padding-left:12px;>待添加</span>'
      "
    ></div>
    <template v-if="(edit || type == 4) && isEdit">
      <el-input
        v-if="type == 0"
        v-model="val"
        :autofocus="autofocus"
        :maxlength="maxlength"
        :show-word-limit="showWordLimit"
      />
      <el-input
        v-if="type == 1"
        v-model="val"
        type="textarea"
        :maxlength="maxlength"
        :show-word-limit="showWordLimit"
        :autofocus="autofocus"
      />
      <rich-text
        v-if="type == 2"
        v-model="val"
        :maxlength="maxlength"
        :autofocus="autofocus"
        :config="richTextPlugins"
      />
      <el-date-picker
        style="width:200px"
        v-if="type == 3"
        :value-format="valueForamt"
        v-model="val"
        @change="ok"
        type="datetime"
        :picker-options="pickerOptions"
        :default-time="defaultTime"
        placeholder="选择日期时间"
      ></el-date-picker>
      <el-dropdown v-if="type == 4" @command="ok">
        <span class="el-dropdown-link" v-if="menuKey == 'priority'">
          {{ transform(value) }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-button size="small" type="primary" v-else>
          {{ transform(value) }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="c in menu"
            :key="c.id"
            :command="c.id"
            :disabled="c.disable"
            >{{ c.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <div class="btns" v-if="showBtns">
        <el-button icon="el-icon-check" type="primary" @click="ok"></el-button>
        <el-button icon="el-icon-close" @click="close"></el-button>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'editable',
  props: {
    config: {
      type: Object
    },
    value: {
      type: [Number, String],
      default: _ => ''
    },
    type: {
      type: [String, Number],
      default: _ => 0
    },
    maxlength: {
      type: [String, Number],
      default: _ => 60
    },
    isEdit: {
      /*是否可编辑*/
      type: Boolean,
      default: _ => true
    },
    autofocus: {
      type: Boolean,
      default: _ => true
    },
    showWordLimit: {
      type: Boolean,
      default: _ => true
    },
    valueForamt: {
      type: String,
      default: _ => 'yyyy-MM-dd HH:mm:ss'
    },
    showBtns: {
      type: Boolean,
      default: _ => true
    },
    menu: {
      type: Array,
      default: _ => []
    },
    menuKey: {
      type: String,
      default: _ => 'priority'
    },
    richTextPlugins: {
      type: Object,
      default: _ => ({
        items: [
          'fontname',
          'fontsize',
          'forecolor',
          'hilitecolor',
          'emoticons',
          'bold',
          'italic',
          'underline',
          'justifyleft',
          'justifycenter',
          'justifyright',
          'indent',
          'outdent',
          'insertorderedlist',
          'insertunorderedlist',
          'link',
          'portal-image-upload',
          'portal-add-relation-content',
          'preview',
          'fullscreen'
        ]
      })
    },
    defaultTime: {
      type: String,
      default: _ => '00:00:00'
    }
  },
  components: {
    'rich-text': _ => import('~/components/rich-text')
  },
  data() {
    return {
      val: this.value,
      edit: false,
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  watch: {
    edit(v) {
      if (v) this.val = this.value
    }
  },
  methods: {
    ok(val) {
      this.$emit('input', this.type + '' === '4' ? val : this.val)
      this.toggleEdit()
    },
    close() {
      this.toggleEdit()
    },
    toggleEdit() {
      this.edit = !this.edit
    },
    transform(value) {
      switch (this.menuKey) {
        case 'status':
          return (
            (this.$constant.TASK_STATUS[this.value || 0] &&
              this.$constant.TASK_STATUS[this.value || 0].name) ||
            '无效状态(' + this.value + ')'
          )
        case 'priority':
          return (
            (this.$constant.PRIORITIES[this.value || 0] &&
              this.$constant.PRIORITIES[this.value || 0].name) ||
            '无效优先级(' + this.value + ')'
          )
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.editable-box {
  &-1,
  &-2,
  &-3 {
    .readonly {
      min-height: 32px;
    }
  }
  &-2 {
    display: flex;
    flex-direction: column;
    .rich-text-container {
      flex: 1;
    }
  }
}
.readonly {
  /deep/ p {
    margin: 0;
  }
  flex: 1;
  word-break: break-all;
  line-height: 32px;
  &.hover {
    cursor: pointer;
    position: relative;
    min-width: 100px;
    // &:hover {
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      left: 0;
      top: 0;
      border-radius: 2px;
      border: 1px dashed #ccc;
    }
    // }
  }
}
.btns {
  padding-top: 8px;
  text-align: right;
}
</style>
