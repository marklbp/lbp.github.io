<template>
  <div class="portal-calendar-warrper">
    <calendar-header
      :isFixed="isFixed"
      :scaleData="scaleDatas"
      ref="calendarHeaderWarpper"
    />
    <div class="table-header-placeholder"></div>
    <div class="portal-calendar" :style="{ maxHeight: calendarHeight }">
      <calendar-table
        :scaleData="scaleDatas"
        :isFixed="isFixed"
        ref="calendarTableWarpper"
        v-show="tableVisible"
      />
      <calendar-activity v-show="activityVisible" ref="activityWarpper" />
    </div>
    <div class="scroll-bar" ref="scrollBar" v-show="columnWidth !== 'auto'">
      <div class="inner" :style="{ width: innerWidth }"></div>
    </div>
  </div>
</template>

<script>
import calendarTable from './calendar-table/index'
import calendarActivity from './calendar-activity'
import calendarHeader from './calendar-header'
import { createCalendarDays } from './util'
import { setTimeout } from 'timers'

export default {
  name: 'portal-calendar',
  components: {
    calendarTable,
    calendarActivity,
    calendarHeader
  },
  props: {
    /**
     * scale 展示比例
     * @param {string} quarter - 以一季度展示.
     * @param {string} mouth - 以一月展示.
     * @param {string} week - 以一周展示.
     */
    scale: {
      type: String,
      default: 'mouth',
      validator: function(value) {
        return ['quarter', 'mouth', 'week'].indexOf(value) !== -1
      }
    },
    /**
     * showDate 展示的时间段
     * @param {string} 时间格式： 2019-07
     */
    showDate: {
      type: String,
      default: ''
    },
    /**
     * showList 展示块
     * @param {Array} 业务目标：goalsShowTag， 活动: activityShowTag
     */
    showList: {
      type: Array,
      required: true
    },
    /**
     * ganttclick 甘特图点击处理方法
     * 参数：甘特图块实体
     */
    ganttclick: {
      type: Function,
      default: _ => _
    },
    /**
     * isFixed 是否固定字段
     */
    isFixed: {
      type: Boolean,
      default: false
    },
    calendarHeight: {
      type: [String, Number],
      default: '200px'
    },
    columnWidth: {
      type: String,
      default: '95'
    }
  },
  data() {
    return {
      scrollLeft: 0,
      innerWidth: 0
    }
  },
  provide() {
    return {
      calendar: this
    }
  },
  // created() {},
  mounted() {
    this.bindEvent()
    this.getInnerWidth()
  },
  methods: {
    bindEvent() {
      this.activityWarpper &&
        this.activityWarpper.addEventListener(
          'scroll',
          e => this.syncScroll(e, 'activity'),
          {
            passive: true
          }
        )
      this.calendarTableWarpper &&
        this.calendarTableWarpper.addEventListener(
          'scroll',
          e => this.syncScroll(e, 'table'),
          {
            passive: true
          }
        )
      this.scrollBar &&
        this.scrollBar.addEventListener(
          'scroll',
          e => this.syncScroll(e, 'bar'),
          {
            passive: true
          }
        )
    },
    unbindEvent() {
      this.activityWarpper &&
        this.activityWarpper.removeEventListener('scroll', this.syncScroll, {
          passive: true
        })
      this.calendarTableWarpper &&
        this.calendarTableWarpper.addEventListener('scroll', this.syncScroll, {
          passive: true
        })
      this.scrollBar &&
        this.scrollBar.addEventListener('scroll', this.syncScroll, {
          passive: true
        })
    },
    syncScroll(e, type) {
      const typeMaps = {
        activity: this.activityWarpper,
        table: this.calendarTableWarpper,
        bar: this.scrollBar
      }
      const {
        calendarHeaderWarpper: { $refs }
      } = this.$refs
      const { scrollLeft } = typeMaps[type]
      for (const key in typeMaps) {
        const wrapper = typeMaps[key]
        if (key !== type && wrapper) {
          wrapper.scrollLeft = scrollLeft
        }
      }
      if (scrollLeft === 0) {
        $refs.table.scrollPosition = 'left'
      } else {
        $refs.table.scrollPosition = 'middle'
      }

      this.calendarHeaderWarpper.scrollLeft = scrollLeft
      this.scrollLeft = scrollLeft
    },
    getInnerWidth() {
      this.$nextTick(() => {
        if (this.calendarHeaderWarpper) {
          // el-table__header 动态设置宽度时时异步，加定时器去获取宽度，以防止取不到正确的
          setTimeout(() => {
            const tableBody = this.calendarHeaderWarpper.querySelector(
              '.el-table__header'
            )
            this.innerWidth = tableBody.style.width
          }, 150)
        }
      })
    },
    refresh() {
      const calendarTableVm = this.$refs.calendarTableWarpper
      const activityVm = this.$refs.activityWarpper
      calendarTableVm && calendarTableVm.getCalendarData()
      activityVm && activityVm.getActivityList()
    }
  },
  computed: {
    calendarTableWarpper() {
      const calendarTableVm = this.$refs.calendarTableWarpper
      return calendarTableVm.$el.querySelector('.el-table__body-wrapper')
    },
    calendarHeaderWarpper() {
      const calendarHeaderVm = this.$refs.calendarHeaderWarpper
      return calendarHeaderVm.$el.querySelector('.el-table__header-wrapper')
    },
    activityWarpper() {
      const activityVm = this.$refs.activityWarpper
      return activityVm.$el.querySelector('.activity-list')
    },
    scrollBar() {
      return this.$refs.scrollBar
    },
    scaleDatas() {
      // 传入展示维度，和要展示的年月
      return createCalendarDays(this.scale, this.showDate)
    },
    tableVisible() {
      return this.showList.includes('goalsShowTag')
    },
    activityVisible() {
      return this.showList.includes('activityShowTag')
    }
  },
  watch: {
    showDate(val, newVal) {
      if (val !== newVal) {
        this.getInnerWidth()
      }
    }
  },
  destroyed() {
    this.unbindEvent()
  }
}
</script>

<style lang="scss" scoped>
.portal-calendar-warrper {
  position: relative;
  width: 100%;
  .table-header-placeholder {
    height: 48px;
  }
  .scroll-bar {
    overflow-x: scroll;
    .inner {
      height: 1px;
    }
    &::-webkit-scrollbar {
      width: 5px; //y轴上的滚动条宽度
      height: 5px; //x轴上滚动条高度
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px; /*滚动条的背景区域的圆角*/
      background-color: #fdf8f5; /*滚动条的背景颜色*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px; /*滚动条的圆角*/
      background-color: rgba(144, 147, 153, 0.4); /*滚动条的背景颜色*/
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(144, 147, 153, 0.6);
    }

    &::-webkit-scrollbar-thumb:active {
      // background-color: rgb(46, 86, 159);
      cursor: pointer;
    }
  }
}
.portal-calendar {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px; //y轴上的滚动条宽度
    height: 5px; //x轴上滚动条高度
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px; /*滚动条的背景区域的圆角*/
    background-color: #fdf8f5; /*滚动条的背景颜色*/
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px; /*滚动条的圆角*/
    background-color: rgba(144, 147, 153, 0.4); /*滚动条的背景颜色*/
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, 0.6);
  }

  &::-webkit-scrollbar-thumb:active {
    // background-color: rgb(46, 86, 159);
    cursor: pointer;
  }
}
</style>
