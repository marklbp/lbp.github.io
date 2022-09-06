<template>
  <div class="activity-item">
    <div class="activity-item-side">
      <span>{{ title }}</span>
    </div>
    <div
      class="activity-item-side fixed"
      :class="scrollLeft !== 0 ? 'shodow' : ''"
      :style="{ left: scrollLeft - 1 + 'px' }"
    >
      <span>{{ title }}</span>
    </div>
    <div class="activity-item-warpper">
      <div class="activity-item-container">
        <div
          class="activity-item-row"
          v-for="(vGroup, i) in groupData"
          :key="i"
        >
          <div
            class="activity-item-column"
            v-for="item in calendarDatas"
            :key="item.day"
            :style="{ width: POINT + 'px' }"
          ></div>
          <div
            v-contextmenu:contextmenu
            v-gantt-popover="act"
            v-for="act in vGroup"
            class="activity-item-layout"
            @click="ganttclick(act)"
            :style="drawGanttPosition(act)"
            :key="act.id + act.activityName"
            :dataId="act.id"
          >
            <div class="activity-title">{{ act.activityName }}</div>
            <!-- :class="isWeek ? '' : 'hover-activity'" -->
            <!-- <i
              class="el-icon-delete"
              :class="isNextMonth(act) ? 'left' : ''"
              @click="delActivity($event, act)"
            ></i>-->
          </div>
        </div>
      </div>
    </div>
    <v-contextmenu
      ref="contextmenu"
      :disabled="isWeek"
      @contextmenu="handleContextmenu"
    >
      <v-contextmenu-item @click="delActivity">删除</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import ganttPopover from '../../gantt-popover'
// 因为contextmenu 多个存在无法关闭其他组件，故使用bus广播处理
import { bus } from '~/utils/bus'
// 每天的点数
// const POINT = 95
const prefixs = [
  '-webkit-transform',
  'mozTransform',
  'msTransform',
  'oTransfrom',
  'transform'
]
/**
 * GANTT图思路
 * 1、时间切割块、每一个泳道的每个时间块只允许有一个活动存在，重复时间活动另起一个泳道
 * 最后的数据结构 [[activityItem], [activityItem],[activityItem]]二维数组  😉
 * 2、获取泳道视图的长度总点数， 如：月视图，30天 *  point 用来定位的 laneWidthPoint 😉
 * 3、获取泳道视图的时间总点数 即：30天 * 24小时 * 60分钟 * 60秒 *1000ms 精确到毫秒 laneTimePoint 😉
 * 4、获取每个活动的时间点数 结束时间减去开始时间 => 换算成毫秒=  activityTimePoint 😉
 * 5、获取每个活动的长度点数 activityTimePoint/laneTimePoint * laneWidthPoint = activityWidthPoint😉
 * 6、获取每个活动的开始位置  (活动开始时间 - 当前视图开始时间 ) / laneTimePoint   * laneWidthPoint = activityX😉
 */

/**
 * 按时间切块
 * 1、循环原数组，进行检测是否时间重叠，如果有则新增一项
 * 2、检测是否重叠，每一项的开始时间和结束时间是否再已有项的开始时间和结束时间的区间
 */

export default {
  name: 'activity-item',
  // components: {},
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: Number
    },
    data: {
      type: Array,
      default: _ => []
    },
    calendarDatas: {
      type: Array,
      default: _ => []
    },
    ganttclick: {
      type: Function,
      default: _ => _
    },
    POINT: {
      type: Number,
      default: 95
    }
  },
  data() {
    return {
      groupData: [],
      visible: false,
      deleteId: 0
    }
  },
  inject: ['calendar'],
  directives: { ganttPopover },
  // created() {},
  mounted() {
    this.cutTimeList()
    bus.$on('contextTrigger', this.handelContextTrigger)
  },
  methods: {
    activityTimePoint(start, end) {
      return end - start
    },
    // 绘制甘特图位置和样式
    drawGanttPosition(ganttData) {
      const { activityStartTime, activityEndTime } = ganttData
      // 活动时间长度
      const activityTimePoint = this.activityTimePoint(
        activityStartTime,
        activityEndTime
      )
      // 活动长度
      let activityWidthPoint =
        (activityTimePoint / this.laneTimePoint) * this.laneWidthPoint
      // 活动开始位置
      let activityX =
        ((activityStartTime - this.calendarDatas[0].date) /
          this.laneTimePoint) *
        this.laneWidthPoint
      // 处理长度超出的情况
      activityWidthPoint =
        activityX < 0 ? activityWidthPoint + activityX : activityWidthPoint

      // activityWidthPoint =
      //   activityWidthPoint > this.laneWidthPoint
      //     ? this.laneWidthPoint
      //     : activityWidthPoint
      activityWidthPoint = this.isNextMonth(ganttData)
        ? this.laneWidthPoint - activityX
        : activityWidthPoint

      activityX = activityX < 0 ? 0 : activityX

      const style = {
        width: activityWidthPoint + 'px',
        backgroundColor: '#5C8AFF'
      }
      ganttData.__style__ = {
        width: activityWidthPoint,
        backgroundColor: '#5C8AFF',
        activityX
      }

      const transform = `translate(${activityX}px, -50%) translateZ(0)`
      prefixs.forEach(item => (style[item] = transform))
      return style
    },
    // 切割时间块，每一行不能有重叠的时间
    cutTimeList() {
      // data已存在数据，originData 需要判断的数据
      const checkTime = (data, originData) => {
        if (!data || !originData) return false
        const condition1 =
          originData.activityStartTime >= data.activityStartTime &&
          originData.activityStartTime <= data.activityEndTime
        const condition2 =
          originData.activityEndTime >= data.activityStartTime &&
          originData.activityEndTime <= data.activityEndTime
        // 如果有一个条件成立则需要另起一行
        return condition2 || condition1
      }

      // 拿当前时间去对比resultTimeZone 里面每个的时间是否有重叠
      const checkAllTime = (arr, data) => {
        return arr.every(v => {
          return !checkTime(v, data)
        })
      }
      function group(data) {
        const matrix = []
        let count = 0
        function recursion(data) {
          const resultTimeZone = []
          const b = data.filter(item => {
            if (checkAllTime(resultTimeZone, item)) {
              resultTimeZone.push(item)
              return false
            } else {
              return true
            }
          })
          matrix[count] = resultTimeZone.slice()
          if (b.length > 0) {
            count++
            recursion(b)
          }
        }
        recursion(data)
        return matrix
      }
      this.groupData = group(this.data)
    },
    delActivity(e) {
      const act = { id: this.deleteId }
      this.$emit('activityDel', act)
    },
    // 是否跨月
    isNextMonth(act) {
      // const startMonth = new Date(act.activityStartTime).getMonth()
      const endMonth = new Date(act.activityEndTime).getMonth()
      const currentMonth = new Date(this.calendarDatas[0].date).getMonth()
      return currentMonth < endMonth
    },
    // 处理右键菜单
    handleContextmenu(vnode) {
      bus.$emit('contextTrigger', this.type)
      const {
        data: {
          attrs: { dataId }
        }
      } = vnode
      this.deleteId = dataId
    },
    handelContextTrigger(type) {
      if (type !== this.type) {
        const { contextmenu } = this.$refs
        contextmenu && contextmenu.hide()
      }
    }
  },
  computed: {
    // 泳道视图的长度总点数
    laneWidthPoint() {
      return this.calendarDatas.length * this.POINT
    },
    laneTimePoint() {
      const start = this.calendarDatas[0]
      const end = this.calendarDatas[this.calendarDatas.length - 1]
      // 再加 8.64e7一天的时间戳， 因为每个日期都是从每天的00：00：00开始
      return end.date - start.date + 8.64e7
    },
    scrollLeft() {
      return this.calendar.scrollLeft
    },
    isWeek() {
      return this.calendar.scale === 'week'
    }
  },
  // watch: {},
  beforeDestory() {
    bus.$off('contextTrigger', this.handelContextTrigger)
  }
}
</script>

<style lang="scss" scoped>
.activity-item {
  display: flex;
  background: #fff;
  border-left: 1px solid #e8e8e8;
  position: relative;
  &-side {
    width: 315px;
    min-height: 48px;
    font-size: 12px;
    padding-left: 32px;
    font-size: 12px;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    flex-shrink: 0;
    position: relative;
    span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &.fixed {
      position: absolute;
      height: 100%;
      background: #fff;
      z-index: 22;
      border-right: 0;
      top: 0;
      &.shodow {
        box-shadow: 5px 0 10px -5px rgba(0, 0, 0, 0.12);
      }
    }
  }
  &-warpper {
    flex: 1 1;
  }
  &-container {
    width: 100%;
    min-height: 48px;
    flex: 1;
    flex-shrink: 0;
    background: #fff;
  }
  &-row {
    width: 100%;
    height: 48px;
    left: 0;
    top: 0;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  &-layout {
    position: absolute;
    top: 50%;
    height: 24px;
    width: 100px;
    line-height: 24px;
    background: rgb(25, 196, 159);
    font-size: 12px;
    transform: translateY(-50%);
    // text-align: center;
    &.hover-activity:hover {
      .el-icon-delete {
        display: block;
      }
    }
    .activity-title {
      text-indent: 1.5em;
      overflow: hidden;
      color: #fff;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      user-select: none;
    }
    .el-icon-delete {
      animation: fade-in 0.4s;
      display: none;
      position: absolute;
      top: 50%;
      line-height: 24px;
      transform: translateY(-50%);
      right: -26px;
      width: 26px;
      text-align: center;
      cursor: pointer;
      &.left {
        left: -26px;
        right: unset;
      }
    }
  }
  &-column {
    height: 48px;
    font-size: 12px;
    width: 95px;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
