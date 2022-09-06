<template>
  <page-init-pagination 
    :has-store="hasStore"
    api-name="getProcessCalendarView"
    :params="params"
    :http-config="httpConfig"
    @request-before="reqBefore"
    @request-done="reqDone"
    @request-fail="reqFail"
  >
    <gantt
      :options="ganttOptions"
      :tasks="tasks"
      @chart-task-mouseenter="showTip"
      @chart-task-mouseout="hideTip"
      @chart-line-mouseover="highLight"
      @chart-line-mouseout="resetLine"
      ref="gantt"
    />
  </page-init-pagination>
</template>
<script>
import ganttOptions from './options'
import processTaskMixin from './process.task.mixin'
import tooltipMixin from './tooltip.mixin'
export default {
  components: {
    pageInitPagination: _ => import('~/components/page-init-pagination'),
    gantt: _ => import('~/components/gantt')
  },
  mixins: [processTaskMixin, tooltipMixin],
  props: {
    hasStore: {
      default: _ => false,
      type: Boolean
    },
    params: {
      default: _ => ({
        keyWord: '',
        tags: '',
        status: '',
        fromTime: '',
        toTime: '',
        creator: '',
        searchType: 0,
        isHideFile: 1,
        sort: 0
      }),
      type: Object
    }
  },
  data() {
    return {
      tasks: [],
      ganttOptions,
      httpConfig: {
        headers: {
          groupId: this.$route.params.storeId
        }
      }
    }
  },
  methods: {
    reqBefore(params) {
      this.clearTip()
      params = Object.assign(params, this.params, {
        type: !this.hasStore ? +this.params.searchType + 1 : '4'
      })
      params.createFrom = params.fromTime
      params.createTo = params.toTime
      params.filed = params.isHideFile == 0 ? 1 : 0
      params.groupId = this.$route.params.storeId
      delete params.fromTime
      delete params.toTime
      delete params.isHideFile
      delete params.searchType
    },
    reqDone(res) {
      let data = res.data || {}
      if (data.records && data.records.length > 0) {
        this.tasks = this.processData(data.records)
      }
    },
    reqFail(err) {
      console.log(err)
    },
    highLight({e, data}) {
      e.target.style.strokeWidth = 4
      console.log(data)
      this.$refs.gantt.highLightTaskIds.push(data.id, data.dependentOn[0], e.target.style.stroke)
    },
    resetLine({e, data}) {
      e.target.style.strokeWidth = 1
      this.$refs.gantt.highLightTaskIds = []
    }
  }
}
</script>
<style lang="scss">
  .gantt-elastic__calendar-row-rect.gantt-elastic__calendar-row-rect--month {
    border-bottom: 1px solid #dadada
  }
</style>