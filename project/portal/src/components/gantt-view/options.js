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
      display: false
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
        html: true
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
export default options
/*
  {
    id, // 编号
    label, // 名称
    parent, // 父级的id（控制收缩归属）
    start, // 开始时间(毫秒)
    duration, // 持续时间(毫秒)
    percent, // 完成百分比
    type,    // 类型
    dependentOn, // 依赖项（控制连线）
    style // 样式（控制填充色和填充边框色）{base: {fill, stroke}}
  }
 */
/*let tasks = [
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
    //style: {base: {fill: "#1EBC61",stroke: "#0EAC51"}},
    dependentOn: [1],
    status: 0
  },
  {
    id: 3,
    label: "Courage is being scared to death, but saddling up anyway.",
    parentId: 1,
    start: getDate(-24 * 3),
    duration: 2 * 24 * 60 * 60 * 1000,
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
  }
]*/