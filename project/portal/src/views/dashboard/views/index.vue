<template>
  <div
    class="dashboard"
    @mousemove="mouMove"
    @mouseup.stop="mouUp"
    @scroll="mouMove"
  >
    <taskNotice ref="dropTop" type="global">滚动条</taskNotice>
    <div class="dashboard-header">
      <div>{{ userName }}，欢迎使用ROSS</div>
      <el-dropdown @command="handleAddComp">
        <el-button class="add_button">
          配置模块<i class="el-icon-arrow-down"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0"
            ><span class="command_text">配置系统模块</span></el-dropdown-item
          >
          <el-dropdown-item command="1"
            ><span class="command_text">新增自定义链接</span></el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="drop_body">
      <drogRow v-for="(ite, i) in drogRows" :key="'row' + i">
        <drag
          v-for="(item, index) in ite"
          :key="'drog' + index"
          :comWidth="item.width"
          :moveVal="moveVal"
          :isDroging="isDroging"
          :isZooming="isZooming"
          :type="item.type"
          :dragPos="dragPos"
          :item="item"
          :row="ite"
          :component="item.component"
          :params="item.iframe ? item.iframe : null"
          :overHolderItem="overItem.item"
          :anotherScaleItem="anotherScaleItem"
          @zoomDown="zoomDown"
          @mouDown="mouDown"
          @mouUp="mouUp"
          @setOverItem="setOverItem"
          @deleteComp="deleteComp"
          @zoomAnotherItem="zoomAnotherItem"
          @updateZoomRow="updateZoomRow"
          @updateIframe="updateIframe"
        />
      </drogRow>
    </div>
    <dialogAdd
      v-model="dialogVisible"
      :addType="addType"
      :cloneDrogRows="cloneDrogRows"
      :iframeToBeUpdate="iframeToBeUpdate"
      @updateComps="updateComps"
    />
  </div>
</template>
<script>
export default {
  name: 'dashboard',
  components: {
    taskNotice: _ => import('~/components/task-notice'), // 最新待办
    drogRow: _ => import('../components/drag-row'),
    drag: _ => import('../components/drag'),
    dialogAdd: _ => import('../components/dialog-add')
  },
  data() {
    let o = this.$cache.get('USER_INFO') || {}
    return {
      userName: o.realName || o.userName || '',
      dialogVisible: false,
      addType: '0',
      cloneDrogRows: null,
      drogRows: [],
      isDroging: false,
      disPos: {
        // 鼠标点下去时的坐标记录
        x: null,
        y: null
      },
      scollPos: {
        // 顶层元素的坐标
        x: null,
        y: null
      },
      moveVal: {
        // 拖拽时的移动值
        x: 0,
        y: 0
      },
      posOffset: {
        // 偏移常量
        x: 0,
        y: 0
      },
      mousePos: {
        // 鼠标相对屏幕事实位置
        x: -1,
        y: -1
      },
      saveMouseChange: {
        // 鼠标拖动时记录改变值
        x: 0,
        y: 0
      },
      saveScollChange: {
        // 滚动条滚动时记录改变值
        x: 0,
        y: 0
      },
      activeItem: {
        // 当前被拖拽的元素
        row: null,
        item: null
      },
      overItem: {
        // 当前鼠标over的元素
        row: null,
        item: null
      },
      isZooming: false,
      anotherScaleItem: {
        item: null,
        type: null
      },
      iframeToBeUpdate: null
    }
  },
  created() {},
  mounted() {
    this.bindMove(false)
    this.setOffset()
    this.dashboardQuery()
  },
  destroyed() {
    this.bindMove(false)
  },
  computed: {
    // 计算当前鼠标相对于.dashboard的相对位置
    dragPos() {
      let pos = {
        x: -1,
        y: -1
      }
      if (this.isDroging) {
        const ofX = this.posOffset.x
        const ofY = this.posOffset.y
        const x = this.mousePos.x
        const y = this.mousePos.y
        pos = {
          x: x - ofX,
          y: y - ofY
        }
      }
      return pos
    }
    /* overHolderItem() {
      return this.overItem.item
    } */
  },
  methods: {
    // 查询上次拖拽结果
    async dashboardQuery() {
      try {
        const res = await this.$api.globalDashboard.dashboardQuery(null, {
          needToast: false
        })
        let data = null
        if (res.data) {
          this.drogRows = JSON.parse(res.data)
        } else {
          throw Error('没有返回数据')
        }
      } catch (error) {
        this.drogRows = [
          [
            {
              width: 100,
              type: 0
            }
          ],
          [
            {
              width: 0,
              type: 0
            },
            {
              width: 12,
              height: 365,
              type: 1,
              component: 'dashboardTabs'
            },
            {
              width: 0,
              type: 0
            }
          ],
          [
            {
              width: 100,
              type: 0
            }
          ],
          [
            {
              width: 0,
              type: 0
            },
            {
              width: 6,
              height: 215,
              type: 1,
              component: 'overviewTask'
            },
            {
              width: 0,
              type: 0
            },
            {
              width: 6,
              height: 215,
              type: 1,
              component: 'overviewProcess'
            },
            {
              width: 0,
              type: 0
            }
          ],
          [
            {
              width: 100,
              type: 0
            }
          ],
          [
            {
              width: 0,
              type: 0
            },
            {
              width: 4,
              height: 235,
              type: 1,
              component: 'knowledgeGlobal'
            },
            {
              width: 0,
              type: 0
            },
            {
              width: 4,
              height: 235,
              type: 1,
              component: 'listModuleOperation'
            },
            {
              width: 0,
              type: 0
            },
            {
              width: 4,
              height: 235,
              type: 1,
              component: 'listModuleProduct'
            },
            {
              width: 0,
              type: 0
            }
          ],
          [
            {
              width: 100,
              type: 0
            }
          ],
          [
            {
              width: 0,
              type: 0
            },
            {
              width: 12,
              height: 190,
              type: 1,
              component: 'commonStore'
            },
            {
              width: 0,
              type: 0
            }
          ],
          [
            {
              width: 100,
              type: 0
            }
          ]
        ]
      } finally {
        this.setOffset()
      }
    },
    // 保存拖拽结果
    async dashboardSave() {
      try {
        const res = await this.$api.globalDashboard.dashboardSave(
          {
            data: JSON.stringify(this.drogRows)
          },
          {
            needToast: false
          }
        )
        let data = null
      } catch (error) {
        console.log(error)
      }
    },
    // 添加组件
    updateComps(cloneDrogRows) {
      this.drogRows = cloneDrogRows
      this.$nextTick(function() {
        this.dashboardSave()
      })
    },
    // 编辑iframe
    updateIframe(obj) {
      this.addType = '2'
      this.cloneDrogRows = this.drogRows.slice()
      this.$nextTick(function() {
        this.dialogVisible = true
        this.iframeToBeUpdate = obj
      })
    },
    // 获取待删除组件所在row
    deleteComp(obj) {
      const com = obj.item
      const row = obj.row
      const rowIndex = this.drogRows.indexOf(row)
      const itemIndex = row.indexOf(com)
      let cloneRow = row.slice()
      switch (cloneRow.length) {
        case 3:
          cloneRow = null
          break
        case 5:
          const otherCom = cloneRow.find(
            item => item !== com && item.type === 1
          )
          cloneRow = [
            {
              width: 0,
              type: 0
            },
            {
              ...otherCom,
              width: 12
            },
            {
              width: 0,
              type: 0
            }
          ]
          break
        case 7:
          const otherComs = cloneRow.filter(
            item => item !== com && item.type === 1
          )
          cloneRow = [
            {
              width: 0,
              type: 0
            },
            {
              ...otherComs[0],
              width: 6
            },
            {
              width: 0,
              type: 0
            },
            {
              ...otherComs[1],
              width: 6
            },
            {
              width: 0,
              type: 0
            }
          ]
          break
        default:
          break
      }
      if (cloneRow) {
        this.$set(this.drogRows, rowIndex, cloneRow)
      } else {
        this.drogRows.splice(rowIndex - 1, 2)
      }
      this.$nextTick(function() {
        this.dashboardSave()
      })
    },
    doComputed(cloneOverRow, cloneActiveRow, type) {
      // 拖动组件row的原下标
      const activeRowIndex = this.drogRows.indexOf(this.activeItem.row)
      // 将被放置进入的item原下标
      const overRowIndex = this.drogRows.indexOf(this.overItem.row)

      const cloneDrogRows = this.drogRows.slice()
      if (cloneOverRow) {
        cloneDrogRows[overRowIndex] = cloneOverRow
      } else {
        return
      }
      // 如果是同row内组件互换位置，在上面更新overRow，之后就不需要重复更新activeRow
      if (type !== 7) {
        if (cloneActiveRow) {
          cloneDrogRows[activeRowIndex] = cloneActiveRow
        } else {
          const index = activeRowIndex // 被拖拽元素row的下标
          if (index >= 0) {
            cloneDrogRows.splice(index, 1) // wd_12删除老的被拖拽row
          }
        }
      }

      if ([2, 3, 4, 5, 6].indexOf(type) > -1) {
        const newActiveRowIndex =
          cloneDrogRows.indexOf(cloneActiveRow) > -1
            ? cloneDrogRows.indexOf(cloneActiveRow)
            : activeRowIndex - 1
        const newOverRowIndex = cloneDrogRows.indexOf(cloneOverRow)
        /* type:
          1.不同两row中的组件相互正常放置
          2.[4, 6, 8]组件放置到整行 
          3.整行的组件放置到另一个整行&从上放到下 
          4.整行的组件放置到另一个整行&从下放到上
          5.整行拖拽到[4, 6, 8]&从上放到下
          6.整行拖拽到[4, 6, 8]&从下放到上
          7.同row内的组件互换位置
        */
        if ([2, 3, 4].indexOf(type) > -1) {
          cloneDrogRows.splice(
            newOverRowIndex,
            1,
            [
              {
                width: 100,
                type: 0
              }
            ],
            cloneOverRow,
            [
              {
                width: 100,
                type: 0
              }
            ]
          )
          if (type === 3) {
            cloneDrogRows.splice(newActiveRowIndex, 1)
          } else if (type === 4) {
            cloneDrogRows.splice(newActiveRowIndex + 2, 1)
          }
        } else if (type === 5 || type === 6) {
          cloneDrogRows.splice(newActiveRowIndex + 1, 1)
        }
      }
      this.drogRows = cloneDrogRows
      this.$nextTick(function() {
        this.dashboardSave()
      })
    },
    // 获取放置组件所在row的新数据
    getNewOverRow() {
      const overRow = this.overItem.row
      const overItem = this.overItem.item
      const activeRow = this.activeItem.row
      const activeItem = this.activeItem.item
      /* type:
        1.不同两row中的组件相互正常放置
        2.[4, 6, 8]组件放置到整行 
        3.整行的组件放置到另一个整行&从上放到下 
        4.整行的组件放置到另一个整行&从下放到上
        5.整行拖拽到[4, 6, 8]&从上放到下
        6.整行拖拽到[4, 6, 8]&从下放到上
        7.同row内的组件互换位置
       */
      let type = 1
      if (
        activeRow !== overRow &&
        overRow &&
        overItem &&
        activeRow &&
        activeItem
      ) {
        /*
         * 将来拖拽元素加入当前被over的行内, 生成新的被over行
         */
        let cloneOverRow = overRow.slice()
        let cloneActiveRow = activeRow.slice()
        switch (cloneOverRow.length) {
          case 1:
            if (
              activeRow.length === 3 &&
              Math.abs(
                this.drogRows.indexOf(activeRow) -
                  this.drogRows.indexOf(overRow)
              ) === 1
            ) {
              // 禁止wd_12组件整行放置在自己上/下相邻wd_100处
              cloneOverRow = null
            } else {
              cloneOverRow = [
                {
                  width: 0,
                  type: 0
                },
                {
                  ...activeItem,
                  width: 12
                },
                {
                  width: 0,
                  type: 0
                }
              ]
              type = 2
              if (activeRow.length === 3) {
                type =
                  this.drogRows.indexOf(activeRow) <
                  this.drogRows.indexOf(overRow)
                    ? 3
                    : 4
              }
            }
            break
          case 3:
            const putRight = cloneOverRow.indexOf(overItem) === 2 // 新组件放右边
            const left = putRight
              ? { ...cloneOverRow[1], width: 6 }
              : { ...activeItem, width: 6 }
            const right = putRight
              ? { ...activeItem, width: 6 }
              : { ...cloneOverRow[1], width: 6 }
            cloneOverRow = [
              {
                width: 0,
                type: 0
              },
              {
                ...left,
                width: 6
              },
              {
                width: 0,
                type: 0
              },
              {
                ...right,
                width: 6
              },
              {
                width: 0,
                type: 0
              }
            ]
            if (activeRow.length === 3) {
              // 5.整行拖拽到[4, 6]&从上放到下
              // 6.整行拖拽到[4, 6]&从下放到上
              type =
                this.drogRows.indexOf(activeRow) <
                this.drogRows.indexOf(overRow)
                  ? 5
                  : 6
            }
            break
          case 5:
            const newIndex = cloneOverRow.indexOf(overItem) // 新组件放置位置
            cloneOverRow.forEach(item => {
              if (item.width > 4) {
                item.width = 4
              }
            })
            cloneOverRow.splice(
              newIndex,
              1,
              ...[
                {
                  width: 0,
                  type: 0
                },
                {
                  ...activeItem,
                  width: 4
                },
                {
                  width: 0,
                  type: 0
                }
              ]
            )
            if (activeRow.length === 3) {
              type =
                this.drogRows.indexOf(activeRow) <
                this.drogRows.indexOf(overRow)
                  ? 5
                  : 6
            }
            break
          case 7:
            cloneOverRow = null
            break
          default:
            break
        }
        cloneActiveRow = this.getNewActiveRow(cloneActiveRow, activeItem)
        this.doComputed(cloneOverRow, cloneActiveRow, type)
        return
      }
      if (
        activeRow &&
        activeRow == overRow &&
        Math.abs(activeRow.indexOf(activeItem) - overRow.indexOf(overItem)) > 1
      ) {
        let cloneOverRow = overRow.slice()
        let cloneActiveRow = activeRow.slice()
        type = 7
        cloneOverRow.splice(
          cloneOverRow.indexOf(overItem),
          1,
          {
            width: 0,
            type: 0
          },
          {
            ...activeItem
          },
          {
            width: 0,
            type: 0
          }
        )
        cloneOverRow.splice(cloneOverRow.indexOf(activeItem), 2)
        cloneActiveRow = this.getNewActiveRow(cloneActiveRow, activeItem)
        this.doComputed(cloneOverRow, cloneActiveRow, type)
      }
    },
    // 从当前被拖拽行内移除 被拖拽的老元素, 生成新的被拖拽行
    getNewActiveRow(cloneActiveRow, activeItem) {
      let row
      switch (cloneActiveRow.length) {
        case 3:
          row = null
          break
        case 5:
          const otherCom = cloneActiveRow.find(
            item => item !== activeItem && item.type === 1
          )
          row = [
            {
              width: 0,
              type: 0
            },
            {
              ...otherCom,
              width: 12
            },
            {
              width: 0,
              type: 0
            }
          ]
          break
        case 7:
          const otherComs = cloneActiveRow.filter(
            item => item !== activeItem && item.type === 1
          )
          row = [
            {
              width: 0,
              type: 0
            },
            {
              ...otherComs[0],
              width: 6
            },
            {
              width: 0,
              type: 0
            },
            {
              ...otherComs[1],
              width: 6
            },
            {
              width: 0,
              type: 0
            }
          ]
          break
        default:
          break
      }
      return row
    },
    // 为cloneDrogRows赋新值并传递给dialog
    handleAddComp(command) {
      this.addType = command
      this.cloneDrogRows = this.drogRows.slice()
      this.$nextTick(function() {
        this.dialogVisible = true
      })
    },
    // 计算出holder状态的item
    computeOverHolder(overRow, overItem, realOverItem, putLeft) {
      if (overItem !== null) {
        return overItem
      }
      if (realOverItem !== null && putLeft !== null) {
        return overRow[overRow.indexOf(realOverItem) - (putLeft ? 1 : -1)]
      }
      return null
    },
    setOverItem(obj, realOverItem, putLeft) {
      const overRow = obj.row
      const overItem = obj.item
      if (obj.item === null) {
        // 鼠标悬停在[wd_4, wd_6, wd_12]元素里
        if (overRow === this.activeItem.row) {
          // 同row的item互换
          obj.item = this.computeOverHolder(
            overRow,
            overItem,
            realOverItem,
            putLeft
          )
        } else {
          if (overRow.length >= 7) {
            // 不同row，overRow为7行
            obj.item = null
          } else {
            obj.item = this.computeOverHolder(
              overRow,
              overItem,
              realOverItem,
              putLeft
            )
          }
        }
      } else {
        if (overRow.length >= 7) {
          // 不同row，overRow为7行
          obj.item = null
        }
      }
      this.overItem = obj
    },
    // 设置偏移量
    setOffset() {
      this.$nextTick(() => {
        const dropTop = this.$refs.dropTop
        let pos = null
        if (dropTop) {
          pos = dropTop.$el.getBoundingClientRect()
          this.posOffset = {
            x: pos.left || pos.x,
            y: pos.top || pos.y
          }
        }
      })
    },
    // 记录顶层元素当前相对于浏览器可视区域位置
    recordScollDisPos() {
      const pos = this.$refs.dropTop.$el.getBoundingClientRect()
      this.scollPos = {
        x: pos.left || pos.x,
        y: pos.top || pos.y
      }
    },
    // 解决拖拽到左边边缘需要弹回原样的需求
    bindMove(boo) {
      document.removeEventListener('mousemove', this.outOfLimit)
      document[boo ? 'addEventListener' : 'removeEventListener'](
        'mousemove',
        this.outOfLimit
      )
    },
    // 鼠标移到上下边界自动滚动
    autoScoll() {
      const h =
        document.documentElement.clientHeight || document.body.clientHeight
      const cy = this.mousePos.y
      if (h - cy < 38) {
        this.$el.scrollTop += 7
        return
      }
      if (cy < 90) {
        this.$el.scrollTop -= 7
      }
    },
    // 缩放开始点下去事件
    zoomDown(obj) {
      this.isZooming = true
      // 鼠标点下去事件
      this.moveVal = {
        x: 0,
        y: 0
      }
      this.disPos = {
        // 记录鼠标当前位置
        x: obj.e.clientX,
        y: obj.e.clientY
      }
      this.activeItem = {
        // 记录当前拖拽元素对象
        item: obj.item,
        row: obj.row
      }
      // 记录顶层元素当前位置
      this.recordScollDisPos()
      this.bindMove(true)
      this.anotherScaleItem = {
        item: this.activeItem.row.find(
          item => item !== this.activeItem.item && item.type
        ),
        type: null
      }
      this.$store.commit('dashboard/setStopRoll', true)
    },
    // 拖拽点下去事件
    mouDown(obj) {
      this.isDroging = true
      this.moveVal = {
        x: 0,
        y: 0
      }
      const x = obj.e.clientX
      const y = obj.e.clientY
      this.disPos = {
        // 记录鼠标当前位置
        x,
        y
      }
      this.mousePos = {
        // 设置鼠标当前位置
        x,
        y
      }
      this.activeItem = {
        // 记录当前拖拽元素对象
        item: obj.item,
        row: obj.row
      }
      // 记录顶层元素当前位置
      this.recordScollDisPos()
      this.bindMove(true)
      this.$store.commit('dashboard/setStopRoll', true)
    },
    mouMove(e) {
      const dropTop = this.$refs.dropTop
      // 执行拖拽时的鼠标移动事件
      if (dropTop && (this.isDroging || this.isZooming)) {
        let pos = dropTop.$el.getBoundingClientRect()
        this.posOffset = {
          x: pos.left || pos.x,
          y: pos.top || pos.y
        }
        if (e.clientX) {
          const clientX = e.clientX
          const clientY = e.clientY
          // 自动滚动
          this.mousePos = {
            // 设置鼠标当前位置
            x: clientX,
            y: clientY
          }
          const x = clientX - this.disPos.x
          const y = clientY - this.disPos.y
          this.moveVal = {
            x: x + this.saveScollChange.x,
            y: y + this.saveScollChange.y
          }
          this.saveMouseChange = { x, y }
        } else {
          const x = this.scollPos.x - (pos.left || pos.x)
          const y = this.scollPos.y - (pos.top || pos.y)
          if (y < 3500) {
            // 限制Y轴滚动高度
            this.moveVal = {
              // 计算移动值
              x: x + this.saveMouseChange.x,
              y: y + this.saveMouseChange.y
            }
            this.saveScollChange = { x, y }
          }
        }
        this.autoScoll()
      }
    },
    updateZoomRow(obj) {
      const newRow = obj.row.map(item => {
        if (item === obj.item) {
          return obj.newItem
        }
        const otherI = this.anotherScaleItem
        if (item === otherI.item) {
          return {
            ...otherI.item,
            width: obj.anotherWidth ? obj.anotherWidth : otherI.item.width
          }
        }
        return item
      })
      this.$set(this.drogRows, this.drogRows.indexOf(obj.row), newRow)
      this.$nextTick(function() {
        this.dashboardSave()
      })
    },
    // 鼠标弹起事件
    mouUp() {
      this.bindMove(true)
      // 拖拽弹起
      if (this.isDroging) {
        this.isDroging = false
        this.getNewOverRow()
        this.$nextTick(function() {
          // 重置所有组件位置信息
          this.$store.commit('dashboard/setReset', false)
          this.reset()
        })
      }
      // 缩放弹起
      if (this.isZooming) {
        this.isZooming = false
        this.$nextTick(function() {
          // 重置所有组件位置信息
          this.$store.commit('dashboard/setReset', false)
          this.reset()
        })
      }
    },
    // 缩放记录相邻元素
    zoomAnotherItem(type) {
      this.anotherScaleItem.type = type
    },
    // 鼠标超出范围处理
    outOfLimit(e) {
      if (this.isDroging && e.clientX && e.clientX <= 240) {
        this.isDroging = false
        this.bindMove(true)
        this.$nextTick(function() {
          this.$store.commit('dashboard/setReset', false)
          this.reset()
        })
      }
    },
    // 重置数据
    reset() {
      this.disPos = {
        // 鼠标点下去时的坐标记录
        x: null,
        y: null
      }
      this.scollPos = {
        // 顶层元素的坐标
        x: null,
        y: null
      }
      this.moveVal = {
        // 拖拽时的移动值
        x: 0,
        y: 0
      }
      this.mousePos = {
        // 鼠标相对屏幕事实位置
        x: -1,
        y: -1
      }
      this.saveMouseChange = {
        // 鼠标拖动时记录改变值
        x: 0,
        y: 0
      }
      this.saveScollChange = {
        // 滚动条滚动时记录改变值
        x: 0,
        y: 0
      }
      this.activeItem = {
        // 当前被拖拽的元素
        row: null,
        item: null
      }
      this.overItem = {
        // 当前鼠标over的元素
        row: null,
        item: null
      }
      this.isZooming = false
      this.anotherScaleItem = {
        item: null,
        type: null
      }
      this.iframeToBeUpdate = null
      this.setOffset()
      this.$store.commit('dashboard/setStopRoll', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
@mixin border-box {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.dashboard {
  margin: 0 -24px -24px -24px;
  position: relative;
  overflow-x: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  @include border-box;
  &-header {
    padding: 6px 32px 32px 32px;
    color: #333333;
    font-size: 22px;
    justify-content: space-between;
    @include flex;
    .el-button {
      border: 1px solid #3366ff;
      font-size: 14px;
      color: #3366ff;
    }
  }
  /* &-master {
    @include border-box;
    &-item {
      margin-bottom: 16px;
    }
  }
  &-content {
    @include flex;
    @include border-box;
    &-left {
      width: 66%;
      margin-right: 17px;
    }
    &-right {
      width: 32%;
    }
    &-item {
      margin-bottom: 16px;
    }
  } */
  .drop_body {
    @include border-box;
    margin-top: -24px;
    padding-bottom: 400px;
  }
}
.add_button {
  background-color: transparent;
  &:hover {
    background-color: #e9efff;
  }
}
.command_text {
  color: #666666;
}
</style>
