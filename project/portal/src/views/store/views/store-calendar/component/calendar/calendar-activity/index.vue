<template>
  <div class="calendar-activity">
    <collapse-bar
      title="店铺活动"
      :scrollLeft="scrollLeft"
      v-model="showActivity"
    />
    <div
      class="activity-list"
      v-show="showActivity"
      ref="activityList"
      :style="{ overflowX: !isAuto ? 'scroll' : 'hidden' }"
    >
      <page-init :loading="loading" :message="message">
        <activity-item
          v-for="(act, index) in activityData"
          :key="act.activityType"
          :data="act.activityList"
          :title="act.activityType"
          :type="index"
          :ganttclick="handleGanttClick"
          :calendarDatas="calendar.scaleDatas"
          @activityDel="handleActivityDel"
          :POINT="activityWidth"
          >{{ act.activityType }}</activity-item
        >
      </page-init>
    </div>
  </div>
</template>

<script>
import activityItem from './activity-item'
import collapseBar from '../collapse-bar'
import pageInit from '~/components/page-init'

const activityTypes = { 1: '平台型活动', 2: '店铺型活动' }
export default {
  name: 'calendar-activity',
  components: {
    activityItem,
    pageInit,
    collapseBar
  },
  // props: {},
  data() {
    return {
      showActivity: true,
      originActivityData: [],
      message: '',
      loading: false,
      activityWidth: 95
    }
  },
  inject: ['calendar'],
  created() {
    this.getActivityList()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isAuto) {
        this.bindOrUnbindEvent(true)
        this.getAutoWidth()
      }
    })
  },
  methods: {
    // 获取活动列表
    async getActivityList() {
      try {
        this.loading = true
        const { queryActivityList } = this.$api.calendar
        const params = {
          exportTime: this.searchDate
        }
        const res = await queryActivityList(params, this.httpConfig())
        this.originActivityData = res.data || []
        // const length = this.originActivityData.length
        this.message = ''
        this.loading = false
      } catch (err) {
        console.error(err)
        // this.message = err.msg || err.message
        this.loading = false
      }
    },
    async deleteActivity(activityItem) {
      try {
        const { delActivityById } = this.$api.calendar
        const params = {
          id: activityItem.id
        }
        await delActivityById(params, this.httpConfig())
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000,
          onClose: () => {
            this.getActivityList()
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    handleActivityDel(activityItem) {
      this.$confirm('确定要删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      })
        .then(() => {
          this.deleteActivity(activityItem)
        })
        .catch(() => {
          // nothing
        })
    },
    // 生成header 头
    httpConfig() {
      const { storeId } = this.$route.params
      return {
        headers: {
          groupId: storeId
        },
        needToast: false
      }
    },
    // 处理甘特图点击
    handleGanttClick(ganttItem) {
      const { storeId } = this.$route.params
      this.$router.push({
        name: `activity-detail`,
        params: {
          storeId,
          id: ganttItem.id
        }
      })
    },
    getAutoWidth() {
      if (this.activityList) {
        const { width } = this.activityList.getBoundingClientRect()
        this.activityWidth = (width - 315) / 7
      }
    },
    bindOrUnbindEvent(isBind) {
      if (isBind) {
        window.addEventListener('resize', this.getAutoWidth)
      } else {
        window.removeEventListener('resize', this.getAutoWidth)
      }
    }
  },
  computed: {
    // 根据活动类型分组
    activityData() {
      const { originActivityData } = this
      // 分组
      const reduceObj = originActivityData
        .map(act => {
          return act.type
        })
        .reduce((acc, val, i) => {
          acc[val] = (acc[val] || []).concat(originActivityData[i])
          return acc
        }, {})
      let data = Object.keys(reduceObj).map(item => ({
        activityType: activityTypes[item],
        activityList: reduceObj[item]
      }))
      for (const n in activityTypes) {
        if (!reduceObj[n]) {
          data.push({
            activityType: activityTypes[n],
            activityList: []
          })
        }
      }
      return data
    },

    activityList() {
      return this.$refs.activityList
    },
    scrollLeft() {
      return this.calendar.scrollLeft
    },
    searchDate() {
      return this.calendar.showDate
    },
    isAuto() {
      return this.calendar.columnWidth === 'auto'
    }
  },
  watch: {
    showActivity(val) {
      if (val && this.activityList) {
        this.$nextTick(() => {
          this.activityList.scrollLeft = this.calendar.scrollLeft
        })
      }
    },
    searchDate() {
      this.getActivityList()
    }
  },
  beforeDestory() {
    if (this.isAuto) {
      this.bindOrUnbindEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-activity {
  .page-init {
    min-height: auto;
  }
  /deep/ .component-empty {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
  }
  .activity-list {
    &::-webkit-scrollbar {
      width: 0; //y轴上的滚动条宽度
      height: 0; //x轴上滚动条高度
    }
  }
}
</style>
