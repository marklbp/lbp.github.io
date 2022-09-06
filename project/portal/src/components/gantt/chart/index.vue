<template>
  <div class="gantt-elastic__chart" :style="{ ...root.style['chart'] }" ref="chart">
    <div
      class="gantt-elastic__chart-calendar-container"
      ref="chartCalendarContainer"
      :style="{
        ...root.style['chart-calendar-container'],
        height: root.state.options.calendar.height + 'px',
        'margin-bottom': root.state.options.calendar.gap + 'px'
      }"
    >
      <calendar></calendar>
    </div>
    <div
      class="gantt-elastic__chart-graph-container"
      ref="chartGraphContainer"
      :style="{
        ...root.style['chart-graph-container'],
        height: root.state.options.height - root.state.options.calendar.height + 'px'
      }"
    >
      <div
        :style="{
          ...root.style['chart-area'],
          width: root.state.options.width + 'px',
          height: root.state.options.rowsHeight + 'px'
        }"
      >
        <div
          class="gantt-elastic__chart-graph"
          ref="chartGraph"
          :style="{ ...root.style['chart-graph'], height: '100%' }"
        >
          <svg
            class="gantt-elastic__chart-graph-svg"
            :style="{ ...root.style['chart-graph-svg'] }"
            ref="chartGraphSvg"
            x="0"
            y="0"
            :width="root.state.options.width + 'px'"
            :height="root.state.options.allVisibleTasksHeight + 'px'"
            xmlns="http://www.w3.org/2000/svg"
          >
            <days-highlight></days-highlight>
            <grid></grid>
            <dependency-lines :tasks="root.visibleTasks"></dependency-lines>
            <g
              class="gantt-elastic__chart-row-wrapper"
              :style="{ ...root.style['chart-row-wrapper'] }"
              v-for="task in root.visibleTasks"
              :task="task"
              :key="task.id"
            >
              <component :ref="'chart_tasks_comp_' + task.id" :task="task" :is="task.type"></component>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Grid from './grid';
import DaysHighlight from './days-highlight';
import Calendar from '../calendar';
import DependencyLines from './dependency-lines';
import Task from './row/task';
import Milestone from './row/milestone';
import Project from './row/project';
export default {
  name: 'Chart',
  components: {
    Grid,
    DependencyLines,
    Calendar,
    Task,
    Milestone,
    Project,
    DaysHighlight
  },
  inject: ['root'],
  data() {
    return {
      moving: false
    };
  },
  /**
   * Mounted
   */
  mounted() {
    this.root.state.refs.chart = this.$refs.chart;
    this.root.state.refs.chartCalendarContainer = this.$refs.chartCalendarContainer;
    this.root.state.refs.chartGraphContainer = this.$refs.chartGraphContainer;
    this.root.state.refs.chartGraph = this.$refs.chartGraph;
    this.root.state.refs.chartGraphSvg = this.$refs.chartGraphSvg;
  },

  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      return `0 0 ${this.root.state.options.width} ${this.root.state.options.allVisibleTasksHeight}`;
    }
  },
  watch: {
    'root.highLightTaskIds': function (v) {
      if (v.length > 0) {
        let id1 = v[0]
        let id2 = v[1]
        let refs = this.$refs
        let c = v[2]
        let f = (refs, id, w, c) => {
          let t = refs['chart_tasks_comp_' + id]
          t = (t instanceof Array) ? t[0] : t
          t = t.$refs['chart_tasks_' + id]
          if (t) {
            Object.assign(t.style, {
              stroke: c,
              strokeWidth: w
            })
          }
        }
        f(refs, id1, 8, c)
        f(refs, id2, 8, c)
        this.root.resetTaskStroke = _ => {
          f(refs, id1, 1, 'transparent')
          f(refs, id2, 1, 'transparent')
          f = refs = id1 = id2 = c = null
        }
      }
      if (v.length <= 0 && this.root.resetTaskStroke) {
        this.root.resetTaskStroke()
        this.root.resetTaskStroke = null
      }
    }
  }
};
</script>
