export default {
  beforeDestroy() {
    if (this._tip) {
      document.body.removeChild(this._tip)
    }
  },
  methods: {
    showTip({event, data}) {
      if (this.hideTipTimer) clearTimeout(this.hideTipTimer)
      if (this.tip) {
        if (this.tip.parentNode.lastChild != this.tip) {
          this.tip.parentNode.appendChild(this.tip)
        }
        this.setTipxy(event, data, this.tip)
        this.tip.lastX = this.tip.getAttribute('x')
        this.tip.lastY = this.tip.getAttribute('y')
      } else {
        this.tip = this.appendTip(event, data)
      }
    },
    hideTip() {
      if (this.hideTipTimer) clearTimeout(this.hideTipTimer)
      this.hideTipTimer = setTimeout(_ => {
        this.tip.lastX = this.tip.getAttribute('x')
        this.tip.lastY = this.tip.getAttribute('y')
        this.tip.setAttribute('x', '-100%')
        this.tip.setAttribute('y', '-100%')
      }, 100)
    },
    appendTip(e, data) {
      let tip = this.setTipxy(e, data)
      let that = this
      tip.onmouseover = function (e) {
        if (that.hideTipTimer) clearTimeout(that.hideTipTimer)
        if (that.tip.lastX) that.tip.setAttribute('x', that.tip.lastX)
        if (that.tip.lastY) that.tip.setAttribute('y', that.tip.lastY)
      }
      tip.onmouseout = function (e) {
        that.hideTip()
      }
      e.target.parentNode.parentNode.parentNode.appendChild(tip)
      return tip
    },
    setTipxy(e, data, tip = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')) {
      let {w, h} = this.getTipWH(data)
      let target = e.target
      let y0 = +target.getAttribute('y')
      let position = 'top'
      let {height: H, left: L} = target.parentNode.parentNode.parentNode.getClientRects()[0]
      let y = y0 + (+target.getAttribute('height'))
      let x = e.clientX - L - w / 2
      if (H - y < h) {
        y = y0 - h
        position = 'bottom'
      }
      tip.setAttribute('x', x)
      tip.setAttribute('y', y)
      tip.setAttribute('width', w)
      tip.setAttribute('height', h)
      tip.innerHTML = this.createDom(data, position)
      return tip
    },
    getTipWH(data) {
      let _tip = this._tip
      this._tip = this._tip || document.createElement('div')
      this._tip.innerHTML = this.createDom(data)
      if (!_tip) {
        this._tip.style.opacity = 0
        this._tip.style.position = 'fixed'
        this._tip.style.zIndex = -1
        document.body.appendChild(this._tip)
      }
      let w = this._tip.offsetWidth
      let h = this._tip.offsetHeight
      return {w, h}
    },
    createDom({label, _startTime: startTime, _endTime: endTime, assignee = '', status, flow}, position) {
      assignee = flow || !assignee ? '' : assignee
      position = position || 'top'
      let style = 'font-family:"Microsoft YaHei";font-size: 12px;font-weight: normal;color: rgba(0, 0, 0, 0.627);height: 100%;display: inline-block;'
      let tooltipStyle = "position: relative; white-space: nowrap; padding: 8px;"
      let tooltipInnerStyle = "padding: 10px;background:#fff;box-shadow:0px 0px 10px 0px rgba(51,51,51,0.1);"
      let titleStyle = "overflow:hidden; width: 270px;margin-bottom: 8px;"
      let statusStyle = "float:right;width: 52px;margin-top:3px;padding: 2px 0;font-size: 12px;border-radius: 12px;text-align: center; background:#f0f0f0; color: #999;" + (status == 1 ? 'background-color: rgba(51, 102, 255, 0.1);color: #3366ff;' : status == 2 ? 'background: rgba(51, 102, 255, 0.1);color: rgba(51, 102, 255, 0.8);opacity: 0.8;' : '')
      let labelStyle = "width: 200px; overflow: hidden; height: 21px; line-height: 21px; float: left; white-space:nowrap; color: #333; font-size: 14px;    text-overflow: ellipsis;"
      let dateStyle = "margin-bottom: 8px;overflow: hidden; color: #999;"
      let angleStyle = "position:absolute;width:10px;height:10px;background-color:#fff;left:50%;margin-left:-5px;transform: rotate(45deg);box-shadow: -1px -1px 1px rgba(51,51,51, .1);" + position + ": 3px;" + (position === 'bottom' ? "box-shadow: 1px 1px 1px rgba(51,51,51, .1);" : "")
      status = this.$constant.TASK_STATUS[status].name || 'unknown'

      return `<div xmlns="http://www.w3.org/1999/xhtml" class="gantt-elastic__tip-text" style='${style}'>
              <div class="gantt-elastic__tip-text-content" style="${tooltipStyle}">
                <i style="${angleStyle}"></i>
                <div class="gantt-elastic__tip-text-content-inner" style="${tooltipInnerStyle}">
                  <div class="gantt-elastic__tip-text-content-title" style="${titleStyle}">
                    <div class="gantt-elastic__tip-text-content-title-text" style="${labelStyle}">${label}</div>
                    <div class="gantt-elastic__tip-text-content-title-status" style="${statusStyle}">${status}</div>
                  </div>
                  <div class="gantt-elastic__tip-text-content-date" style="${dateStyle}">
                    <div class="gantt-elastic__tip-text-content-start" style="display:inline-block;">${startTime}</div>
                    <div class="gantt-elastic__tip-text-content-delimeter" style="display:inline-block;">至</div>
                    <div class="gantt-elastic__tip-text-content-end" style="display:inline-block;">${endTime}</div>
                  </div>
                  <div class="gantt-elastic__tip-text-content-assignee">${assignee}</div>
                </div>
              </div>
            </div>`
    },
    clearTip() {
      if (this.tip) {
        this.tip.onmouseover = null
        this.tip.parentNode.removeChild(this.tip)
        this.tip = null
      }
    }
  }
}