<template>
  <div class="store-calender-wrpper">
    <router-back text="店铺日历" disableRoute />
    <!-- 筛选栏 -->
    <el-form class="filter-action-bar">
      <el-form-item label="报表显示：">
        <el-checkbox-group v-model="showList">
          <el-checkbox label="goalsShowTag">业务目标</el-checkbox>
          <el-checkbox label="activityShowTag">活动</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-select style="width: 96px;" v-model="yearValue">
          <el-option
            v-for="m in 5"
            :value="new Date().getFullYear() - m + 1"
            :label="`${new Date().getFullYear() - m + 1}年`"
            :key="m"
          ></el-option>
        </el-select>
        <el-select style="width: 78px;" v-model="monthValue">
          <el-option
            :value="n.toString().padStart(2, '0')"
            :label="`${n}月`"
            v-for="n in 12"
            :key="n"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 新建&导入&导出 -->
    <el-form class="filter-action-bar" style="padding-right: 0;">
      <el-form-item>
        <el-button @click="createdActivity" type="primary" size="small">
          <i class="font-icon add" style="margin-right:4px;"></i>新建活动
        </el-button>
        <!-- <el-button size="small">导入月度计划</el-button> -->
        <!-- <el-button size="small" @click="modalVisible = true"
          >导出报表</el-button
        >-->
      </el-form-item>
      <!-- <div class="right-action">
        <section class="export-button import" @click="modalVisible = true">
          <span class="font-icon import"></span>导入月度计划
        </section>
      </div>-->
      <div class="right-action">
        <section class="export-button" @click="modalVisible = true">
          <span class="font-icon export"></span>导出
        </section>
      </div>
    </el-form>
    <!-- :style="{ height: tableHeight }" -->
    <portal-calendar
      :showDate="showDateStr"
      :showList="showList"
      :calendarHeight="tableHeight"
      :isFixed="true"
    />
    <export-modal
      v-model="modalVisible"
      :parentFildeds="showList"
      @exported="handleExport"
    />
  </div>
</template>

<script>
import routerBack from '~/components/router-back'
import portalCalendar from './component/calendar'
import exportModal from './component/export-modal'
export default {
  components: {
    routerBack,
    portalCalendar,
    exportModal
  },
  props: {},
  data() {
    const now = new Date()
    const mouth = (now.getMonth() + 1).toString()
    return {
      showList: ['goalsShowTag', 'activityShowTag'],
      activityList: [],
      yearValue: now.getFullYear(),
      monthValue: mouth.padStart(2, '0'),
      modalVisible: false,
      tableHeight: '0',
      storeId: '',
      tableData: []
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = document.body.clientHeight - 335 + 'px'
    })
  },
  methods: {
    // 请求导出文件接口
    async handleExport(exportFileds) {
      try {
        const { storeId } = this.$route.params
        const httpConfig = {
          headers: {
            groupId: storeId
          }
        }
        const { exportCalendarData } = this.$api.calendar
        const params = {
          exportTime: this.showDateStr
        }
        exportFileds.forEach(filed => (params[filed] = true))
        const res = await exportCalendarData(params, {
          ...httpConfig,
          responseType: 'blob'
        })
        if (!res.data) throw Error('服务异常，请稍后再试')
        this.$helper.downloadByBinary(
          res.data,
          `report-${this.showDateStr}.xls`,
          'application/vnd.ms-excel;charset=utf-8'
        )
        this.modalVisible = false
      } catch (err) {
        console.error(err)
        this.$message.error(err.message)
      }
    },
    createdActivity() {
      const { storeId } = this.$route.params
      this.$router.push(`/${storeId}/store-calendar/create-activity`)
    } /*,
    downloadExcal(resBlob) {
      const blob = new Blob([resBlob], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = `report-${this.showDateStr}.xls`
      document.body.appendChild(downloadElement)
      downloadElement.click()
      // 下载完成移除元素
      document.body.removeChild(downloadElement)
      // 释放掉blob对象
      window.URL.revokeObjectURL(href)
    }*/
  },
  computed: {
    showDateStr() {
      return this.yearValue + '-' + this.monthValue
    }
  }
}
</script>

<style lang="scss" scoped>
.store-calender-wrpper {
  .filter-action-bar {
    height: 56px;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0 32px;
    margin-bottom: 16px;
    .right-action {
      .export-button {
        color: #666666;
        font-size: 14px;
        line-height: 56px;
        display: flex;
        align-items: center;
        padding: 0 24px 0 19px;
        border-left: 1px solid #e8e8e8;
        &.import {
          border-left: none;
        }
        cursor: pointer;
        &:hover {
          color: #333;
          span {
            color: #333;
          }
        }
        span {
          font-size: 20px;
          color: #999;
          margin-right: 10px;
        }
      }
    }
    &:nth-child(3) {
      margin: 0;
    }
    .el-form-item {
      margin: 0;
      &:first-child {
        flex: 1;
      }
      .el-button {
        padding: 8px 13px;
      }
    }
  }
}
</style>
