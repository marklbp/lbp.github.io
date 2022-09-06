<template>
  <page-init
    :loading="loading"
    :message="message"
    :code="code"
    :iconSize="['50%', 'auto']"
  >
    <el-timeline class="log-wrap" :reverse="false">
      <el-timeline-item
        v-for="(item, i) in logList"
        :key="i"
        :timestamp="item.time + ''"
        class="log-item"
        :hide-timestamp="true"
      >
        <p class="time">
          {{ item.createTime | formatTime('y-M-d h:m:s') }}
        </p>
        <template v-if="layoutType(item.operationType) === 1">
          <p class="target">{{ item.realname }} 修改了 {{ item.typeName }}</p>
          <modify-content :content="item.content" :type="item.operationType" />
        </template>
        <template v-else-if="layoutType(item.operationType) === 2">
          <p class="target">{{ item.realname }} {{ item.content }}</p>
        </template>
      </el-timeline-item>
    </el-timeline>
  </page-init>
</template>
<script>
import modifyContent from './content'
export default {
  data() {
    return {
      logList: [],
      loading: true,
      message: '',
      code: 0,
      showContent: false
    }
  },
  props: {
    processInstanceId: {
      // 流程id/独立任务id
      type: [Number, String]
    },
    definitionKey: {
      // 流程子任务id
      type: [Number, String]
    }
  },
  methods: {
    fetchLogList() {
      const params = {
        processInstanceId: this.processInstanceId,
        definitionKey: this.definitionKey
      }
      return this.$api.taskDetail
        .taskLog(params, {
          headers: {
            groupid: this.$route.params.storeId
          }
        })
        .then(res => {
          this.logList = res.data || []
          this.message = !this.logList.length ? '暂无数据' : ''
        })
        .catch(err => {
          this.code = 500
          this.message = err.message || err.msg || '暂无数据'
        })
        .finally(() => {
          this.loading = false
        })
    },
    layoutType(type) {
      const typeAExg = /^(0|1|2|3|4|5|6|7|8|9|10|17)$/
      const typeBExg = /^(11|12|13|14|15|16)$/
      return typeAExg.test(type) ? 1 : typeBExg.test(type) ? 2 : false
    }
  },
  components: {
    pageInit: () => import('~/components/page-init'),
    modifyContent
  },
  created() {
    this.fetchLogList()
  },
  watch: {
    processInstanceId() {
      this.fetchLogList()
    },
    definitionKey() {
      this.fetchLogList()
    }
  }
}
</script>
<style lang="scss" scoped>
.log-wrap {
  padding: 0;
  padding-top: 14px;
}
.log-item {
  padding-bottom: 36px;
  padding-top: 1px;
  /deep/ {
    .el-timeline-item__tail {
      border-color: #d9d9d9;
      height: auto;
      top: 14px;
      bottom: 6px;
      border-width: 1px;
    }
    .el-timeline-item__node {
      background: #d9d9d9;
    }
    .el-timeline-item__node--normal {
      width: 8px;
      left: 0px;
      height: 8px;
    }
    .el-timeline-item__wrapper {
      top: 0;
    }
  }
}
.time {
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #333;
  margin-top: -4px;
}
.target {
  @extend .time;
  margin: 8px 0;
}
</style>
