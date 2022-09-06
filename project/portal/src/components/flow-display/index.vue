<template>
  <div class="flow-container">
    <div class="flow-container-svg" ref="flow_parent">
      <div id="flow_svg" ref="flow_container" v-if="showFlow">
        {{ xml ? '' : message }}
      </div>
    </div>
    <div class="flow-zoom" v-if="xml">
      <span @click.prevent.stop="zoom(-1)"><i class="el-icon-minus"></i></span>
      <el-input type="number" max="100" min="50" v-model="size"
        ><i slot="append">%</i></el-input
      >
      <span @click.prevent.stop="zoom(1)"><i class="el-icon-plus"></i></span>
    </div>
  </div>
</template>
<script>
import FlowHelper from '~/utils/flow'
export default {
  name: 'flow-display',
  props: {
    xml: {
      type: String,
      default: _ => ''
    },
    message: {
      type: String,
      default: _ => 'error'
    },
    persons: {
      type: Array,
      default: _ => []
    },
    hasHover: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      size: 100,
      showFlow: true
    }
  },
  created() {
    this.$FlowHelper = FlowHelper
  },
  watch: {
    size(v, old) {
      if (v > 200 || v < 50) {
        if (v > 100) v = 200
        if (v < 50) v = 50
        this.size = v
        return
      }
      this.graph.zoomTo(v / 100)
      this.resetPosition()
    },
    xml(v) {
      if (v) {
        // 解决更换xml后显示异常bug
        this.showFlow = false
        setTimeout(() => {
          this.showFlow = true
          this.$nextTick(function() {
            this.init()
          })
        })
      }
    }
  },
  mounted() {
    if (this.xml) {
      this.init()
    }
  },
  methods: {
    init() {
      let noNeed = false
      if (this.$route.params.rootProcessExec !== undefined) {
        noNeed = true
        FlowHelper.loadShapes('rgba(51, 102, 255)')
      }
      let xml = this.preParseXML(this.xml)
      this.graph = FlowHelper.display(
        xml,
        this,
        document.getElementById('flow_svg'),
        null,
        noNeed,
        this.hasHover
      )
      FlowHelper.getTaskCells(this.graph).forEach(t => {
        FlowHelper.updateCellAttrs(this.graph, t, {
          label: t.value
        })
      })
      this.insertValue()
      if (this.graph) {
        this.graph.container.classList.remove('geDiagramContainer')
        this.resetPosition()
      }
    },
    zoom(b) {
      this.size = Number(this.size) + Number(b)
    },
    updateCellAttrs(cell, attrs) {
      FlowHelper.updateCellAttrs(this.graph, cell, attrs)
    },
    resetPosition() {
      let { x, y, width, height } = this.graph.view.canvas.getBBox()
      this.graph.panGraph(0 - x + 10, 0 - y + 10)
      this.graph.panningHandler.mouseMove = function() {}
      this.graph.container.style.cursor = 'default'
      this.graph.view.canvas.farthestViewportElement.style.minWidth =
        width + 20 + 'px'
      this.graph.view.canvas.farthestViewportElement.style.minHeight =
        height + 20 + 'px'
    },
    insertValue() {
      let json = JSON.parse(this.xml)
      let cells = Object.values(this.graph.model.cells)
      json.tasks.forEach(t => {
        let { color, name } =
          this.persons.find(p => p.id == (t.attrs && t.attrs.assignee)) || {}
        let cell = cells.find(c => c.id == t.id)
        this._setCellValue(cell, name, color, t.value, t.attrs.executorPost)
      })
      this.resetPosition()
    },
    _setCellValue(cell, name, color, value, post) {
      if (!cell) {
        return
      }
      let t = JSON.parse(this.xml).tasks.find(
        t => t.id == cell || t.id == cell.id
      )
      if (typeof cell == 'string') {
        cell = Object.values(this.graph.model.cells).find(c => c.id == cell)
        value = value || (t && t.attrs && t.attrs.label) || ''
      }
      if (name || post || cell.flow === 'flow') {
        let { width, height } = cell.geometry
        const status = parseInt(t.attrs.status, 10)
        let opacity =
          this.$route.path.indexOf('flow-detail') > -1
            ? status === 2
              ? 0.5
              : 1
            : 1
        color = color ? this.$helper.color2rgba(color, opacity) : ''
        let wStyle = `width: ${width}px; height: ${height}px; display: -webkit-box; display: -ms-flexbox; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: justify; -ms-flex-pack: justify; display: flex;justify-content: space-between;`
        let pStyle = `${
          cell.flow == 'condition'
            ? 'align-self: center; margin-bottom: 6px;'
            : 'margin-left: 12px; margin-bottom: 6px;'
        } height: 24px; text-align: left; line-height: 24px; font-size: 12px; color:${
          status === 1 || status === 0 ? 'white;' : 'rgba(0,0,0,0.65);'
        }${name && cell.flow !== 'flow' ? '' : 'display:none;'}`
        let tStyle = `${
          cell.flow == 'condition'
            ? 'margin-left: 24px; margin-right: 24px; margin-top: 20px; text-align: center;'
            : 'margin-left: 12px; margin-right: 12px; margin-top: 18px; text-align: left;'
        } overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 14px; color:${
          status === 1 || status === 0 ? 'white;' : '#333;'
        };`
        const blackList = ['template-detail'] // 隐藏子流程展开按钮名单
        const showSubFlowBtn = !blackList.some(val =>
          this.$route.path.includes(val)
        )
        let fStyle = `${
          cell.flow == 'condition'
            ? 'align-self: center; margin-bottom: 6px;'
            : 'margin-left: 0px; margin-bottom: 8px;padding-right:18px;'
        }  height: 24px; cursor:pointer; text-align: right; line-height: 24px; font-size: 12px; color:${
          status === 1 || status === 0
            ? 'white;'
            : status === 2
            ? '#3366FF;'
            : 'rgba(0,0,0,0.6);'
        };${cell.flow === 'flow' && showSubFlowBtn ? '' : 'display:none;'}`
        let eStyle = `${
          post && !name
            ? 'margin:0 12px 10px;white-space:nowrap;font-size:12px;text-align:' +
              (cell.flow === 'task' ? 'left' : 'center') +
              ';'
            : 'display:none;'
        }`
        FlowHelper.setCellValue(
          this.graph,
          cell,
          `<div title="双击查看节点信息" style="${wStyle}">\
            <div title="${value}" style="${tStyle}">${value}</div>\
            <div title="${name}" style="${pStyle}">${name}</div>\
            <div title="点击展开子流程" class="subflow-btn" style="${fStyle}">点击展开子流程</div>\
            <div title="推荐岗位" style="${eStyle}">推荐岗位:${post}</div>\
          </div>`
        )
      } else {
        if (cell.flow === 'robot') {
          var w = cell.geometry.width
          let s = `width:${w -
            24}px;margin-left:auto;margin-right:auto;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`
          const botStyle = `text-align: left;font-size: 14px;position: relative;top: -20px;color:#333;`
          s += botStyle
          value = `<div title="${value}" style="${s}">${value}</div>`
        }
        FlowHelper.setCellValue(this.graph, cell, value)
      }
    },
    setCellValue(cell, name, color, value, post) {
      this._setCellValue(cell, name, color, value, post)
      this.resetPosition()
    },
    resetCell(cell, color) {
      window.graphx = this.graph
      this.graph.setCellStyles('strokeColor', color || '#999', [cell])
      this.resetPosition()
    },
    preParseXML(xml) {
      xml = JSON.parse(xml)
      xml.cells.forEach(t => {
        if (t.style) t.style.strokeWidth = 1
      })
      xml.tasks.forEach(t => {
        if (t.style) t.style.strokeWidth = 1
        t.value = t.attrs.labels
      })
      return JSON.stringify(xml)
    }
  }
}
</script>
<style lang="scss" src="./index.scss" scoped />
