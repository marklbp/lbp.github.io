import { shapes } from './shapes'
mxConstants.DEFAULT_FONTSIZE = 14
var lan = 'zhCN'
var language = {
  zhCN: {
    shape_start_text: '开始',
    shape_terminal_text: '结束',
    shape_task_text: '新建任务',
    shape_condition_text: '决策环节',
    shape_merge_text: '合并',
    shape_branch_text: '分支',
    shape_flow_text: '新建任务流',
    shape_task_title: '任务',
    shape_condition_title: '决策',
    shape_merge_title: '合并',
    shape_branch_title: '分支',
    shape_flow_title: '任务流',
    shape_start_title: '开始',
    shape_terminal_title: '结束',
    shape_robot_title: '机器人',
    shape_robot_text: '请输入节点名称'
  },
  en: {
    shape_start_text: 'start',
    shape_terminal_text: 'end',
    shape_task_text: 'new task',
    shape_condition_text: 'condition',
    shape_merge_text: 'merge',
    shape_branch_text: 'branch',
    shape_task_title: 'task',
    shape_condition_title: 'condition',
    shape_merge_title: 'merge',
    shape_branch_title: 'branch',
    shape_flow_title: 'flow',
    shape_start_title: 'start',
    shape_terminal_title: 'end',
    shape_robot_title: 'robot',
    shape_robot_text: 'Please enter name'
  }
}
var FlowHelper = {
  /**
   * 根据xml回显特定流程图
   * @param  {Object} response  接口返回格式
   * @param  {Object} vm        Vue组件实例
   * @param  {Object} container dom节点
   * @param  {Object} graph     mxGraph实例
   * @param  {Boolean} noNeed   控制加载自定义形状的标识
   * @return {Undefined|Object} mxGraph实例
   */
  display(response, vm, container, graph, noNeed, hasHover = true) {
    var oldCreateDefaultVertexStyle =
      mxStylesheet.prototype.createDefaultVertexStyle
    mxStylesheet.prototype.createDefaultVertexStyle = function() {
      var style = oldCreateDefaultVertexStyle.apply(this, arguments)
      style[mxConstants.STYLE_FONTCOLOR] = '#333333'
      return style
    }
    if (!noNeed) this.loadShapes()
    var xml = this.decodeJSON2XML(JSON.parse(response))
    var xmlDocument = new DOMParser().parseFromString(xml, 'text/xml')
    var node = xmlDocument.documentElement
    if (node && node.nodeName === 'mxGraphModel') {
      if (!graph) {
        graph = this.createGraph(container, vm)
      }
      new mxCodec(node.ownerDocument).decode(node, graph.getModel())
      if (hasHover) {
        this.hoverHandler(graph)
      }
      return graph
    }
  },
  /**
   * hover处理逻辑
   * @param {*} graph
   */
  hoverHandler(graph) {
    function updateStyle(state, hover) {
      if (!/task|condition|robot|flow/.test(state.cell.flow)) return
      if (hover) {
        state.style[mxConstants.STYLE_STROKECOLOR] = '#36f'
      }
      state.style[mxConstants.STYLE_ROUNDED] = hover ? '1' : '0'
    }
    graph.addMouseListener({
      currentState: null,
      previousStyle: null,
      mouseDown: function(sender, me) {
        if (this.currentState != null) {
          this.dragLeave(me.getEvent(), this.currentState)
          this.currentState = null
        }
      },
      mouseMove: function(sender, me) {
        if (this.currentState != null && me.getState() == this.currentState) {
          return
        }
        var tmp = graph.view.getState(me.getCell())
        // Ignores everything but vertices
        if (
          graph.isMouseDown ||
          (tmp != null && !graph.getModel().isVertex(tmp.cell))
        ) {
          tmp = null
        }

        if (tmp != this.currentState) {
          if (this.currentState != null) {
            this.dragLeave(me.getEvent(), this.currentState)
          }

          this.currentState = tmp

          if (this.currentState != null) {
            this.dragEnter(me.getEvent(), this.currentState)
          }
        }
      },
      mouseUp: function(sender, me) {},
      dragEnter: function(evt, state) {
        if (state != null) {
          this.previousStyle = state.style
          state.style = mxUtils.clone(state.style)
          updateStyle(state, true)
          state.shape.apply(state)
          state.shape.redraw()
        }
      },
      dragLeave: function(evt, state) {
        if (state != null) {
          state.style = this.previousStyle
          updateStyle(state, false)
          state.shape.apply(state)
          state.shape.redraw()
        }
      }
    })
  },
  /**
   * 创建mxGraph实例
   * @param  {object} container HTMLElement
   * @param  {object} vm        Vue Instance
   * @return {object} graph     mxGraph实例
   */
  createGraph(container, vm) {
    let graph = new mxGraph(container)
    graph.centerZoom = true
    graph.setHtmlLabels(true)
    graph.setEnabled(false)
    graph.panningHandler.ignoreCell = true
    graph.container.style.cursor = 'move'
    this.convertValue(graph)
    graph.isReplacePlaceholders = function(cell) {
      return (
        cell.value != null &&
        typeof cell.value == 'object' &&
        cell.value.getAttribute('placeholders') == '1'
      )
    }
    let isDblClick = false
    let t
    graph.dblClick = function(e, cell) {
      isDblClick = true
      if (cell) return vm && vm.$emit('dblclick', cell)
    }
    graph.addListener(mxEvent.CLICK, function(graph, evt) {
      if (t) {
        clearTimeout(t)
      }
      t = setTimeout(function() {
        if (isDblClick) {
          isDblClick = false
          return
        }
        const {
          properties: { event, cell }
        } = evt
        if (cell) {
          vm && vm.$emit('click', { event, cell })
          isDblClick = false
        }
      }, 200)
    })
    return graph
  },
  convertValue(graph) {
    graph.convertValueToString = function(cell) {
      if (cell.value != null && typeof cell.value == 'object') {
        if (
          this.isReplacePlaceholders(cell) &&
          cell.getAttribute('placeholder') != null
        ) {
          var name = cell.getAttribute('placeholder')
          var current = cell
          var result = null
          while (result == null && current != null) {
            if (current.value != null && typeof current.value == 'object') {
              result = current.hasAttribute(name)
                ? current.getAttribute(name) != null
                  ? current.getAttribute(name)
                  : ''
                : null
            }
            current = this.model.getParent(current)
          }
          return result || ''
        } else {
          return cell.value.getAttribute('label') || ''
        }
      }
      return mxGraph.prototype.convertValueToString.apply(this, arguments)
    }
  },
  /**
   * 初始化编辑器
   * @param  {Object} container              编辑器的dom节点
   * @param  {String} grapheditorTXT         编辑器菜单边栏的中文翻译
   * @param  {String} defaultThemeStylesheet 编辑器默认的样式配置
   * @param  {Function} cb                   组件回调函数
   * @return {Object}                        mxGraph实例
   */
  initEditor(container, grapheditorTXT, defaultThemeStylesheet, cb) {
    this.rewriteMXClient()
    mxResources.loadDefaultBundle = false
    mxResources.parse(grapheditorTXT)
    var themes = {}
    themes[Graph.prototype.defaultThemeName] = mxUtils.parseXml(
      defaultThemeStylesheet
    ).documentElement
    var editor = new Editor(false, themes)
    var editorUi = new EditorUi(editor, container)
    var graph = editorUi.editor.graph
    graph.$editorUi = editorUi
    var oldGraphdblClick = graph.dblClick
    editorUi.setPageVisible(false)
    graph.dblClick = (e, cell) => {
      if (cell && cell.flow && cell.flow != 'start' && cell.flow != 'end') {
        cb(cell)
      }
      mxGraph.prototype.dblClick.call(graph, e, cell)
    }
    // 当添加cell时触发
    graph.getCellOverlays = cell => {
      if (cell.flow === 'robot' && cell.value === '请输入节点名称') {
        const w = cell.geometry.width
        const s = `width:${w -
          24}px;margin-left:auto;margin-right:auto;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align: left;font-size: 14px;position: relative;top: -20px;color:#BFBFBF;`
        const v = `<div title="${cell.value}" style="${s}">${cell.value}</div>`
        cell.value = v
      }
    }
    // 关闭mxCell形状的编辑
    graph.setCellsEditable(false)
    this.initKeyEvents(editorUi)
    window.graphX = graph
    return graph
  },
  /**
   * 重写mxClient的一些对象原型方法
   */
  rewriteMXClient() {
    // 关闭footer高度
    EditorUi.prototype.footerHeight = 0
    // 开启垂直分界线
    EditorUi.prototype.hsplitClickEnabled = true
    // 注销window.onbeforeunload事件
    EditorUi.prototype.addBeforeUnloadListener = function() {}
    // 左侧形状元件的拖拽事件重写
    var oldAddClickHandler = Sidebar.prototype.addClickHandler
    Sidebar.prototype.addClickHandler = function(elt, ds, cells) {
      var sb = this
      var oldMouseUp = ds.mouseUp
      var first = null
      oldAddClickHandler.apply(this, arguments)
      ds.mouseUp = function(evt) {
        var styleObj = cells[0].style.split(';').reduce((o, kv) => {
          let [k, v] = kv.split('=')
          o[k] = v !== undefined ? v : true
          if (k == 'fillColor') {
            o[k] = '#fff'
          }
          if (k == 'strokeColor') {
            o[k] = '#999'
          }
          if (k == 'strokeWidth') {
            o[k] = '1'
          }
          return o
        }, {})
        var style = Object.keys(styleObj)
          .map(k => `${k}${styleObj[k] === true ? '' : '=' + styleObj[k]}`)
          .join(';')
        cells[0].setStyle(style)

        if (
          !mxEvent.isPopupTrigger(evt) &&
          this.currentGraph == null &&
          this.dragElement != null &&
          this.dragElement.style.display == 'none'
        ) {
          sb.itemClicked(cells, ds, evt, elt)
        }
        oldMouseUp.apply(ds, arguments)
        mxUtils.setOpacity(elt, 100)
        first = null
        // Blocks tooltips on this element after single click
        sb.currentElt = elt
      }
    }
    // 拖拽连线的时候，屏蔽连线一端没有连接到其他形状的场景
    var oldInsertEdge = mxConnectionHandler.prototype.insertEdge
    mxConnectionHandler.prototype.insertEdge = function(
      parent,
      id,
      value,
      source,
      target,
      style
    ) {
      if (!target || source.id == target.id) {
        return null
      } else {
        return oldInsertEdge.apply(this, arguments)
      }
    }
    // 形状hover时点击箭头，屏蔽连线一端没有连接到其他形状的场景
    var oldInsertEdgeFromGraph = mxGraph.prototype.insertEdge
    mxGraph.prototype.insertEdge = function(
      parent,
      id,
      value,
      source,
      target,
      style
    ) {
      if (!target) {
        return null
      } else {
        return oldInsertEdgeFromGraph.apply(this, arguments)
      }
    }
    // 禁止拖动线段
    var oldMoveCells = mxGraphHandler.prototype.moveCells
    // 关闭旋转
    mxVertexHandler.prototype.rotationEnabled = false
    mxGraphHandler.prototype.moveCells = function(
      cells,
      dx,
      dy,
      clone,
      target,
      evt
    ) {
      if (!cells.every(c => !!c.edge)) {
        oldMoveCells.apply(this, arguments)
      }
    }
    // 删除形状时，连带删除关联的线段
    var oldGetDeletableCells = mxGraph.prototype.getDeletableCells
    mxGraph.prototype.getDeletableCells = function(cells) {
      let temp = []
      cells.forEach(c => {
        temp.push(c)
        if (c.edges && c.edges.length > 0) {
          temp = temp.concat(c.edges)
        }
      })
      return oldGetDeletableCells.apply(this, [temp])
    }
    // 屏蔽右键菜单
    mxPopupMenu.prototype.enabled = false
    // 不允许连线单独存在或一端断开
    mxGraph.prototype.allowDanglingEdges = false

    // 限制节点大小
    const resizeCells = mxGraph.prototype.resizeCells
    mxGraph.prototype.resizeCells = function(cells, bounds) {
      const { height, width } = bounds[0]
      const minSize = {
        start: {
          height: 40,
          width: 40
        },
        terminal: {
          height: 40,
          width: 40
        },
        task: {
          height: 80,
          width: 120
        },
        flow: {
          height: 90,
          width: 130
        },
        condition: {
          height: 68,
          width: 114
        },
        merge: {
          width: 80,
          height: 80
        },
        branch: {
          width: 80,
          height: 80
        },
        robot: {
          width: 180,
          height: 80
        }
      }
      const minTargetSize = minSize[cells[0].flow]
      bounds[0].height = Math.max(minTargetSize.height + Math.random(), height)
      bounds[0].width = Math.max(minTargetSize.width + Math.random(), width)
      return resizeCells.apply(this, arguments)
    }
  },
  /**
   * [初始化编辑器事件控制]
   * @param  {[Object]} editorui [EditorUi实例]
   * @return {[Undefined]}       [无返回值]
   */
  initKeyEvents(editorui) {
    // 关闭键盘事件，只留键盘删除事件
    editorui.keyHandler.enabled = false
    let oldKeydownHandler = editorui.keyHandler.keydownHandler
    editorui.keyHandler.keydownHandler = function(evt) {
      let ctrlKeyPlus =
        (evt.keyCode == 90 /*ctrl+z*/ ||
        evt.keyCode == 67 /*ctrl+c*/ ||
        evt.keyCode == 86 /*ctrl+v*/ ||
        evt.keyCode == 65 /*全选*/ ||
          evt.keyCode == 89) /*前进*/ &&
        evt.ctrlKey
      let deleteKeys =
        evt.keyCode == 8 /*backspace*/ || evt.keyCode == 46 /*delete*/
      if (ctrlKeyPlus || deleteKeys) {
        // 开启keydown事件
        editorui.keyHandler.enabled = true
        oldKeydownHandler.apply(editorui.keyHandler, [evt])
        // 关闭keydown事件
        editorui.keyHandler.enabled = false
      }
    }
    mxEvent.removeListener(
      editorui.keyHandler.target,
      'keydown',
      oldKeydownHandler
    )
    mxEvent.addListener(
      editorui.keyHandler.target,
      'keydown',
      editorui.keyHandler.keydownHandler
    )
    let oldPaste = mxClipboard.paste
    mxClipboard.paste = function() {
      this.cells.forEach(cell => {
        cell.value = ''
      })
      let args = [...arguments]
      return oldPaste.apply(this, args)
    }
    this.addHoverShapesMenu(editorui)
  },
  /**
   * 添加形状hover时四个箭头的事件
   * @param {Object} ui EditorUi实例
   */
  addHoverShapesMenu(ui) {
    var doms = [
      [ui.hoverIcons.arrowRight, 'east'],
      [ui.hoverIcons.arrowLeft, 'west'],
      [ui.hoverIcons.arrowUp, 'north'],
      [ui.hoverIcons.arrowDown, 'south']
    ]
    var enter = function(direction) {
      return function(evt) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = null
        if (this.iconset) return
        this.iconset = new mxIconSet(ui, direction, this)
      }
    }
    var leave = function(evt) {
      this.timer = setTimeout(
        mxUtils.bind(this, function() {
          this.iconset.destroy()
          this.iconset = null
        }),
        100
      )
    }
    doms.forEach(function(args) {
      mxEvent.addListener(args[0], 'mouseenter', enter(args[1]))
      mxEvent.addListener(args[0], 'mouseleave', leave)
    })
  },
  /**
   * 加载自定义shapes的xml文件
   */
  loadShapes(start, end) {
    var root = mxUtils.parseXml(this.portalShapes(start, end)).documentElement
    var packageName = ''
    var name = root.getAttribute('name')
    if (name != null) {
      packageName = name + '.'
    }
    var shape = root.firstChild
    while (shape) {
      if (shape.nodeType === mxConstants.NODETYPE_ELEMENT) {
        mxStencilRegistry.addStencil(
          packageName +
            shape
              .getAttribute('name')
              .replace(/ /g, '_')
              .toLowerCase(),
          new mxStencil(shape)
        )
      }
      shape = shape.nextSibling
    }
  },
  /**
   * 获取流程图的xml格式
   * @param  {Object} graph mxGraph实例
   * @return {String} xml   xml格式字符串
   */
  graph2xml(graph) {
    return this.getXml(new mxCodec().encode(graph.getModel()))
  },
  /**
   * 更新视图中形状的显示文案
   * @param  {Object} graph  mxGraph实例
   * @param  {Object} cell   mxCell实例
   * @param  {Object} attrs  自定义属性对象
   * @param  {Boolean} flag  控制超长文案显示标识
   */
  updateCellAttrs(graph, cell, attrs, flag) {
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k]
        if (k === 'label') {
          var w = cell.geometry.width
          var h = cell.geometry.height
          var s = ''
          if (!flag) {
            s = `width:${w -
              24}px;margin-left:auto;margin-right:auto;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`
            if (cell.flow === 'robot') {
              let color
              if (v === '请输入节点名称') {
                color = '#BFBFBF'
              } else {
                color = '#333'
              }
              const botStyle = `text-align: left;font-size: 14px;position: relative;top: -20px;color:${color};`
              s += botStyle
            }
            v = `<div title="${v}" style="${s}">${v}</div>`
          }
          this.setCellValue(graph, cell, v)
        } else if (k == 'conditionExpression') {
          if (typeof cell.value == 'string') {
            cell[k] = v
          } else {
            cell.setAttribute(k, v)
          }
        } else if (k === 'assigneeName') {
          // 如果有执行人,则设置执行人，如果没有执行人，则设置推荐岗位， 如果没有推荐岗位则为空
          const warrper = `<div>${cell.value}</div>`
          if (attrs[k]) {
            const assignee = `<div style="margin-top:8px;color: rgba(0,0,0,0.65);">${attrs[k]}</div>`
            this.setCellValue(graph, cell, warrper + assignee)
          } else if (attrs['executorPost']) {
            const executorPost = `<div style="margin-top:8px;color: rgba(0,0,0,0.65);">推荐岗位：${
              attrs['executorPost']
            }</div>`
            this.setCellValue(graph, cell, warrper + executorPost)
          }
        }
      }
    }
  },
  /**
   * 设置graph视图中形状的文案
   * @param {Object} graph mxGraph实例
   * @param {Object} cell  mxCell实例
   * @param {String} value 文案字符串
   */
  setCellValue(graph, cell, value) {
    graph.cellEditor.applyValue(graph.view.getState(cell), value)
  },
  /**
   * 获取xml格式
   * @param  {Object} node xml文档中节点
   * @return {String}      xml
   */
  getXml(node) {
    var result = []
    if (node != null) {
      if (node.nodeType == mxConstants.NODETYPE_TEXT) {
        var value = mxUtils.trim(mxUtils.getTextContent(node))
        if (value.length > 0) {
          result.push(mxUtils.htmlEntities(value) + '')
        }
      } else {
        result.push('<' + node.nodeName)
        var attrs = node.attributes
        if (attrs != null) {
          for (var i = 0; i < attrs.length; i++) {
            var val = mxUtils.htmlEntities(attrs[i].value)
            result.push(' ' + attrs[i].nodeName + '="' + val + '"')
          }
        }
        var tmp = node.firstChild
        if (tmp != null) {
          result.push('>')
          while (tmp != null) {
            result.push(this.getXml(tmp))
            tmp = tmp.nextSibling
          }
          result.push('</' + node.nodeName + '>')
        } else {
          result.push('/>')
        }
      }
    }
    return result.join('')
  },
  /**
   * 获取视图中所有形状（线段和形状）
   * @param  {Object} graph mxGraph实例
   * @return {Array}        [mxCell实例, ....]
   */
  getCells(graph) {
    return Object.values(graph.getModel().cells)
  },
  /**
   * 获取开始节点
   * @param  {Object} graph mxGraph实例
   * @return {Object}       mxCell实例
   */
  getStartCells(graph) {
    return this.getCells(graph).filter(c => c.flow === 'start')
  },
  /**
   * 获取视图中所有结束节点
   * @param  {Object} graph mxGraph实例
   * @return {Array}        [mxCell实例, ....]
   */
  getEndCells(graph) {
    return this.getCells(graph).filter(c => c.flow === 'terminal')
  },
  /**
   * 获取视图中所有任务和决策节点
   * @param  {Object} graph mxGraph实例
   * @return {Array}        [mxCell实例, ....]
   */
  getTaskCells(graph) {
    return this.getCells(graph).filter(
      c =>
        c.flow === 'task' ||
        c.flow === 'condition' ||
        c.flow === 'flow' ||
        c.flow === 'robot'
    )
  },
  // 获取所有子流程
  getSubFlow(graph) {
    return this.getCells(graph).filter(c => c.flow === 'flow')
  },
  /**
   * 获取视图中所有决策节点
   * @param  {Object} graph mxGraph实例
   * @return {Array}        [mxCell实例, ....]
   */
  getConditions(graph) {
    return this.getCells(graph).filter(c => c.flow == 'condition')
  },
  /**
   * 将xml解析成接口接受的入参格式
   * @param  {Object} graph mxGraph实例
   * @return {Object}       接口接受的入参格式
   * {
   *   cells: [
   *     {nodeName, nodeType, style, children, ...}
   *   ],
   *   tasks: [
   *     {nodeName, nodeType, style, children, attrs: {}, ...}
   *   ]
   * }
   */
  encodeXML2JSON(graph) {
    var xml = this.graph2xml(graph)
    var root = this.encodeNode2Cell(xml)
    var params = {
      cells: [],
      tasks: []
    }
    root[0].children[0].children.forEach(c => {
      if (c.flow && /task|condition|robot|flow/.test(c.flow)) {
        params.tasks.push(c)
      } else {
        params.cells.push(c)
      }
    })
    return params
  },
  /**
   * 根据已知的xml文档构造虚拟节点树
   * @param  {Object} node 单个节点
   * @param  {Array} nodes 一组节点
   * @param  {Array} root  根节点
   * @return {Array}       根节点
   */
  encodeNode2Cell(node, nodes, root) {
    if (typeof node === 'string') {
      node = mxUtils.parseXml(node).documentElement
    }
    nodes = nodes || []
    root = root || nodes
    var children = [...node.childNodes]
    var o = this.makeNode(node)
    nodes.push(o)
    if (children.length) {
      nodes = o.children
      children.forEach(c => this.encodeNode2Cell(c, nodes, root))
    } else {
      delete o.children
    }
    return root
  },
  /**
   * 构造一个节点
   * @param  {Object} node xml文档的节点对象
   * @return {Object}      虚拟节点对象
   */
  makeNode(node) {
    return {
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      ...this.getAttrs(node),
      children: []
    }
  },
  /**
   * 获取节点的原生属性
   * @param  {Object} node 原生的xml文档中的单个节点
   * @return {Object}      节点属性副本
   */
  getAttrs(node) {
    return [...node.attributes].reduce((a, k) => {
      if (k.nodeName.toLowerCase() === 'style') {
        a[k.nodeName] = k.nodeValue
          .split(';')
          .filter(v => !!v)
          .reduce((o, v) => {
            var [x, y] = v.split('=')
            o[x] = y !== undefined ? y : true
            return o
          }, {})
      } else {
        a[k.nodeName] = k.nodeValue
      }
      return a
    }, {})
  },
  /**
   * 根据接口格式反解析成mxclient理解的xml格式
   * @param  {Object} response 接口格式
   * @return {String}          xml文档字符标签对
   */
  decodeJSON2XML(response) {
    var s1 = response.cells.reduce((s, c) => {
      s += this.decodeCell2Node(c, response)
      return s
    }, '')
    var s2 = response.tasks.reduce((s, t) => {
      s += this.decodeCell2Node(t, response)
      return s
    }, '')
    return `<mxGraphModel><root>${s1 + s2}</root></mxGraphModel>`
  },
  /**
   * 根据接口格式反解析生成xml文档的单个标签对
   * @param  {Object} cell     接口格式中单个cell对象
   * @param  {Object} response 接口返回格式
   * @return {String}          xml文档单个标签对
   */
  decodeCell2Node(cell, response) {
    var s = ''
    s += '<' + cell.nodeName + this.decodeCell2NodeAttrs(cell, response) + '>'
    s +=
      cell.children instanceof Array
        ? cell.children.map(x => this.decodeCell2Node(x, response)).join('')
        : cell.children
        ? this.decodeCell2Node(cell.children, response)
        : ''
    s += '</' + cell.nodeName + '>'
    return s
  },
  /**
   * 根据接口格式反解析生成xml文档的单个标签对的属性
   * @param  {Object} cell     接口格式中单个cell对象
   * @param  {Object} response 接口返回格式
   * @return {String}          属性字符集 "k1='v1' k2='v2'"
   */
  decodeCell2NodeAttrs(cell, response) {
    return Object.keys(cell).reduce((s, a) => {
      if (!/^\bnode(Type|Name)\b|\battrs\b|\bchildren\b$/.test(a)) {
        if (cell[a] === null) return s
        if (a == 'style') {
          s +=
            ' style="' +
            Object.keys(cell[a])
              .reduce((x, v) => {
                if (cell[a][v] !== null) {
                  var it = v + '=' + cell[a][v]
                  x.push(it)
                }
                return x
              }, [])
              .join(';') +
            '"'
        } else {
          s += ' ' + a + '="' + cell[a] + '"'
        }
      }
      return s
    }, '')
  },
  /**
   * 创建新mxCell实例
   * @param  {String} flow  portal自定义属性标识
   * @param  {String} value cell的显示文案
   * @param  {number} x     cell在视图上横坐标
   * @param  {number} y     cell在视图上纵坐标
   * @param  {number} w     cell在视图上宽度
   * @param  {number} h     cell在视图上高度
   * @return {Object}       mxCell实例
   */
  createPortalCell(flow, value, x, y, w, h) {
    var style = `shape=mxgraph.portal.${flow};whiteSpace=wrap;html=1;fillColor=#fff;strokeColor=#999;strokeWidth=1`
    var cell = new mxCell(value, new mxGeometry(x, y, w, h), style)
    cell.flow = flow
    cell.vertex = true
    return cell
  },
  /**
   * 根据已知cell和其方向的一侧创建对应的新cell实例属性
   * @param  {Object} cell      已存在的mxCell实例
   * @param  {String} flow      portal自定义属性标识
   * @param  {String} direction 已存在cell实例的一个方向描述字段
   * @return {Object}           即将创建的cell的必须属性，显示文案、坐标和宽高
   */
  createPortalCellAttrsFromCell(cell, flow = 'task', direction = 'east') {
    var geo = cell.geometry
    var w0 = geo.width
    var h0 = geo.height
    var x0 = geo.x
    var y0 = geo.y
    var w = 0
    var h = 0

    var value = language[lan].shape_task_text
    if (flow == 'start' || flow == 'terminal') {
      w = h = 40
      value = ''
    }
    if (flow == 'merge' || flow == 'branch') {
      w = h = 80
      value =
        flow == 'merge'
          ? language[lan].shape_merge_text
          : language[lan].shape_branch_text
    }
    if (flow == 'condition') {
      w = 114
      h = 68
      value = language[lan].shape_condition_text
    }
    if (flow === 'robot') {
      value = language[lan].shape_robot_text
      w = 180
      h = 80
    }
    if (flow == 'task') {
      w = 120
      h = 80
    }
    if (flow == 'flow') {
      w = 130
      h = 90
      value = language[lan].shape_flow_text
    }
    var x = x0 + w0 + 80
    var y = y0 + h0 / 2 - h / 2
    if (direction == 'north') {
      x = x0 + w0 / 2 - w / 2
      y = y0 - 80 - h
    }
    if (direction == 'south') {
      x = x0 + w0 / 2 - w / 2
      y = y0 + h0 + 80
    }
    if (direction == 'west') {
      x = x0 - 80 - w
      y = y0 + h0 / 2 - h / 2
    }
    return { value, x, y, w, h }
  },
  portalShapes: shapes,
  /**
   * 流程字符串预处理，控制不同状态显示不同颜色
   * @param  {String} xml        流程详情接口返回的data.flowJson字段
   * @param  {Object} flowDetail 流程详情接口返回的data字段
   * @return {String}            处理过的流程详情接口返回的data.flowJson字段
   */
  preParseXML(xml, activeCellId) {
    // conditionExpression
    let xmlObj = JSON.parse(xml)
    let start = xmlObj.cells.find(t => t.flow == 'start')
    let ends = xmlObj.cells.filter(t => t.flow == 'terminal')
    let conditions = xmlObj.tasks.filter(t => /condition/.test(t.flow))
    // 任务类型
    let tasks = xmlObj.tasks.filter(t => /task/.test(t.flow))
    let robot = xmlObj.tasks.filter(t => /robot/.test(t.flow))
    let subFlow = xmlObj.tasks.filter(t => /flow/.test(t.flow))

    let merges = xmlObj.cells.filter(t => /merge/.test(t.flow))
    let branchs = xmlObj.cells.filter(t => /branch/.test(t.flow))
    let boards = xmlObj.cells.filter(t => /board/.test(t.flow))
    let edges2cells = {}
    let cells = [
      start,
      ...ends,
      ...conditions,
      ...tasks,
      ...merges,
      ...branchs,
      ...boards,
      ...subFlow,
      ...robot
    ]
    let edges = xmlObj.cells.filter(t => !!t.edge)
    edges.forEach(e => {
      let s = cells.find(c => c.id == e.source)
      let t = cells.find(c => c.id == e.target)
      e.style.strokeColor = '#ccc'
      s.style.fillColor = '#F0F0F0'
      s.style.strokeColor = 'transparent'
      t.style.fillColor = '#F0F0F0'
      t.style.strokeColor = 'transparent'
      if (s.flow == 'start') {
        e.style.strokeColor = 'rgb(48, 102, 255)'
      }
      if (s.flow == 'task') {
        edges2cells[s.id] = e
      }
      if (
        s.flow == 'board' ||
        s.flow == 'branch' ||
        s.flow == 'condition' ||
        s.flow == 'merge'
      ) {
        edges2cells[s.id] = edges2cells[s.id] || []
        edges2cells[s.id].push(e)
      }
    })
    start.style.fillColor = '#F4F7FF'
    start.style.strokeColor = 'transparent'
    xmlObj.tasks.forEach(t => {
      t.style.strokeColor = 'transparent'
      t.style.fillColor = '#F0F0F0'
      t.style.strokeWidth = 1
      let e = edges2cells[t.id] || { style: {} }
      if (t.attrs) {
        let status = parseInt(t.attrs.status, 10)
        if (isNaN(status)) {
          t.style.fillColor = '#F0F0F0'
          if (t.flow == 'condition') {
            e.forEach(x => {
              x.style.strokeColor = '#ccc'
            })
          } else {
            e.style.strokeColor = '#ccc'
          }
        } else if (status === 1 || status === 0) {
          t.style.fillColor = '#3366FF'
          if (t.flow == 'condition') {
            e.forEach(x => {
              x.style.strokeColor = '#ccc'
            })
          } else {
            e.style.strokeColor = '#ccc'
          }
        } else if (status === 2) {
          t.style.fillColor = '#F0F6FF'
          if (t.flow == 'condition') {
            e.forEach(x => {
              if (
                /\d/.test(t.attrs.agree + '') &&
                x.conditionExpression == t.attrs.agree
              ) {
                x.style.strokeColor = 'rgb(48, 102, 255)'
              } else {
                x.style.strokeColor = '#ccc'
              }
            })
          } else {
            e.style.strokeColor = 'rgb(48, 102, 255)'
          }
        } else {
          t.style.fillColor = '#F0F0F0'
          if (t.flow == 'condition') {
            e.forEach(x => {
              x.style.strokeColor = '#ccc'
            })
          } else {
            e.style.strokeColor = '#ccc'
          }
        }
        if (this.$route.params.taskDefinitionKey == t.id) {
          if (status >= 0 && status <= 2 && status != null) {
            t.style.strokeColor = '#3366ff'
          } else {
            t.style.strokeColor = '#999'
          }
        }

        // 当前节点样式修改
        if (parseInt(activeCellId, 10) === parseInt(t.id, 10)) {
          if (status == 0) {
            t.style.strokeColor = '#3366ff'
          } else {
            t.style.strokeColor = '#999999'
          }
        }

        // 子流程样式修改
        if (t.flow === 'flow') {
          if (isNaN(status)) {
            t.style.shape = 'mxgraph.portal.flowa'
          } else if (status <= 1) {
            t.style.shape = 'mxgraph.portal.flowb'
          } else if (status === 2) {
            t.style.shape = 'mxgraph.portal.flowc'
          }
        }
      }
    })
    edges.forEach(e => {
      let t = cells.find(c => c.id == e.target)
      if (
        e.style.strokeColor != '#ccc' &&
        /merge|terminal|board|branch/.test(t.flow)
      ) {
        t.style.fillColor = '#F4F7FF'
        if (/board|merge|branch/.test(t.flow)) {
          edges2cells[t.id].forEach(x => {
            x.style.strokeColor = 'rgb(48, 102, 255)'
          })
        }
      }
    })
    return JSON.stringify(xmlObj)
  }
}
export default FlowHelper
/**
 * 快捷图形菜单构造函数
 * @param  {Object} ui        EditorUi实例
 * @param  {String} direction 方向字符串：west|east|north|south
 * @param  {Object} arrow     方向箭头dom节点对象
 * @return {Object}           mxIconSet实例
 */
function mxIconSet(ui, direction, arrow) {
  var graph = ui.editor.graph
  //var state = ui.hoverIcons.currentState
  this.menu = document.createElement('div')
  this.menu.innerHTML = `<div flow="start" title="${language[lan].shape_start_title}"></div>
                  <div flow="terminal" title="${language[lan].shape_terminal_title}"></div>
                  <div flow="task" title="${language[lan].shape_task_title}"></div>
                  <div flow="condition" title="${language[lan].shape_condition_title}"></div>
                  <div flow="merge" title="${language[lan].shape_merge_title}"></div>
                  <div flow="branch" title="${language[lan].shape_branch_title}"></div>
                  <div flow="flow" title="${language[lan].shape_flow_title}"></div>
                  <div flow="robot" title="${language[lan].shape_robot_title}"></div>`
  this.menu.className = 'quick-menu quick-menu-' + direction
  if (direction == 'east' || direction == 'west') {
    if (direction == 'east') {
      this.menu.style.left = arrow.offsetLeft + arrow.width + 'px'
    } else {
      this.menu.style.left = arrow.offsetLeft - 23 + 'px'
    }
    this.menu.style.top = arrow.offsetTop + arrow.height / 2 - 75 + 'px'
  }
  if (direction == 'north' || direction == 'south') {
    this.menu.style.left = arrow.offsetLeft + arrow.width / 2 - 97 + 'px'
    if (direction == 'north') {
      this.menu.style.top = arrow.offsetTop - arrow.height + 'px'
    } else {
      this.menu.style.top = arrow.offsetTop + arrow.height + 'px'
    }
  }
  /*菜单点击事件，用于选择某一个形状*/
  mxEvent.addListener(
    this.menu,
    'click',
    mxUtils.bind(this, function(evt) {
      mxEvent.consume(evt)
      clearTimeout(arrow.timer)
      arrow.timer = null
      arrow.iconset = null
      var flow = evt.target.getAttribute('flow')
      if (flow) {
        var state = ui.hoverIcons.currentState
        var { value, x, y, w, h } = FlowHelper.createPortalCellAttrsFromCell(
          state.cell,
          flow,
          direction
        )
        var cell = FlowHelper.createPortalCell(flow, value, x, y, w, h)
        ui.editor.graph.addCell(cell, state.cell.parent)
        ui.hoverIcons.click(state, direction, new mxMouseEvent(evt))
      }
      this.destroy()
    })
  )
  /*菜单hover事件，用于保持菜单显示*/
  mxEvent.addListener(
    this.menu,
    'mouseenter',
    mxUtils.bind(this, function(evt) {
      if (arrow.timer) {
        clearTimeout(arrow.timer)
        arrow.timer = null
      }
    })
  )
  /*菜单hover事件，用于离开删除菜单*/
  mxEvent.addListener(
    this.menu,
    'mouseleave',
    mxUtils.bind(this, function(evt) {
      if (arrow.timer) {
        clearTimeout(arrow.timer)
      }
      arrow.timer = setTimeout(
        mxUtils.bind(arrow, function() {
          this.iconset.destroy()
          this.iconset = null
        }),
        100
      )
    })
  )
  graph.container.appendChild(this.menu)
}
/**
 * 快捷菜单销毁
 */
mxIconSet.prototype.destroy = function() {
  if (this.menu != null) {
    mxEvent.removeAllListeners(this.menu)
    this.menu.parentNode.removeChild(this.menu)
  }
  this.menu = null
}
