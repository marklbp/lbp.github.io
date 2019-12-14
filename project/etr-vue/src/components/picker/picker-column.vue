<template>
  <div class="picker-column" :style="{'height': (style.indicatorHeight + 2 * style.maskerHeight) + 'px'}">
    <div class="picker-column-container">
      <div class="picker-column-masker top" :style="{'height': style.maskerHeight + 'px'}"></div>
      <div class="picker-column-masker bottom" :style="{'height': style.maskerHeight + 'px'}"></div>
      <div class="picker-column-list">
        <div class="picker-column-item" v-for="(column, i) in columnValues" :key="i">
          <ul class="column-list" :style="{'padding-top': style.maskerHeight + 'px'}">
            <li class="column-item" :class="{'disabled': $_isColumnIndexInvalid(i, j)}" :style="{'height': style.indicatorHeight + 'px','line-height': style.indicatorHeight + 'px'}" v-for="(item, j) in column" :key="j">{{item.text || item.label}}</li>
          </ul>
        </div>
        <div class="picker-column-item" v-for="n in (cols - columnValues.length)">
          <ul class="column-list" :style="{'padding-top': style.maskerHeight + 'px'}"></ul>
        </div>
      </div>
      <div class="picker-column-hooks">
        <div class="picker-column-hook" v-for="n in cols" :key="n - 1"
          @touchstart="$_onColumnTouchStart($event, n - 1)"
          @mousedown="$_onColumnTouchStart($event, n - 1, true)"
          @touchmove="$_onColumnTouchMove($event, n - 1)"
          @mousemove="$_onColumnTouchMove($event, n - 1, true)"
          @touchend="$_onColumnTouchEnd($event, n - 1)"
          @mouseup="$_onColumnTouchEnd($event, n - 1, true)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import _scroller2 from './util/scroller'
import _util from './util'
import _render from './util/render' 

var dpr = _util.getDpr();
var API_LIST = ['getColumnValue', 'getColumnValues', 'getColumnIndex', 'getColumnIndexs', 'getColumnIndexByDefault', 'setColumnValues', 'refresh', 'inheritPickerApi'];

export default {
  name: 'picker-column',

  props: {
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    cols: {
      type: Number,
      default: _ => 1
    },
    defaultValue: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    defaultIndex: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    invalidIndex: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },

  data: function data() {
    return {
      style: {
        maskerHeight: 81 * dpr,
        indicatorHeight: 36 * dpr
      },
      columnValues: [],
      scrollers: [],
      scrollDirect: 1,
      scrollPosition: 0,
      activedIndexs: [],
      isInitialed: false,
      isScrollInitialed: false,
      isScrolling: false,
      isMouseDown: false
    };
  },


  watch: {
    data: {
      handler: function handler(val) {
        this.columnValues = [].concat(_util._toConsumableArray(val));
      },

      deep: true
    }
  },

  created: function created() {
    this.columnValues = [].concat(_util._toConsumableArray(this.data));
  },


  methods: {
    $_initColumnsScroller: function $_initColumnsScroller() {
      var _this = this;

      var startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var hooks = this.$el.querySelectorAll('.picker-column-hook');

      if (!hooks) {
        return;
      }

      hooks = Array.isArray(hooks) ? hooks : Array.prototype.slice.call(hooks);

      for (var i = startIndex, len = hooks.length; i < len; i++) {
        var container = hooks[i];
        container && this.$_initSingleColumnScroller(container, i);
      }

      if (!startIndex) {
        this.$_initColumnIndex();
        if (!this.isInitialed) {
          this.isInitialed = true;
          setTimeout(function () {
            _this.$emit('initialed');
          }, 0);
        }
      }

      this.isScrollInitialed = true;
    },
    $_initSingleColumnScroller: function $_initSingleColumnScroller(container, index) {
      var _this2 = this;

      var columns = this.$el.querySelectorAll('.column-list');
      var content = columns[index];

      if (index === undefined || !columns || !container || !content) {
        return;
      }

      var rect = container.getBoundingClientRect();
      var scroller = new _scroller2(function (left, top) {
        _render(content, left, top);
      }, {
        scrollingX: false,
        snapping: true,
        scrollingComplete: function scrollingComplete() {
          _this2.$_onColumnScrollEnd(index);
        }
      });

      scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
      scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight + this.style.maskerHeight);
      scroller.setSnapSize(0, this.style.indicatorHeight);

      this.$set(this.scrollers, index, scroller);
    },
    $_initColumnIndex: function $_initColumnIndex() {
      var _this3 = this;

      var data = this.columnValues;
      var scrollers = this.scrollers;
      var defaultValue = this.defaultValue;
      var defaultIndex = this.defaultIndex;

      this.$_getColumnIndexByDefault(data, defaultIndex, defaultValue, function (columnIndex, itemIndex) {
        var scroller = scrollers[columnIndex];
        var offsetTop = _this3.$_getColumnOffsetByIndex(itemIndex);

        if (!scroller) {
          (0, _util.warn)('initialColumnIndex: scroller of column ' + columnIndex + ' is undefined');
          return 1;
        }

        scroller.scrollTo(0, offsetTop);

        _this3.$set(_this3.activedIndexs, columnIndex, itemIndex);
      });
    },
    $_getColumnIndexByDefault: function $_getColumnIndexByDefault(data) {
      var defaultIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _util.noop;

      if (!data) {
        return;
      }

      (0, _util.traverse)(data, function (item, level, indexs) {
        var columnIndex = indexs[0];
        var itemIndex = indexs[1];
        var itemDefaultIndex = defaultIndex[columnIndex];
        var itemDefaultValue = defaultValue[columnIndex];

        if (itemDefaultIndex === undefined && itemDefaultValue === undefined) {
          itemDefaultIndex = 0;
        }

        if (itemDefaultIndex !== undefined && itemIndex === itemDefaultIndex || itemDefaultValue !== undefined && (item.text === itemDefaultValue || item.label === itemDefaultValue || item.value === itemDefaultValue)) {
          fn(columnIndex, itemIndex);
          return 2;
        }
      });
    },
    $_getColumnIndexByOffset: function $_getColumnIndexByOffset(top) {
      return Math.round(top / this.style.indicatorHeight);
    },
    $_getColumnOffsetByIndex: function $_getColumnOffsetByIndex(index) {
      return index * this.style.indicatorHeight;
    },
    $_isColumnIndexInvalid: function $_isColumnIndexInvalid(columnIndex, itemIndex) {
      var invalidIndex = this.invalidIndex[columnIndex];
      return (0, _util.inArray)(invalidIndex, itemIndex);
    },
    $_scrollToValidIndex: function $_scrollToValidIndex(columnIndex, itemIndex) {
      var scroller = this.scrollers[columnIndex];
      var dirction = this.scrollDirect;
      var count = itemIndex;

      while (this.$_isColumnIndexInvalid(columnIndex, count)) {
        count += dirction;
      }

      var offsetTop = this.$_getColumnOffsetByIndex(count);
      scroller.scrollTo(0, this.$_scrollInZoon(scroller, offsetTop), true);
    },
    $_scrollInZoon: function $_scrollInZoon(scroller, top) {
      var MaxTop = scroller.getScrollMax().top;

      if (top < 0) {
        return 0;
      } else if (top > MaxTop) {
        return MaxTop;
      } else {
        return top;
      }
    },
    $_onColumnTouchStart: function $_onColumnTouchStart(event, index, isMouse) {
      event.preventDefault();

      var scroller = this.scrollers[index];
      var touches = isMouse ? [{ pageX: event.pageX, pageY: event.pageY }] : event.touches;

      if (!scroller) {
        (0, _util.warn)('touchstart: scroller of column ' + index + ' is undefined');
        return;
      }

      this.scrollPosition = isMouse ? event.pageY : event.touches[0].pageY;

      scroller.doTouchStart(touches, event.timeStamp);
      isMouse && (this.isMouseDown = true);
    },
    $_onColumnTouchMove: function $_onColumnTouchMove(event, index, isMouse) {
      var scroller = this.scrollers[index];
      var touches = isMouse ? [{ pageX: event.pageX, pageY: event.pageY }] : event.touches;

      if (!scroller || isMouse && !this.isMouseDown) {
        return;
      }

      var diff = this.scrollPosition - (isMouse ? event.pageY : event.touches[0].pageY);
      this.scrollDirect = diff ? diff / Math.abs(diff) : 1;

      scroller.doTouchMove(touches, event.timeStamp);
      isMouse && (this.isMouseDown = true);
    },
    $_onColumnTouchEnd: function $_onColumnTouchEnd(event, index, isMouse) {
      var scroller = this.scrollers[index];

      if (!scroller || isMouse && !this.isMouseDown) {
        return;
      }

      scroller.doTouchEnd(event.timeStamp);
      isMouse && (this.isMouseDown = false);
    },
    $_onColumnScrollEnd: function $_onColumnScrollEnd(index) {
      var scroller = this.scrollers[index];
      var top = scroller.getValues().top;
      var scrollTop = this.$_scrollInZoon(scroller, top);
      var activeItemIndex = this.$_getColumnIndexByOffset(scrollTop);
      var isInvalid = this.$_isColumnIndexInvalid(index, activeItemIndex);

      if (isInvalid || activeItemIndex === this.activedIndexs[index]) {
        isInvalid && this.$_scrollToValidIndex(index, activeItemIndex);
        return false;
      }

      this.$set(this.activedIndexs, index, activeItemIndex);

      this.$emit('change', index, activeItemIndex, this.getColumnValue(index));
    },
    inheritPickerApi: function inheritPickerApi(instance) {
      var _this4 = this;

      var blacklist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      (0, _util.traverse)(API_LIST, function (api) {
        if (!instance) {
          return 2;
        } else if (~blacklist.indexOf(api)) {
          return 1;
        }

        var fn = _this4[api];

        if (fn) {
          instance[api] = fn;
        } else {
          (0, _util.warn)('inheritPickerApi: Api method [' + api + '] is undefined');
        }
      });
    },
    getColumnValue: function getColumnValue() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var activeValues = this.getColumnValues();
      return activeValues[index];
    },
    getColumnValues: function getColumnValues() {
      var data = this.columnValues;
      var activeIndexs = this.activedIndexs;
      var activeValues = [];

      data.forEach(function (item, index) {
        activeValues[index] = item[activeIndexs[index]];
      });

      return activeValues;
    },
    getColumnIndex: function getColumnIndex() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.activedIndexs[index];
    },
    getColumnIndexs: function getColumnIndexs() {
      return this.activedIndexs;
    },
    getColumnIndexByDefault: function getColumnIndexByDefault(data) {
      var defaultIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _util.noop;

      this.$_getColumnIndexByDefault(data, defaultIndex, defaultValue, fn);
    },
    setColumnValues: function setColumnValues(index, values) {
      var _this5 = this;

      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _util.noop;

      if (index === undefined || values === undefined) {
        return;
      }
      this.$set(this.activedIndexs, index, 0);
      this.$set(this.columnValues, index, values);
      this.$nextTick(function () {
        _this5.$_initSingleColumnScroller(index);
        callback();
      });
    },
    refresh: function refresh(callback) {
      var _this6 = this;

      var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.$nextTick(function () {
        _this6.$_initColumnsScroller(startIndex);
        callback && callback();
      });
    }
  }
};
</script>
<style lang="scss" src="./picker-column.scss" scoped/>