<template>
  <page-init
    :loading="pageInit"
    :code="code"
    :message="message"
    ref="page_inner"
  >
    <router-back class="router-back" :text="flowName">
      <span class="detail-endtime" v-if="flowDetail.endTime">{{
        flowDetail.endTime
      }}</span>
      <a
        v-if="$route.params.taskDefinitionKey"
        class="btn-edit-template"
        href="javascript:void(0)"
        @click="backFlowDetail"
      >
        <i class="font-icon catalog"></i>流程详情</a
      >
    </router-back>
    <div class="flow_content">
      <div class="graph">
        <div class="location">
          当前位置：
          <span v-for="(item, i) in path" :key="i" @click="clickLocation(i)">
            <i v-if="i !== 0">&gt;</i>
            {{ item }}
          </span>
        </div>
        <flow-display
          :xml="xml"
          :message="message"
          :persons="persons"
          ref="graphContainer"
          @dblclick="dblClickFlowHandler"
          @click="clickFlowHandler"
        ></flow-display>
      </div>
      <div class="flow_content_tabs">
        <!-- detailCompo -->
        <task-tabs
          :all="detail.allTasks"
          :mine="detail.iexecuteTasks"
          ref="taskTabs"
        />
      </div>
    </div>
    <side-slide-pane v-model="detailPaneCollapse">
      <detail-pane
        ref="detailPane"
        @update="updateDetail"
        :persons="persons"
        :type="paneType"
        :detail="detail"
        :flowDetail="flowDetail"
        :taskDefinitionKey="taskDefinitionKey"
        :is-sub="isSub"
        :breads="breads"
        :privileges="privileges"
      />
    </side-slide-pane>
  </page-init>
</template>
<script>
import detailMixin from './detail.mixin'
import flowHelper from '~/utils/flow.js'
export default {
  name: 'flow-detail',
  mixins: [detailMixin],
  components: {
    'router-back': _ => import('~/components/router-back'),
    'flow-display': _ => import('~/components/flow-display'),
    'side-slide-pane': _ => import('~/components/side-slide-pane'),
    'task-tabs': _ => import('./task-tabs')
  },
  data() {
    this.flowDetail = ''
    return {
      detailPaneCollapse: false,
      path: []
    }
  },
  provide() {
    return {
      detailCompo: this
    }
  },
  methods: {
    fetchList() {
      const activeName = this.$refs.taskTabs.activeName
      this.$refs.taskTabs.fetchList(activeName == 'task' ? 1 : 0)
    },
    clickLocation(ind) {
      if (ind < this.path.length - 1) {
        this.xml = this.preParseXML(JSON.stringify(this.flowJson))
        this.path.splice(1, 1)
      }
    },
    dblClickFlowHandler(cell) {
      if (/task|condition/.test(cell.flow)) {
        this.toTaskDetail(cell)
      } else if (/flow/.test(cell.flow)) {
        this.showFlowDetail(cell)
      } else if (/robot/.test(cell.flow)) {
        this.showRobotDetai(cell)
      }
    },
    showFlowDetail(cell) {
      this.paneType = 3
      this.getNodeDetail(cell.id)
    },
    showRobotDetai(cell) {
      this.paneType = 4
      this.getNodeDetail(cell.id)
    },
    toTaskDetail(cell) {
      const { storeId, rootProcessExec } = this.$route.params
      this.$router.push(
        `/${storeId}/process-task-detail/${rootProcessExec}/${cell.id}`
      )
    },
    clickFlowHandler({ event, cell }) {
      if (/subflow-btn/.test(event.target.className)) {
        this.showSubFlow(cell.id)
        const { label } = this.flowJson.tasks.find(
          val => val.id === cell.id
        ).attrs
        this.path = [...this.path, label]
      }
    },
    showSubFlow(id) {
      const target = this.flowJson.tasks.find(
        val => parseInt(val.id, 10) === parseInt(id, 10)
      )
      this.xml = this.preParseXML(JSON.stringify(target.subFlow.flowTree))
    },
    preParseXML: flowHelper.preParseXML,
    /*返回流程详情*/
    backFlowDetail() {
      this.$router.replace(
        `/${this.$route.params.storeId}/flow-detail/${this.$route.params.rootProcessExec}`
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.page-init {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.btn-edit-template {
  margin-left: 22px;
  color: $--color-primary;
  font-size: 14px;
  .font-icon {
    margin-top: 0;
    margin-right: 4px;
    font-size: 14px;
    color: $--color-primary;
  }
}
.location {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  line-height: 56px;
  background: white;
  font-size: 14px;
  color: #333;
  padding: 0 32px;
  > span {
    color: #333;
    &:hover {
      color: #3366ff;
    }
    cursor: pointer;
  }
  i {
    color: #333;
    cursor: auto;
    font-style: normal;
  }
}
.flow_content {
  width: 100%;
  height: 100%;
  display: flex;
  .graph {
    position: relative;
    padding-top: 56px;
    flex: 1;
    width: 0;
    background-color: #fff;
  }
  .flow-container {
    height: 100%;
  }
  &_tabs {
    margin-left: 16px;
    width: 320px;
    height: 100%;
  }
}
.detail-endtime {
  color: #333333;
  font-size: 14px;
  padding-left: 16px;
}
</style>
