<template>
  <div :class="itemClass" :style="itemStyle" @mousemove="autoResetPos">
    <div
      v-if="type"
      class="drag_move"
      :class="{ absolute, scale, drag_zoom: scale, drag_zoom_b: isZoomingB }"
      :style="moveStyle"
    >
      <div
        class="zoom zoom_b"
        :class="{
          zoom_b_align: isAlign
        }"
        @mousedown.stop="zoomDown($event, 0)"
      ></div>
      <div
        v-if="row.length === 5 && row.indexOf(item) === 1"
        class="zoom zoom_r"
        :style="{
          left: isZoomingR ? `${zoomR}px` : 'auto',
          right: isZoomingR ? 'auto' : '0'
        }"
        @mousedown.stop="zoomDown($event, 1)"
      >
        <div
          v-show="isZoomingR"
          class="zoom_r_hide_move"
          :class="{
            zoom_r_hide_moveR: scaleWidthType === 2,
            zoom_r_hide_moveL: scaleWidthType === 1
          }"
          :style="{
            width: `${zoomR_HideWidth}px`
          }"
        ></div>
      </div>
      <div ref="comp">
        <drapComponent
          :component="item.component"
          :width="item.width"
          :iframe="params"
          :scaleParams="scaleParams"
          :style="{
            'z-index': '99'
          }"
        >
          <div
            class="drag_control"
            :class="{ dragIng: absolute }"
            @mousedown.stop="mouDown"
            @mouseup.stop="mouUp"
          ></div>

          <div class="drag_control_delete">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="item.iframe" command="1"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item command="0">删除模块</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-show="scale" class="scaleModel"></div>
        </drapComponent>
      </div>
    </div>
    <div v-else class="holder"></div>
    <div class="border_box" :style="borderStyle"></div>
  </div>
</template>
<script>
export default {
  name: 'drag',
  components: {
    drapComponent: _ => import('../components/drap-component')
  },
  data() {
    return {
      absolute: false, // 判断当前组件是否是拖拽状态
      scale: false, // 判断当前组件是否是缩放状态状态
      outerStyle: {
        top: 0,
        left: 0,
        width: null,
        height: null
      },
      timer: null,
      zoomPad: null, // 缩放时，最大宽度 - 组件零时宽度
      zoomWidth: null, // 缩放动作进行时，实时计算大模块宽度
      parentWidth: 0,
      wdClass: [`wd_${this.comWidth}`],
      widthBak: 0,
      heightBak: 0,
      innerHeightBak: 0,
      wdList: {
        '4': 92 / 3,
        '6': 47,
        '8': 94 - 92 / 3,
        '12': 96
      },
      scaleParams: null,
      scaleOutLimit: false,
      scaleBorder: 6, // 定义缩放条offsetWidth
      isZoomingR: false, // R线缩放进行中
      isZoomingB: false, // B线缩放进行中
      widthToBe: this.comWidth, // 缩放松开后将会成为的宽度
      scaleX: null
    }
  },
  props: {
    comWidth: {
      type: Number,
      default: 12
    },
    isDroging: {
      type: Boolean,
      default: false
    },
    isZooming: {
      type: Boolean,
      default: false
    },
    moveVal: {
      type: Object,
      default: null
    },
    type: {
      type: Number,
      default: 1
    },
    dragPos: {
      type: Object,
      default: null
    },
    row: {
      type: Array,
      default: null
    },
    item: {
      type: Object,
      default: null
    },
    component: {
      type: String,
      default: 'iframe'
    },
    params: {
      type: Object,
      default: null
    },
    overHolderItem: {
      type: Object,
      default: null
    },
    anotherScaleItem: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.$nextTick(function() {
      setTimeout(this.resetPos, 100)
    })
  },
  beforeDestroy() {},
  methods: {
    resetPos() {
      const el = this.$el ? this.$el : {}
      const style = {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
      this.outerStyle = style
      this.parentWidth = this.$el.parentNode
        ? this.$el.parentNode.offsetWidth
        : 0
      this.zoomWidth = el.offsetWidth
      this.widthBak = this.$el.offsetWidth
      this.$nextTick(function() {
        this.heightBak = this.$el.firstElementChild.offsetHeight
        const comp = this.$refs.comp
        if (comp) {
          this.innerHeightBak = comp.offsetHeight
          const item = this.item
          if (this.item.height < comp.offsetHeight) {
            item.height = comp.offsetHeight
            if (item.iframe) {
              item.iframe.height = comp.offsetHeight
            }
          }
        }
      })
      return style
    },
    autoResetPos() {
      clearTimeout(this.timer)
      if (!this.isDroging && !this.isZooming) {
        this.timer = setTimeout(this.resetPos, 50)
      }
    },
    zoomDown(e, type) {
      const el = this.$el
      this.widthBak = el.offsetWidth
      this.$nextTick(function() {
        this.heightBak = this.$el.firstElementChild.offsetHeight
        const comp = this.$refs.comp
        if (comp) {
          this.innerHeightBak = comp.offsetHeight
        }
      })
      this.widthToBe = this.comWidth
      this.zoomWidth = el.elWidth
      this.zoomPad = '0'
      this.scaleParams = null
      this.scale = true
      this.scaleOutLimit = false
      if (type) {
        // type 0缩放高度 1缩放r宽度
        this.isZoomingR = true
      } else {
        this.isZoomingB = true
      }
      this.$emit('zoomDown', {
        e,
        item: this.item,
        row: this.row
      })
      this.resetPos()
    },
    mouDown(e) {
      this.$emit('mouDown', {
        e,
        item: this.item,
        row: this.row
      })
      this.resetPos()
      this.absolute = true
      this.$nextTick(function() {
        this.$store.commit('dashboard/setReset', true)
      })
    },
    mouUp(e) {
      this.absolute = false
      this.$emit('mouUp', e)
    },
    handleCommand(command) {
      // 删除组件组件
      if (command === '0') {
        this.$emit('deleteComp', {
          row: this.row,
          item: this.item
        })
      }
      if (command === '1') {
        this.$emit('updateIframe', {
          row: this.row,
          item: this.item
        })
      }
    }
  },
  computed: {
    // 缩放类型 0：待定状态 1：缩小操作 2：放大操作
    scaleWidthType() {
      let type = 0
      const widthBak = this.widthBak
      if (this.isZoomingR && this.zoomR !== null) {
        const changeWi = this.zoomR + this.scaleBorder + 2
        if (widthBak > changeWi) {
          type = 1
        } else if (widthBak < changeWi) {
          type = 2
        } else {
          type = 0
        }
      }
      return type
    },
    // 最外层class
    itemClass() {
      return [
        'drag',
        ...(this.isZooming
          ? this.wdClass
          : [`wd_${this.comWidth}`, 'enable_transition']),
        ...(this.isZoomingB ? ['maxZindex'] : []),
        ...(this.isDroging ? ['noZoomLine'] : [])
      ]
    },
    // 最外层style
    itemStyle() {
      const style = {
        height: this.absolute && this.comWidth === 12 ? '16px' : 'auto'
      }
      return this.isZoomingR
        ? { ...style, width: `${this.zoomWidth}px` }
        : style
    },
    zoomR() {
      if (this.isZoomingR) {
        const reduce = this.scaleBorder + 2
        const maxLeft = this.outerStyle.width - reduce
        const moveX = this.isZooming && this.scale ? this.moveVal.x : 0
        const parentWidth = this.parentWidth / 100
        const widthPe = (maxLeft + moveX + reduce) / parentWidth
        if (widthPe > this.wdList['8']) {
          return parentWidth * this.wdList['8'] - reduce
        }
        if (
          Math.abs(widthPe - this.wdList['4']) < 0.00001 ||
          widthPe <= this.wdList['4']
        ) {
          return parentWidth * this.wdList['4'] - reduce
        }
        return maxLeft + moveX
      }
      return null
    },
    // 高度缩放遇到相邻高度相等时
    isAlign() {
      return (
        this.isZoomingB &&
        this.row.some(item => {
          return (
            item &&
            item !== this.item &&
            Math.abs(item.height - this.item.height) <= 2
          )
        })
      )
    },
    // 左右缩放覆盖区域宽度
    zoomR_HideWidth() {
      let width = 0
      if (this.isZoomingR) {
        // 缩放类型 0：待定状态 1：缩小操作 2：放大操作
        if (this.scaleOutLimit) {
          return width
        }
        if (this.scaleWidthType === 0) {
          width = 0
        } else {
          const reduce = Math.abs(
            this.wdList[this.scaleParams.width] - this.wdList[this.comWidth]
          )
          let can = 0
          if (reduce > 0) {
            can = (reduce * this.parentWidth) / 100
          }
          width =
            (this.scaleWidthType === 2
              ? this.moveVal.x - can
              : -this.moveVal.x - can) - 2
        }
      }
      return width
    },
    // 显示被over到的wd_0待放置状态
    showHolde() {
      return this.overHolderItem === this.item
    },
    // 控制拖拽时边框样式
    borderStyle() {
      let style = {}
      if (this.type) {
        style = {
          height: this.absolute ? '16px' : 'auto',
          /* outlineColor: `rgba(51, 102, 255, ${this.absolute ? 1 : 0})`, */
          backgroundColor: this.absolute ? '#EDEFF5' : 'transparent'
        }
      }
      if (this.showHolde) {
        style.outlineColor = 'rgba(51, 102, 255, 1)'
        style.backgroundColor = '#EDEFF5'
      }
      return style
    },
    // 内部模块样式
    moveStyle() {
      let moveX = 0
      let moveY = 0
      const style = {}
      if (this.absolute) {
        // transform位移方案，更流畅
        style.transform = `translate(${this.moveVal.x}px, ${this.moveVal.y}px) scale(0.6)`
        style.transformOrigin = `${this.scaleX * 100}% 0 0`
      }
      if (this.isZoomingR) {
        style.padding = this.zoomPad
      }
      style.minHeight = `${this.item.height}px`
      return style
      /* absolute位移方案，下方.absolute的position属性需要对应更改
      保留方案，误删
      return {
        top: boo ? `${this.outerStyle.top + moveY}px` : '0',
        left: boo ? `${this.outerStyle.left + moveX}px` : '0',
        width: boo ? `${this.outerStyle.width}px` : '100%',
        height: boo ? `${this.outerStyle.height}px` : '100%'
      } */
    }
  },
  watch: {
    // 当前模块是被相邻模块挤压状态时，配合改变自身宽度
    'anotherScaleItem.type'(newV, oldV) {
      if (this.anotherScaleItem.item === this.item) {
        if (newV === 0) {
          this.wdClass = ['wd_8']
          this.scaleParams = {
            width: 8
          }
        } else if (newV === 1) {
          this.wdClass = ['wd_6']
          this.scaleParams = {
            width: 6
          }
        } else if (newV === 2) {
          this.wdClass = ['wd_4']
          this.scaleParams = {
            width: 4
          }
        } else {
          this.wdClass = [`wd_${this.comWidth}`]
        }
      }
    },
    // 缩放高度时，动态改变item.height
    'moveVal.y'(newV, oldV) {
      if (newV && this.isZoomingB) {
        const val = this.heightBak + newV
        const iframe = this.item.iframe
        let height = 0
        if (iframe) {
          height = val < 400 ? 400 : val > 1080 ? 1080 : val
          iframe.height = height
        } else {
          const mixH = this.innerHeightBak
          height = val < mixH ? mixH : val
        }
        this.item.height = height
      }
    },
    zoomR(newV, oldV) {
      let width = null
      let zoomPad = '0'
      if (newV && this.scaleWidthType && this.isZooming && this.scale) {
        this.scaleOutLimit = false
        // 缩放总体宽度 + 外层border
        const scaleWidth = newV + this.scaleBorder + 2
        const parentWidthPerc = this.parentWidth / 100
        const rPercent = scaleWidth / parentWidthPerc
        const wdList = this.wdList
        /* scaleWidthType:缩放类型 0：待定状态 1：缩小操作 2：放大操作 */
        if (
          rPercent < wdList['4'] ||
          Math.abs(rPercent - wdList['4'] < 0.00001)
        ) {
          // 预览宽度为wd_4，且缩放整体宽度不能小于wdList['3']，总长为wd_4
          this.scaleOutLimit = true
          width = parentWidthPerc * wdList['4']
          this.widthToBe = 4
          zoomPad = '0'
          this.scaleParams = {
            width: 4
          }
          this.$emit('zoomAnotherItem', 0)
        } else if (rPercent > wdList['4'] && rPercent < wdList['6']) {
          // 预览宽度为wd_4，总长为wd_6
          width = parentWidthPerc * wdList['6']
          this.widthToBe = 6
          zoomPad =
            this.scaleWidthType === 2
              ? `0 ${width - parentWidthPerc * wdList['4']}px 0 0`
              : `0`
          this.scaleParams = {
            width: this.scaleWidthType === 2 ? 4 : 6
          }
          this.$emit('zoomAnotherItem', 1)
        } else if (
          (Math.abs(rPercent - wdList['6']) < 0.00001 ||
            rPercent > wdList['6']) &&
          rPercent < wdList['8']
        ) {
          // 预览宽度为wd_6，总长为wd_8
          width = parentWidthPerc * wdList['8']
          this.widthToBe = 8
          zoomPad =
            this.scaleWidthType === 2
              ? `0 ${width - parentWidthPerc * wdList['6']}px 0 0`
              : `0`
          this.scaleParams = {
            width: this.scaleWidthType === 2 ? 6 : 8
          }
          this.$emit('zoomAnotherItem', 2)
        } else {
          this.scaleOutLimit = true
          this.widthToBe = 8
          this.scaleParams = {
            width: 8
          }
          width = parentWidthPerc * wdList['8']
          this.widthToBe = 8
          zoomPad = `0`
          this.$emit('zoomAnotherItem', 2)
        }
      } else {
        width = null
        zoomPad = '0'
      }
      this.zoomWidth = width
      this.zoomPad = zoomPad
    },
    isDroging(newV, oldV) {
      if (newV !== oldV && !newV) {
        this.absolute = false
        this.scaleX = null
        return
      }
      if (newV !== oldV && newV) {
        this.$nextTick(function() {
          const pos = this.outerStyle
          this.scaleX = (this.dragPos.x - pos.left) / pos.width
        })
      }
    },
    isZooming(newV, oldV) {
      if (newV !== oldV && !newV) {
        if (this.scale) {
          const obj = {
            row: this.row,
            item: this.item,
            newItem: {
              ...this.item
            }
          }
          if (this.isZoomingR) {
            obj.newItem.width = this.widthToBe
            obj.anotherWidth = 12 - this.widthToBe
          }
          this.$emit('updateZoomRow', obj)
        }
        this.$nextTick(function() {
          this.scale = false
          this.isZoomingB = false
          this.isZoomingR = false
          this.scaleParams = null
          this.wdClass = [`wd_${this.comWidth}`]
          this.scaleOutLimit = false
        })
      }
    },
    dragPos(newV, oldV) {
      if (newV && this.isDroging) {
        const os = this.outerStyle
        const posOver =
          newV.x > os.left + 1 &&
          newV.x < os.left + os.width - 1 &&
          newV.y > os.top + 1 &&
          newV.y < os.top + os.height - 1
        if (posOver) {
          this.$nextTick(function() {
            this.$emit(
              'setOverItem',
              {
                row: this.row,
                item: this.type ? null : this.item // null 拖拽悬停在此时状态为[wd_4, wd_6, wd_12]的当前drag组件的元素上时
              },
              this.item,
              this.type ? newV.x < os.left + os.width / 2 - 1 : null
            )
          })
        }
      }
    },
    '$store.state.dashboard.reset'(newV, oldV) {
      this.wdClass = [`wd_${this.comWidth}`]
      if (this.isDroging && newV) {
        this.resetPos()
      } else if (!this.isDroging && !newV) {
        this.$nextTick(function() {
          setTimeout(this.resetPos, 100)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
$scaleBorder: 6px;
.enable_transition {
  transition-property: width, height;
  transition-duration: 100ms;
  transition-timing-function: ease;
  transition-delay: 0s;
}
.drag {
  position: relative;
  border: 1px solid rgba(245, 245, 245, 0);
  @include border-box;
  &_move {
    background-color: white;
    width: 100%;
    position: relative;
    outline: #f5f5f5 solid 1px;
    .drag_control {
      cursor: move;
      position: absolute;
      left: 0;
      right: 44px;
      height: 58px;
      z-index: 99;
    }
    .drag_control_delete {
      position: absolute;
      top: 20px;
      right: 10px;
      z-index: 99;
      font-size: 16px;
      transform: rotateZ(90deg);
      color: #000000;
    }
  }
  &_zoom {
    background-color: #e5e9f5;
  }
  &_zoom_b {
    background-color: rgb(247, 249, 255);
  }
}
.wd_0 {
  width: 2%;
}
.wd_4 {
  width: 30%;
  width: 30.66%;
  width: calc(92% / 3);
}
.wd_6 {
  width: 47%;
}
.wd_8 {
  width: 63%;
  width: 63.34%;
  width: calc(94% - 92% / 3);
}
.wd_12 {
  width: 96%;
}
.wd_100 {
  width: 96%;
  margin: 0 2%;
  height: 18px !important;
}
.absolute {
  z-index: 100;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
}
.holder {
  height: 100%;
}
.dragIng {
  cursor: grabbing !important;
}
.border_box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: rgba(51, 102, 255, 0) dashed 2px;
}
.noZoomLine {
  .drag_move {
    outline: none;
  }
  .zoom {
    opacity: 0 !important;
  }
}
.zoom {
  padding: 2px;
  position: absolute;
  cursor: pointer;
  overflow: visible;
  z-index: 1000;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
}
.zoom::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: #3366ff;
}
.zoom_r {
  top: 0;
  left: 0;
  padding: 0 2px;
  width: $scaleBorder;
  height: 100%;
  cursor: e-resize !important;
}
.zoom_b {
  bottom: 0;
  left: 0;
  width: 100%;
  height: $scaleBorder;
  cursor: n-resize !important;
}
.scale {
  outline: #3366ff dashed 2px;
}
.zoom_b_align::before {
  content: '';
  display: block;
  float: left;
  width: 3000px;
  height: 0;
  border: 1px dashed #3366ff;
  margin-left: -800px;
}
.zoom_r_hide_move {
  float: left;
  background-color: rgb(247, 249, 255);
  height: 100%;
}
.zoom_r_hide_moveR {
  float: left !important;
  margin-left: -2px;
  transform: translateX(-100%);
}
.zoom_r_hide_moveL {
  float: right !important;
  margin-right: -2px;
  transform-origin: 100% 0%;
  transform: translateX(100%);
}
.scaleModel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(239, 243, 255, 0.5);
}
.maxZindex {
  z-index: 999;
}
</style>
