<template>
  <div class="page">
    <router-back text="已归档任务" />
    <filter-container
      @input-search="searchByName"
      :showFilteMore="false"
      @reset-search="resetField"
    >
      <!-- <template slot="filter-more">
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">状态</div>
          <el-select v-model="searchForm.status">
            <el-option label="全部" value="-1" />
            <el-option
              v-for="{ id, name } in taskStatusOptions"
              :label="name"
              :value="id"
              :key="id"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">优先级</div>
          <el-select v-model="searchForm.prioritie">
            <el-option
              v-for="{ id, name } in priorities"
              :label="name"
              :value="id"
              :key="id"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">是否为子任务</div>
          <el-select v-model="searchForm.isSub">
            <el-option
              v-for="{ id, name } in hasSonOptions"
              :label="name"
              :value="id"
              :key="id"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">参与者</div>
          <el-select
            v-model="searchForm.player"
            style="width:100%;height:32px;"
          >
            <el-option
              v-for="(item, i) in joinManOptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">截至时间</div>
          <el-date-picker
            size="small"
            format="yyyy-MM-dd HH:mm"
            v-model="searchForm.finishTime"
            style="width:100%"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="el-col-placeholder">placeholder</div>
        </el-col>
      </template>-->
    </filter-container>
    <portal-table
      module-name="onFileList"
      api-name="getOnFileList"
      :headers="headers"
      :filter="searchForm"
      :loading="loading1"
      :keys="keys"
      :refresh="refresh1"
      @loading="handlerLoading1"
    >
      <el-table-column
        prop="taskName"
        label="名称"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span
            class="el-button el-button--text"
            type="text"
            @click="jumpUrl(scope.row)"
          >
            {{ scope.row.label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="执行者">
        <template>
          <span>系统归档</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" />
      <el-table-column prop="filedTime" label="归档时间">
        <template slot-scope="scope">
          <span>{{ scope.row.filedTime | formatTime('y-M-d h:m') }}</span>
        </template>
      </el-table-column>
    </portal-table>
  </div>
</template>

<script>
import routerBack from '~/components/router-back'
import portalTable from '~/components/table'
import filterContainer from '~/components/filter'

const hasSonOptions = [
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: '仅显示子任务'
  },
  {
    id: 2,
    name: '仅显示父任务'
  }
]
// const initForm = {
//   name: '',
//   status: 0,
//   prioritie: 0,
//   isSub: '',
//   player: ''
// }
export default {
  name: 'place-on-file',
  components: {
    routerBack,
    portalTable,
    filterContainer
  },
  // props: {},
  data() {
    const groupId = this.$route.params.storeId
    return {
      hasSonOptions,
      joinManOptions: [],
      categoryOptions: [],
      searchForm: {
        keyword: ''
      },
      groupId,
      headers: { groupId },
      loading1: false,
      refresh1: false,
      keys: { records: 'records', total: 'totalCount' }
    }
  },
  // created() {},
  mounted() {},
  methods: {
    searchByName(val) {
      this.searchForm.keyword = val
    },
    resetField() {
      this.searchForm = {
        ...initForm
      }
    },
    jumpUrl(item) {
      console.log(item)
      let url
      const {
        taskDefinitionKey,
        rootProcessExec,
        processExecId,
        instanceTag,
        subTaskType
      } = item
      if (instanceTag == 1 || (instanceTag == 3 && subTaskType == 1)) {
        // 独立任务和独立任务的子任务
        url = `/${this.groupId}/task-detail/${processExecId}`
      } else if (instanceTag == 2 || instanceTag == 4) {
        // 流程任务
        url = `/${
          this.groupId
        }/process-task-detail/${rootProcessExec}/${taskDefinitionKey}`
      } else if (instanceTag == 3 && subTaskType == 2) {
        // 流程节点的子任务
        url = `/${
          this.groupId
        }/process-task-detail/${rootProcessExec}/${taskDefinitionKey}/${processExecId}`
      } else if (instanceTag === '0') {
        // 流程
        url = `/${this.groupId}/process-task-detail/${rootProcessExec}`
      }
      this.$router.push(url)
    },
    handlerLoading1(v) {
      if (v == 0) {
        this.loading1 = true
      } else {
        this.loading1 = false
        this.refresh1 = false
      }
    },
    statusFormat(row, column, cellValue, index) {
      // const resultItem = this.taskStatusOptions.find(item => {
      //   return item.id == row.status
      // })
      // return resultItem.name
      return '已归档'
    }
  },
  computed: {
    taskStatusOptions() {
      return this.$constant.TASK_STATUS
    },
    priorities() {
      return this.$constant.PRIORITIES
    }
  }
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.el-button {
  padding: 0;
}
.el-col {
  margin-bottom: 10px;
}
/deep/ .el-table__header-wrapper {
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid #ebeef5;
  background-color: #fafafa;
}
</style>
