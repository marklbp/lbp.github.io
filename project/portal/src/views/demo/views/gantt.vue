<template>
  <gantt
    :options="options"
    :tasks="tasks"
    @chart-task-mouseenter="showTip"
    @chart-task-mouseout="hideTip"
  />
</template>
<script>
function getDate (hours) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const timeStamp = new Date(currentYear, currentMonth, currentDay, 0, 0, 0).getTime()
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
}
/*
  {
    id, // 编号
    label, // 名称
    parentId, // 父级的id（控制收缩归属）
    start, // 开始时间(毫秒)
    duration, // 持续时间(毫秒)
    percent, // 完成百分比
    type,    // 类型
    dependentOn, // 依赖项（控制连线）
    style // 样式（控制填充色和填充边框色）{base: {fill, stroke}}
  }
 */
let tasks = [
  {
    id: 1,
    label: "Make some noise",
    start: getDate(-24 * 5),
    duration: 7 * 24 * 60 * 60 * 1000,
    percent: 85,
    type: "task",
    collapsed: true,
    status: 1
  },
  {
    id: 2,
    label: "With great power comes great responsibility",
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    percent: 100,
    type: "task",
    /*style: {
      base: {
        fill: "#1EBC61",
        stroke: "#0EAC51"
      }
    },*/
    dependentOn: [1],
    status: 0
  },
  {
    id: 3,
    label: "Courage is being scared to death, but saddling up anyway.",
    parentId: 1,
    start: getDate(-24 * 3),
    duration: 4 * 24 * 60 * 60 * 1000,
    percent: 100,
    type: "task",
    dependentOn: [2],
    status: 1
  },
  {
    id: 4,
    label: "Put that toy AWAY!",
    parentId: 1,
    start: getDate(-24 * 2),
    duration: 2 * 24 * 60 * 60 * 1000,
    percent: 50,
    type: "task",
    dependentOn: [2],
    style: {
      'chart-dependency-lines-path': {//控制线的颜色
        stroke: 'red'
      }
    },
    status: 2
  },
  {
    id: 5,
    label:
      "One billion, gajillion, fafillion... shabadylu...mil...shabady......uh, Yen.",
    parentId: 1,
    start: getDate(0),
    duration: 2 * 24 * 60 * 60 * 1000,
    percent: 100,
    type: "task",
    style: {
      base: {
        fill: "blue",
        stroke: "#0077C0"
      }
    },
    status: 3
  },
  {
    id: 6,
    label: "Make some noise22222222222222",
    start: getDate(-24 * 5),
    duration: 10 * 24 * 60 * 60 * 1000,
    percent: 85,
    type: "project",
    collapsed: true
  },
  {
    id: 7,
    label: "great responsibility",
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    percent: 100,
    type: "task",
    /*style: {
      base: {
        fill: "#1EBC61",
        stroke: "#0EAC51"
      }
    },*/
    dependentOn: [1],
    status: 0
  }
]
tasks.forEach(t => {
  if (t.type == 'task') {
    t.style = t.style || {}
    t.style.base = t.style.base || {}
    if (t.status == 1) {
      t.style.base.fill = 'rgba(92, 138, 255, 1)'
    } else if (t.status == 2) {
      t.style.base.fill = 'rgba(92, 138, 255, .5)'
    } else {
      t.style.base.fill = 'rgba(191, 191, 191, 1)'
    }
    t.style.base.stroke = 'transparent'
  }
})
let options = {
  taskMapping: {
    progress: "percent"
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: false
    },
    day: {
      height: 30, //*
      display: true, //*
      widths: [],
      maxWidths: { short: 0, medium: 0, long: 0 },
      format: {
        long(date) {
          return date.format('D dddd').replace(/\s+/, '日 ')
        },
        medium(date) {
          return date.format('D ddd').replace(/\s+/, '日 ')
        },
        short(date) {
          return date.format('D') + '日 '
        }
      }
    },
    month: {
      height: 30, //*
      display: true, //*
      widths: [],
      maxWidths: { short: 0, medium: 0, long: 0 },
      format: {
        //*
        short(date) {
          return date.format('MM')
        },
        medium(date) {
          return date.format("YY 'MMM").replace(/\s+/, '年')
        },
        long(date) {
          return date.format('YYYY MMMM').replace(/\s+/, '年')
        }
      }
    }
  },
  chart: {
    progress: {
      bar: false
    },
    expander: {
      display: true
    },
    text: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: false
    },
    columns: [
      {
        id: 1,
        label: "名称",
        value: "label",
        width: 200,
        expander: true,//控制收缩展开
        html: true/*,
        events: {
          click({ data, column }) {
            alert("description clicked!\n" + data.label);
          }
        }
        ,style: {
          "task-list-header-label": {"text-align": "center",width: "100%"},
          "task-list-item-value-container": {"text-align": "center",width: "100%"}
        }*/
      }
    ]
  },
  locale: {
    name: "zh-CN",
    weekdays: ['周一','周二','周三','周四','周五','周六','周日'],
    weekdaysShort: ['一','二','三','四','五','六','日'],
    weekdaysMin: ['一','二','三','四','五','六','日'],
    months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    monthsShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    formats: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY MMMM D',
      LLL: 'YYYY MMMM D HH:mm',
      LLLL: 'YYYY MMMM D HH:mm, dddd'
    }
  }
}

export default {
  components: {
    gantt: _ => import('~/components/gantt')
  },
  data() {
    return {
      tasks,
      options,
      dynamicStyle: {},
      lastId: 16
    };
  },
  mounted() {
    console.log(this.tasks)
  },
  methods: {
    showTip({event, data}) {
      if (this.hideTipTimer) clearTimeout(this.hideTipTimer)
      if (this.tip) {
        let {w, h} = this.getTipWH(data)
        this.setTipxy(event, w, h, data, this.tip)
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
      let {w, h} = this.getTipWH(data)
      let tip = this.setTipxy(e, w, h, data)
      tip.setAttribute('width', w)
      tip.setAttribute('height', h)
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
    setTipxy(e, w, h, data, tip = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')) {
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
      tip.innerHTML = this.createDom(data, position)
      return tip
    },
    getTipWH(data) {
      let w = 0
      let h = 0
      if (this.tip) {
        h = +this.tip.getAttribute('height')
        w = +this.tip.getAttribute('width')
        return {w, h}
      }
      let tip = document.createElement('div')
      tip.innerHTML = this.createDom(data)
      tip.style.opacity = 0
      tip.style.position = 'fixed'
      tip.style.zIndex = -1
      document.body.appendChild(tip)
      w = tip.offsetWidth
      h = tip.offsetHeight
      document.body.removeChild(tip)
      return {w, h}
    },
    createDom({label, startTime, endTime, assignee, status}, position) {
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
    }
  }
}
</script>
<style lang="scss">
  .gantt-elastic__calendar-row-rect.gantt-elastic__calendar-row-rect--month {
    border-bottom: 1px solid #dadada
  }
</style>