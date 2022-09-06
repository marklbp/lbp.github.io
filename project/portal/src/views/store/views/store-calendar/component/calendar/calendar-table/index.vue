<template>
  <div class="portal-calendar-body">
    <collapse-bar
      :class="showTable ? 'none-bottomborder' : ''"
      title="业务目标"
      :scrollLeft="scrollLeft"
      v-model="showTable"
    />
    <div
      class="placeholder-warpper"
      :style="{ maxHeight: loading ? '400px' : 'none' }"
      v-loading="loading"
    >
      <el-table
        v-show="showTable"
        border
        width="100%"
        ref="table"
        :data="tableData"
        :span-method="arraySpanMethod"
        :row-style="drawRowStyle"
        :cell-style="cellStyleMethod"
      >
        <el-table-column
          :fixed="isFixed"
          :resizable="false"
          label="项目"
          prop="mergeStr"
          width="95"
        />
        <el-table-column
          :fixed="isFixed"
          :resizable="false"
          label="每日目标"
          :width="110"
          prop="labelStr"
        />
        <el-table-column
          :fixed="isFixed"
          :resizable="false"
          label="合计/平均"
          :width="110"
          prop="numerical"
        />
        <el-table-column
          :resizable="false"
          v-for="item in scaleData"
          align="center"
          :key="item.day"
          :prop="item.day + '日'"
          :label="`${item.day}日 ${item.weekDay}`"
          :width="columnWidth"
        />
      </el-table>
      <!-- <div class="placeholder" v-show="message.length && !originData.length">
        <pageInit :loading="false" :message="message" />
      </div>-->
    </div>
  </div>
</template>

<script>
import {
  mergeLabels,
  tableLabels,
  filedMaps,
  mergeLabelsWeek,
  tableLabelsWeek,
  filedMapsWeek
} from '../util'
import collapseBar from '../collapse-bar'
// import pageInit from '~/components/page-init'

export default {
  name: 'calendar-table',
  components: {
    collapseBar
    // pageInit
  },
  props: {
    scaleData: {
      type: Array,
      default: _ => []
    },
    visible: {
      type: Boolean,
      default: true
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTable: true,
      storeId: '',
      originData: [],
      message: '',
      loading: false
    }
  },
  inject: ['calendar'],
  created() {
    this.getCalendarData()
  },
  mounted() {
    this.fixPosition()
  },
  methods: {
    // 获取业务数据
    async getCalendarData() {
      try {
        this.loading = true
        this.originData = []
        const { queryReportData } = this.$api.calendar
        const params = {
          exportTime: this.searchDate
        }
        const res = await queryReportData(params, this.httpConfig())
        this.originData = res.data || []
        const length = this.originData.length
        this.message = length > 0 ? '' : '暂无数据'
        this.loading = false
      } catch (err) {
        this.loading = false
        // this.message = err.msg || err.message
        console.error(err)
      }
    },
    // 合并表格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const isWeek = this.calendar.scale === 'week'

      if (columnIndex === 0) {
        if (!isWeek) {
          if (rowIndex === 0 || rowIndex === 7 || rowIndex === 20) {
            return [7, 1]
          } else if (rowIndex === 14 || rowIndex === 17) {
            return [3, 1]
          } else {
            return [0, 0]
          }
        } else {
          if (rowIndex % 3 === 0) {
            return [3, 1]
          } else {
            return [0, 0]
          }
        }
      }
    },
    // 对源数据转换
    transformData() {
      /**
       * filedMaps
       * mergeLabels
       * tableLabels
       */
      // 处理周的数据表格格式， 周不需要MTD的展示
      const isWeek = this.calendar.scale === 'week'
      const fileds = isWeek ? filedMapsWeek : filedMaps
      const mergeStr = isWeek ? mergeLabelsWeek : mergeLabels
      const labelStr = isWeek ? tableLabelsWeek : tableLabels

      const arrayData = []
      for (let i = 0; i < fileds.length; i++) {
        let key = fileds[i]
        let label = isWeek ? labelStr[i % 3] : labelStr[i]
        let arrayItem = {
          mergeStr: !mergeStr[i] ? '' : mergeStr[i],
          labelStr: label
          // numerical: i
        }
        for (const m of this.originData) {
          const day = new Date(m.dataDate).getDate()
          const prop = day + '日'
          const isPro = key.includes('Progress')
          let value
          // 如果是进度相关字段就小数转百分百
          if (!isPro) {
            // 判断是否是数字并且不等于0
            if (typeof m[key] === 'number' && m[key] !== 0) {
              value = m[key].toFixed(2)
            } else {
              value = m[key]
            }
          } else {
            // 判断是有值
            if (m[key]) {
              value = (m[key] * 100).toFixed(2) + '%'
            } else {
              value = 0
            }
          }
          arrayItem[prop] = value
        }
        arrayData.push(arrayItem)
      }
      return arrayData
    },
    // 绘制表格样式
    drawRowStyle({ row, rowIndex, ...rest }) {
      const styleString = 'font-size: 12px;'
      return styleString
    },
    cellStyleMethod({ row, column, rowIndex, columnIndex }) {
      const ARR = ['转化率', 'GMV', '销售流水', '客单价', 'UV']
      const bg =
        ARR.indexOf(row.mergeStr) > -1 && column.label == '项目'
          ? { backgroundColor: '#fff !important' }
          : {}
      return bg
    },
    // 修复table位置、布局不准确的问题
    fixPosition() {
      this.$nextTick(() => {
        if (this.table) {
          this.table.layout.gutterWidth = 0
          this.table.syncPostion()
          this.table.doLayout()
        }
      })
    },
    // 生成header 头
    httpConfig() {
      const { storeId } = this.$route.params
      this.storeId = storeId
      return {
        headers: {
          groupId: storeId
        },
        needToast: false
      }
    }
  },
  computed: {
    tableData() {
      return this.transformData()
    },
    scrollLeft() {
      return this.calendar.scrollLeft
    },
    searchDate() {
      return this.calendar.showDate
    },
    table() {
      return this.$refs.table
    },
    columnWidth() {
      return this.calendar.columnWidth
    }
  },
  watch: {
    scaleData(val) {
      this.fixPosition()
    },
    searchDate(val) {
      this.getCalendarData()
    }
  }
}
</script>

<style lang="scss" scoped>
.none-bottomborder {
  border-bottom: none;
}
.portal-calendar-body {
  /deep/ .el-table__header-wrapper {
    display: none;
  }
  .placeholder-warpper {
    overflow: hidden;
    position: relative;
    .placeholder {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background: #fff;
      z-index: 11;
      border: 1px solid #e8e8e8;
    }
  }
  /deep/ .component-empty {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
  }

  .el-table /deep/ .el-table__body-wrapper {
    // 滚动条设置
    &::-webkit-scrollbar {
      width: 0; //y轴上的滚动条宽度
      height: 0; //x轴上滚动条高度
    }
    padding: 0;
  }
}
</style>
