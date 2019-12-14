<template>
  <div class="picker-container" :class="{'has-popup': !isView}">
    <picker-column 
      v-if="isView" 
      ref="pickerColumn" 
      :data="data" 
      :default-value="defaultValue"
      :default-index="defaultIndex"
      :invalid-index="invalidIndex"
      :cols="cols"
      @initialed="emitEvent('initialed')"
      @change="$_onPickerChange"
    />
    <popup 
      v-else
      v-model="isPickerShow"
      position="bottom"
      mask-closable="maskClosable"
      prevent-scroll
      @before-show="$_onPickerBeforeShow"
      @show="emitEvent('show')"
      @hide="emitEvent('hide')"
      @mask-click="$_onPickerCancel"
    >
      <popup-title-bar
        :title="title" 
        :ok-text="okText" 
        :cancel-text="cancelText"
        @confirm="$_onPickerConfirm"
        @cancel="$_onPickerCancel"
      />
      <picker-column
        ref="pickerColumn"
        :data="data"
        :default-value="$_getDefaultValue()"
        :default-index="$_getDefaultIndex()"
        :invalid-index="invalidIndex"
        :cols="cols"
        @initialed="emitEvent('initialed')"
        @change="$_onPickerChange"
      />
    </popup>
  </div>
</template>
<script>
import _util from './util'
const {_toConsumableArray, compareObjects} = _util
import cascade from './cascade'
import Popup from '../popup'
import PopupTitleBar from '../popup/title'
import PickerColumn from './picker-column'
export default {
  name: 'picker',
  components: {
    Popup,
    PopupTitleBar,
    PickerColumn
  },
  props: {
    value: {
      type: Boolean,
      default: _ => false
    },
    data: {
      type: Array,
      default: _ => []
    },
    cols: {
      type: Number,
      default: _ => 1
    },
    defaultValue: {
      type: Array,
      default: _ => []
    },
    defaultIndex: {
      type: Array,
      default: function() {
        var arr = new Array(this.cols);
        for (var i = 0, len = arr.length; i < len; i++) {
          arr[i] = 0;
        }
        return arr;
      }
    },
    invalidIndex: {
      type: Array,
      default: _ => []
    },
    isCascade: {
      type: Boolean,
      default: _ => false
    },
    isView: {
      type: Boolean,
      default: _ => false
    },
    title: {
      type: String,
      default: _ => ''
    },
    okText: {
      type: String,
      default: _ => '确认'
    },
    cancelText: {
      type: String,
      default: _ => '取消'
    },
    maskClosable: {
      type: Boolean,
      default: _ => true
    }
  },
  data: function data() {
    return {
      isPickerShow: false,
      isPickerFirstPopup: true,
      oldActivedIndexs: null
    };
  },
  computed: {
    column() {
      return this.$refs['pickerColumn'];
    },
    isScrollInitialed() {
      return this.column.isScrollInitialed;
    }
  },
  watch: {
    value: function value(val) {
      this.isPickerShow = val;
      val && this.$_initPicker();
    },
    isPickerShow: function isPickerShow(val) {
      if (!val) {
        this.$emit('input', val);
      }
    },

    data: {
      handler: function handler(val, oldVal) {
        if (!compareObjects(val, oldVal)) {
          this.$_initPickerColumn();
        }
      },

      deep: true,
      immediate: true
    },
    defaultIndex: {
      handler: function handler(val, oldVal) {
        if (!compareObjects(val, oldVal)) {
          this.$_initPickerColumn();
        }
      },

      deep: true
    }
  },
  mounted() {
    var _this = this;

    this.$_initPicker();

    if (this.isView) {
      this.$nextTick(function () {
        _this.column.refresh();
      });
    }
  },
  methods: {
    $_initPicker() {
      var _this2 = this;

      if (!this.isView && this.value) {
        this.isPickerShow = this.value;
      }

      this.column.inheritPickerApi(this, ['refresh']);

      if (this.isPickerFirstPopup) {
        this.isPickerFirstPopup = false;
      } else {
        setTimeout(function () {
          _this2.oldActivedIndexs = [].concat(_toConsumableArray(_this2.column.activedIndexs));
        }, 100);
      }
    },
    $_initPickerColumn() {
      var _this3 = this;

      if (!this.isCascade) {
        return;
      }

      var defaultIndex = this.$_getDefaultIndex();
      var defaultIndexOfFirstColumn = defaultIndex[0] || 0;
      this.$nextTick(function () {
        cascade(_this3.column, {
          currentLevel: 0,
          maxLevel: _this3.cols,
          values: _this3.data[0] ? _this3.data[0][defaultIndexOfFirstColumn] || [] : [],
          defaultIndex: defaultIndex
        });
      });
    },
    $_resetPickerColumn() {
      this.$_initPickerColumn();
    },
    $_getDefaultIndex() {
      return this.oldActivedIndexs || this.defaultIndex;
    },
    $_getDefaultValue() {
      return this.oldActivedIndexs ? [] : this.defaultValue;
    },
    $_onPickerConfirm() {
      var column = this.column;
      var columnValues = column.getColumnValues();
      var isScrolling = false;
      column.scrollers.forEach(function (scroller) {
        if (scroller._isAnimating !== false || scroller._isDecelerating !== false || scroller._isDragging !== false || scroller._isGesturing !== false) {
          isScrolling = true;
          return false;
        }
      });

      if (!isScrolling) {
        this.isPickerShow = false;
        this.$emit('confirm', columnValues);
      }
    },
    $_onPickerCancel() {
      var _this4 = this;

      this.isPickerShow = false;
      this.$emit('cancel');

      this.$nextTick(function () {
        _this4.$_resetPickerColumn();
        _this4.refresh();
      });
    },
    $_onPickerChange(columnIndex, itemIndex, values) {
      var _this5 = this;

      if (this.isCascade) {
        cascade(this.column, {
          currentLevel: columnIndex,
          maxLevel: this.cols,
          values: values
        }, function () {
          _this5.column.refresh(null, columnIndex + 1);
        });
      }

      this.$emit('change', columnIndex, itemIndex, values);
    },
    $_onPickerBeforeShow() {
      var _this6 = this;

      if (!this.isScrollInitialed) {
        this.$nextTick(function () {
          _this6.column.refresh();
        });
      }
    },
    emitEvent(name) {
      this.$emit(name)
    },
    refresh() {
      this.column.isScrollInitialed = false;

      if (this.isView || this.isPickerShow) {
        this.column.refresh.apply(this.column, arguments);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.picker-container {
  width: 100%;
  &.has-popup {
    .popup-container {
      z-index: 1100 !important;
    }
  }
  .popup-content {
    background-color: #fff;
  }
}
</style>