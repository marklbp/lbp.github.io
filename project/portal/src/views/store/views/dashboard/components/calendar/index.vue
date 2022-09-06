<template>
  <div class="calendar-dashborad">
    <div class="title">
      <h4>店铺本周日历</h4>
      <span @click="toCalendar">完整日历 ></span>
    </div>

    <calendar
      :showList="showList"
      :showDate="searchDate"
      :calendarHeight="600"
      columnWidth="auto"
      scale="week"
      ref="calendar"
    />
  </div>
</template>

<script>
import calendar from '@/store/views/store-calendar/component/calendar'

export default {
  name: 'calendar-dashborad',
  components: { calendar },
  // props: {},
  data() {
    return {
      showList: ['goalsShowTag', 'activityShowTag'],
      searchDate: ''
    }
  },
  created() {
    this.getCurrentDate()
  },
  // mounted() {},
  methods: {
    toCalendar() {
      const { storeId } = this.$route.params
      this.$router.push(`/${storeId}/store-calendar`)
    },
    getCurrentDate() {
      const nowDate = new Date()
      const Y = nowDate.getFullYear()
      let M = nowDate.getMonth() + 1
      let D = nowDate.getDate()
      M = M > 9 ? M : '0' + M
      D = D > 9 ? D : '0' + D
      this.searchDate = `${Y}-${M}-${D}`
    }
  },
  // computed: {},
  watch: {
    '$route.params.storeId': function(val, oVal) {
      const calendar = this.$refs.calendar
      calendar && calendar.refresh()
    }
  }
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.calendar-dashborad {
  background: #fff;
  .title {
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    display: flex;
    padding: 0 24px 0 32px;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8ff;
    > h4 {
      margin: 0;
    }
    > span {
      font-size: 14px;
      cursor: pointer;
      color: #3366ffff;
    }
  }
}
</style>
