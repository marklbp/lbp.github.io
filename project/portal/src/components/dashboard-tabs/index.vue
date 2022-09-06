<template>
  <div class="master-tab">
    <slot v-show="enableDrag" name="drag" />
    <div class="master-tab-extra" v-show="!pageInit">
      <div v-if="width === 12">数据截止日期：{{ getNowFormatDate() }}</div>
      <el-tooltip
        v-else
        effect="dark"
        :content="`数据截止日期：${getNowFormatDate()}`"
        placement="bottom"
      >
        <i class="el-icon-time" />
      </el-tooltip>
    </div>
    <a
      class="showMoreData"
      :href="biUrl"
      target="_blank"
      v-if="!pageInit && enableDrag"
    >
      MORE>>
    </a>

    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      :class="{ formStore: dataList.length <= 1 }"
    >
      <el-tab-pane
        v-for="(pane, paneIndex) in dataList"
        :key="'pane' + paneIndex"
        :name="pane.name"
      >
        <span slot="label" class="label_box">
          {{ pane.name }}概况
          <el-tooltip
            v-show="!enableDrag"
            effect="dark"
            :content="
              type === 'global'
                ? '您所管理的所有店铺的' + pane.name + '汇总数据'
                : 'GMV=实际发货金额-退货金额'
            "
            placement="right"
          >
            <div class="question_button">?</div>
          </el-tooltip>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
        <PageInit
          :loading="pageInit"
          :message="message"
          :code="code"
          class="init_box"
        >
          <div class="master-tab-content" v-show="width === 12">
            <div
              v-for="(column, columnIndex) in pane.tdList"
              :key="'column' + columnIndex"
              class="master-tab-content-item"
            >
              <div class="master-tab-content-item-title">
                {{ column.name }}
              </div>
              <div class="master-tab-content-item-completed">
                已完成 (¥)
                <div class="master-tab-content-item-completed-value">
                  {{ column.completed | getAmount(3) }}
                </div>

                <el-tooltip
                  effect="dark"
                  :content="'完成进度' + getRateNumber(column.currentProgress)"
                  placement="bottom"
                >
                  <div class="master-tab-content-item-completed-line">
                    <div
                      class="master-tab-content-item-completed-line-done"
                      :style="{ width: getRateNumber(column.currentProgress) }"
                    ></div>
                  </div>
                </el-tooltip>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">
                  目标金额 (¥)
                </div>
                <div class="master-tab-content-item-target-value">
                  {{ column.monthTarget | getAmount(3) }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">完成进度</div>
                <div class="master-tab-content-item-target-value">
                  {{ getRateNumber(column.currentProgress) | filterNull }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">较上期</div>
                <div
                  class="master-tab-content-item-target-value"
                  :class="[
                    'master-tab-content-item-target-value-' +
                      getType(column.compareLastTerm)
                  ]"
                >
                  {{ column.compareLastTerm | getRate }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">
                  较去年同期
                </div>
                <div
                  class="master-tab-content-item-target-value"
                  :class="[
                    'master-tab-content-item-target-value-' +
                      getType(column.compareLastYear)
                  ]"
                >
                  {{ column.compareLastYear | getRate }}
                </div>
              </div>
            </div>
          </div>

          <div class="small_style" v-show="[4, 8, 6].indexOf(width) > -1">
            <el-radio-group size="small" v-model="dimensionName">
              <el-radio-button label="MTD">MTD</el-radio-button>
              <el-radio-button label="QTD">QTD</el-radio-button>
              <el-radio-button label="YTD">YTD</el-radio-button>
            </el-radio-group>
            <div
              v-for="(column, columnIndex) in pane.tdList"
              :key="'radio' + columnIndex"
              class="master-tab-content-item"
              v-show="dimensionName === dimensionList[columnIndex]"
            >
              <div class="master-tab-content-item-completed">
                已完成 (¥)
                <div class="master-tab-content-item-completed-value">
                  {{ column.completed | getAmount(3) }}
                </div>

                <el-tooltip
                  effect="dark"
                  :content="'完成进度' + getRateNumber(column.currentProgress)"
                  placement="bottom"
                >
                  <div class="master-tab-content-item-completed-line">
                    <div
                      class="master-tab-content-item-completed-line-done"
                      :style="{ width: getRateNumber(column.currentProgress) }"
                    ></div>
                  </div>
                </el-tooltip>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">
                  目标金额 (¥)
                </div>
                <div class="master-tab-content-item-target-value">
                  {{ column.monthTarget | getAmount(3) }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">完成进度</div>
                <div class="master-tab-content-item-target-value">
                  {{ getRateNumber(column.currentProgress) | filterNull }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">较上期</div>
                <div
                  class="master-tab-content-item-target-value"
                  :class="[
                    'master-tab-content-item-target-value-' +
                      getType(column.compareLastTerm)
                  ]"
                >
                  {{ column.compareLastTerm | getRate }}
                </div>
              </div>
              <div class="master-tab-content-item-target">
                <div class="master-tab-content-item-target-name">
                  较去年同期
                </div>
                <div
                  class="master-tab-content-item-target-value"
                  :class="[
                    'master-tab-content-item-target-value-' +
                      getType(column.compareLastYear)
                  ]"
                >
                  {{ column.compareLastYear | getRate }}
                </div>
              </div>
            </div>
          </div>
        </PageInit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'dashboard-tabs',
  components: {
    PageInit: _ => import('~/components/page-init')
  },
  props: {
    params: {
      type: Object,
      default: () => ({
        type: 'global',
        enableDrag: false,
        width: 12
      })
    }
  },
  data() {
    return {
      dimensionName: 'MTD',
      hadleGmv: null,
      activeName: 'GMV',
      title: 'title',
      dataList: [
        {
          name: 'GMV',
          tdList: []
        }
      ],
      // this.type === 'global' ? [ {name: 'GMV', tdList: []}, {name: 'SLP', tdList: []}] : [{name: 'GMV', tdList: []}],
      pageInit: true,
      code: 0,
      message: '',
      dimensionList: ['MTD', 'QTD', 'YTD'],
      dataType: []
    }
  },
  mounted() {
    this.initTabs()
  },
  beforeDestroy() {},
  filters: {
    getAmount(s, type) {
      let numberType = false
      if (s && s < 0) {
        s = -s
        numberType = true
      }
      if (/[^0-9\.]/.test(s)) {
        // 金额浮点数过滤器
        return '--'
      }
      if (s === null || s === '' || s === undefined) {
        return '--'
      }
      s = s.toString().replace(/^(\d*)$/, '$1.')
      s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1')
      s = s.replace('.', ',')
      var re = /(\d)(\d{3},)/
      while (re.test(s)) {
        s = s.replace(re, '$1,$2')
      }
      s = s.replace(/,(\d\d)$/, '.$1')
      if (type == 0) {
        // 不带小数位(默认是有小数位)
        var a = s.split('.')
        if (a[1] == '00') {
          s = a[0]
        }
      }
      return numberType ? '-' + s : s
    },
    getRate(s) {
      // 百分比过滤器
      let result = '--'
      if (s !== null && s !== undefined) {
        result = parseInt(Math.abs(Number(s + '') * 100)) + '%'
      }
      return result
    },
    filterNull(s) {
      let result = '--'
      if (s && s !== '0' && s !== 0) {
        result = s
      }
      return result
    }
  },
  methods: {
    getRateNumber(s) {
      let result = '0'
      if (s !== null && s !== undefined) {
        const str = parseInt(Math.abs(Number(s + '') * 100)) + '%'
        result = s < 0 ? '-' + str : str + ''
      }
      return result
    },
    initTabs() {
      // 初始化
      this.dataList.forEach(item => {
        item.tdList = this.dimensionList.map(item => ({
          name: item
        }))
      })
      this.$nextTick(() => {
        this['get' + this.activeName]()
      })
    },
    getNowFormatDate() {
      // 获取昨天的年月日
      let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    getType(val) {
      // 计算数据是升是降
      let type = 2
      if (Number(val) > 0) {
        type = 1
      }
      if (Number(val) < 0) {
        type = 0
      }
      return type
    },
    switchData(key, proData, type) {
      let data = {}
      if (proData) {
        data = proData
      }
      // 数据结构转换器
      let transfer = {}
      switch (key) {
        case this.dimensionList[0]:
          transfer = {
            name: this.dimensionList[0],
            monthTarget: type ? data.month_aim_slp : data.monthAimGmv, // 目标
            completed: type ? data.mtdSlp : data.mtdGmv, // 完成金额
            currentProgress: type ? data.month_ach : data.monthAch, // 已完成度
            compareLastTerm: type ? data.lp_mtd_mom : data.lpMtdYoy, // 较上期
            compareLastYear: data.lyMtdYoy // 较去年同期
          }
          break
        case this.dimensionList[1]:
          transfer = {
            name: this.dimensionList[1],
            monthTarget: type ? data.qt_aim_slp : data.qtAimGmv, // 目标
            completed: type ? data.qtdSlp : data.qtdGmv, // 完成金额
            currentProgress: type ? data.qt_ach : data.qtAch, // 已完成度
            compareLastTerm: type ? data.lp_qtd_mom : data.lpQtdYoy, // 较上期
            compareLastYear: type ? data.ly_qtdYoy : data.lyQtdYoy // 较去年同期
          }
          break
        case this.dimensionList[2]:
          transfer = {
            name: this.dimensionList[2],
            monthTarget: type ? data.year_aim_slp : data.yearAimGmv, // 目标
            completed: type ? data.ytdSlp : data.ytdGmv, // 完成金额
            currentProgress: type ? data.year_ach : data.yearAch, // 已完成度
            compareLastTerm: type ? data.lpytdMom : data.lpYtdYoy, // 较上期
            compareLastYear: data.lyYtdYoy // 较去年同期
          }
          break
        default:
          break
      }
      return transfer
    },
    async getGMV() {
      try {
        let rossShopIds =
          this.type === 'global'
            ? this.bzCodeList
            : this.getBzCode(this.$route.params.storeId)
        const res = await this.$api.globalDashboard.getGmvData(
          {
            queryDate: this.getNowFormatDate(),
            rossShopIds
          },
          {
            needToast: false
          }
        )
        this.message = ''
        this.hadleGmv = res.code === '0' ? res.data : null
        this.dataList[0].tdList = this.dimensionList.map(item =>
          this.switchData(item, this.hadleGmv, 0)
        )
      } catch (error) {
        this.message = error.msg || error.message
      } finally {
        this.pageInit = false
      }
    },
    async getSLP() {
      try {
        const res = await this.$api.globalDashboard.getSlpDataFromBi(
          {
            queryDate: this.getNowFormatDate(),
            rossShopIds: this.bzCodeList
          },
          {
            needToast: false
          }
        )
        let data = null
        if (res.code === '0') {
          data = res.data
        }
        this.dataList[1].tdList = this.dimensionList.map(item =>
          this.switchData(item, data, 1)
        )
        this.message = ''
      } catch (error) {
        this.message = error.msg || error.message
      } finally {
        this.pageInit = false
      }
    },
    getBzCode(val) {
      let result = []
      let params = this.$store.state.STORE_LIST.filter(item => item.id == val)
      if (params && params.length > 0 && params[0].bzCode) {
        result = params[0].bzCode.split()
      }
      return result
    }
  },
  computed: {
    type() {
      const type = this.params.type
      return type || 'global'
    },
    enableDrag() {
      const enableDrag = this.params.enableDrag
      return enableDrag === undefined ? false : enableDrag
    },
    width() {
      const width = this.params.width
      return width || 12
    },
    biUrl() {
      // 跳转Bi
      const env = this.$constant.RUN_ENV.env
      return env
        ? env.toLowerCase() === 'prod'
          ? 'https://bi.baozun.com/prod'
          : 'https://bi.baozun.com/staging'
        : 'https://bi.baozun.com/staging'
    },
    bzCodeList() {
      const rossShopIds = []
      this.$store.state.STORE_LIST.forEach(item => {
        if (item.bzCode) {
          rossShopIds.push(item.bzCode)
        }
      })
      return rossShopIds
    }
  },
  watch: {
    activeName(v, old) {
      if (old !== '') {
        this['get' + v]()
      }
    },
    $route(to, from) {
      this.initTabs()
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
.master-tab {
  @include border-box;
  position: relative;
  background-color: #ffffff;
  /* margin-bottom: 16px !important; */
  .master-tab-extra {
    position: absolute;
    top: 22px;
    right: 32px;
    z-index: 1;
    font-size: 14px;
    color: #666666;
    a {
      color: #3366ff;
      text-decoration: underline;
    }
    .el-icon-time {
      text-align: center;
      font-size: 14px;
      vertical-align: unset;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  /deep/ .formStore {
    .el-tabs__active-bar {
      opacity: 0 !important;
    }
  }
  /deep/ .el-tabs {
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__nav {
        margin-top: 10px;
        margin-left: 32px !important;
        .el-tabs__item {
          height: 48px;
          .label_box {
            position: relative;
            height: 45px;
          }
          .question_button {
            position: absolute;
            right: 0px;
            top: 4px;
            width: 14px;
            height: 14px;
            text-align: center;
            line-height: 12px;
            font-size: 12px;
            color: #999999;
            border: 1px solid #999999;
            border-radius: 100%;
            font-weight: 500 !important;
            @include border-box;
            &:hover {
              color: #666666;
            }
          }
        }
      }
    }
    .init_box {
      min-height: 304px !important;
      height: 304px !important;
    }
    .el-tabs__content {
      .master-tab-content {
        @include flex;
        @include border-box;
        .top-content {
          border: 0 none !important;
        }
        &-item:first-child {
          padding: 0 32px 0 32px;
          border-style: none !important;
        }
        &-item {
          flex: 1;
          position: relative;
          border: 1px none #e8e8e8;
          border-style: none none none solid;
          align-items: center;
          padding: 0 32px 0 32px;
          margin-top: 65px;
          line-height: 30px;
          &-title {
            position: absolute;
            top: -40px;
            left: 32px;
            color: #333333;
            font-weight: bold;
            font-size: 16px;
          }
          &-completed {
            color: #666666;
            font-size: 14px;
            padding: 0 0 16px 0;
            margin-top: -10px;
            &-value {
              font-size: 22px;
              color: #333333;
              padding-top: 10px;
              padding-bottom: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &-line {
              height: 6px;
              background-color: #f0f6ff;
              overflow: hidden;
              cursor: pointer;
              &-done {
                max-width: 100% !important;
                height: 6px;
                background-color: #3366ff;
              }
            }
          }
          &-target {
            @include flex;
            color: #666666;
            font-size: 14px;
            align-items: center;
            &-name {
              flex: 2;
            }
            &-value {
              flex: 3;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #333333;
            }
            &-value-0 {
              color: #4fa639;
              &::before {
                content: '↓';
                font-size: 15px;
                vertical-align: middle;
              }
            }
            &-value-1 {
              color: #f13869;
              &::before {
                content: '↑';
                font-size: 15px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .small_style {
        padding: 20px 32px;
        .el-radio-button__inner {
          font-size: 12px;
        }
        .is-active {
          .el-radio-button__inner {
            color: #3366ff;
            background-color: #f5f8ff;
            border-color: #3366ff;
          }
        }
        .master-tab-content-item {
          margin: 0;
          margin: 0;
          padding: 0;
          padding-top: 11px;
          border: 0 none;
        }
      }
    }
  }
  .showMoreData {
    position: absolute;
    z-index: 99;
    left: 110px;
    top: 24px;
    font-size: 12px;
    color: #3366ff;
  }
}
</style>
