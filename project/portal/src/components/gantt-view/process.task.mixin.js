export default {
  methods: {
    processData(tasks) {
      let result = tasks.reduce((arr, t) => {
        let taskListQueryRes = t.taskListQueryRes
        delete t.taskListQueryRes
        let start = new Date(t.startTime.replace(/-/g, '/')).getTime()
        let end = new Date(t.endTime.replace(/-/g, '/')).getTime()
        let duration = end - start
        if (new Date(start).getDate() === new Date(end).getDate() && duration < 24 * 3600 * 1000) {
          start = new Date(t.startTime.replace(/-/g, '/').split(' ')[0]).getTime()
          // 同一天的时间段默认为一天
          duration = 24 * 3600 * 1000
        }
        let y = Object.assign({
          ...t
        }, {
          id: t.formLayerId,
          label: t.label,
          start,
          duration,//new Date(t.endTime.replace(/-/g, '/')).getTime() - start,
          percent: 100,
          type: 'task',
          collapsed: true,
          status: t.status,
          flow: true,
          _startTime: t.startTime,
          _endTime: t.endTime
        })
        delete y.dependentOn
        delete y.startTime
        delete y.endTime
        arr.push(y)
        if (taskListQueryRes) {
          let childs = taskListQueryRes.map(ct => {
            let s = new Date(ct.startTime.replace(/-/g, '/')).getTime()
            let e = new Date(ct.endTime.replace(/-/g, '/')).getTime()
            let x = {
              ...ct
            }
            let d = end - start
            if (new Date(s).getDate() === new Date(e).getDate() && d < 24 * 3600 * 1000) {
              s = new Date(ct.startTime.replace(/-/g, '/').split(' ')[0]).getTime()
              // 同一天的时间段默认为一天
              d = 24 * 3600 * 1000
            }
            Object.assign(x, {
              start: s,
              duration: d,//new Date(t.endTime.replace(/-/g, '/')).getTime() - start,
              percent: 100,
              type: 'task',
              parentId: t.formLayerId,
              _startTime: ct.startTime,
              _endTime: ct.endTime
            })
            if (!x.dependentOn || x.dependentOn.length < 1) {
              delete x.dependentOn
            } else {
              x.dependentOn = x.dependentOn.map(d => {
                let xt = taskListQueryRes.find(({flowUniqueId}) => flowUniqueId == d)
                if (xt) {
                  return xt.id
                }
                return d
              })
            }
            delete x.startTime
            delete x.endTime
            return x
          })
          arr = arr.concat(childs)
        }
        return arr
      }, []).map(t => {
        if (t.type == 'task') {
          t.style = t.style || {}
          t.style.base = t.style.base || {}
          if (t.status == 1) {
            t.style.base.fill = 'rgba(92, 138, 255, 1)'
          } else if (t.status == 2) {
            t.style.base.fill = 'rgb(173, 196, 255)'//'rgba(92, 138, 255, .5)'
          } else {
            t.style.base.fill = 'rgba(191, 191, 191, 1)'
          }
          t.style.base.stroke = 'transparent'
          t.style['chart-dependency-lines-path'] = t.style['chart-dependency-lines-path'] || {}
          t.style['chart-dependency-lines-path'].stroke = this.cacheColor()
        }
        return t
      })
      console.log(result)
      return result
    },
    cacheColor() {
      this.lineColors = this.lineColors || new Set()
      let color = this.$helper.color(1)
      while (this.lineColors.has(color)) {
        color = this.$helper.color(1)
      }
      this.lineColors.add(color)
      return color
    }
  }
}