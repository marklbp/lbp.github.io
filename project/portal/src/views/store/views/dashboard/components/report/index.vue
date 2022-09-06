<template>
  <div class="shop-report">
    <div class="title">
      <h4>
        店铺报表
      </h4>
      <a :href="biUrl" style="font-size: 14px;">全部 ></a>
    </div>
    <page-init :loading="loading" :message="message">
      <ul class="report-list">
        <li
          v-for="(item, i) in knowledgeList"
          :key="i"
          @click="downReport(item)"
          class="ellipsis-end-line"
        >
          &nbsp;&nbsp;<i class="font-icon excel icon-style text-style"></i>
          <span class="text-style">{{ item.name + '.xlsx' }}</span>
          <i class="el-icon-download icon right icon-style"></i>
        </li>
      </ul>
    </page-init>
  </div>
</template>
<script>
export default {
  name: 'shopReport',
  components: {
    pageInit: _ => import('~/components/page-init')
  },
  data() {
    return {
      knowledgeList: [],
      loading: true,
      message: ''
    }
  },
  props: {
    /* limit: {
      type: Number,
      default: 3
    } */
  },
  mounted() {
    this.dashboardKnowledge()
  },
  beforeDestroy() {},
  methods: {
    timeHandle() {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? `0${month}` : month
      let day = date.getDate()
      day = day < 10 ? `0${day}` : day
      return `${year}-${month}-${day}`
    },
    async dashboardKnowledge() {
      try {
        this.knowledgeList = [
          {
            name: '今日报表',
            title: 'daily'
          },
          {
            name: '本周报表',
            title: 'weekly'
          },
          {
            name: '本月报表',
            title: 'monthly'
          }
        ]
      } catch (err) {
        this.message = err.msg || err.message
      } finally {
        this.loading = false
      }
    },
    async downReport(item) {
      try {
        const { storeId } = this.$route.params
        const httpConfig = {
          headers: {
            groupId: storeId
          }
        }
        const promise = await this.$api.globalDashboard.downRecentDate(
          {
            queryDate: this.timeHandle(),
            type: item.title
          },
          {
            ...httpConfig,
            responseType: 'blob'
          }
        )
        if (!promise.data.size) {
          this.$message('报表为空,无法下载')
          return
        }
        this.$helper.downloadByBinary(
          promise.data,
          `${item.name}.xls`,
          'application/vnd.ms-excel;charset=utf-8'
        )
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  },
  computed: {
    biUrl() {
      const env = this.$constant.RUN_ENV.env
      return env
        ? env.toLowerCase() === 'prod'
          ? 'https://bi.baozun.com/prod'
          : 'https://bi.baozun.com/staging'
        : 'https://bi.baozun.com/staging'
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
.shop-report {
  @include border-box;
  background: white;
  color: #333;
  .page-init {
    min-height: 174px !important;
  }
  /deep/ {
    .done {
      min-height: 0 !important;
    }
    .page-init {
      height: 174px;
      overflow: hidden;
      min-height: 0px;
    }
    .component-empty {
      min-height: 100%;
    }
  }
  .title {
    @include flex;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    padding: 0 24px 0 32px;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    > h4 {
      margin: 0;
    }
    > span {
      cursor: pointer;
      color: #3366ff;
    }
  }
  .report-list {
    font-size: 14px;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 0 24px 0 32px;
    overflow: hidden;
    > li {
      padding: 0;
      margin: 0;
      cursor: pointer;
      line-height: 34px;
      vertical-align: middle;
      &:first-child {
        margin-top: 10px;
      }
      &:last-child {
        margin-bottom: 16px;
      }
      .text-style {
        vertical-align: middle;
      }
      .icon {
        display: none;
        margin: 8px 6px 0 0;
      }
      .icon-style {
        font-size: 18px;
        color: #999;
      }
      .right {
        float: right;
      }
      &:hover {
        background: #f5f5f5;
        > .icon {
          display: block;
        }
      }
    }
  }
}
</style>
