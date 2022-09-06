<template>
  <div class="filter-operate">
    <div class="keywords filter-item">
      <span>关键词</span>
      <el-input
        v-model="searchWords"
        placeholder="输入关键词搜索"
        class="input-item"
        @change="updateHandler"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="task-status filter-item">
      <span>流程状态</span>
      <el-select v-model="status" class="input-item" @change="updateHandler">
        <el-option
          v-for="{ id, name } in $constant.FLOW_STATUS"
          :key="id"
          :label="name"
          :value="id"
        ></el-option>
      </el-select>
    </div>
    <template v-if="spread">
      <div class="execute-man filter-item">
        <span>执行者</span>
        <el-select v-model="executeMan" class="input-item">
          <el-option
            v-for="(item, i) in executeManOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="create-man filter-item">
        <span>创建者</span>
        <el-select v-model="createMan" class="input-item">
          <el-option
            v-for="(item, i) in createManOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="join-Man filter-item">
        <span>参与者</span>
        <el-select v-model="joinMan" class="input-item">
          <el-option
            v-for="(item, i) in joinManOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="finish-time filter-item">
        <span>完成时间</span>
        <el-date-picker
          size="small"
          format="yyyy-MM-dd HH:mm"
          v-model="finishTime"
          style="width:100%"
          type="datetimerange"
          range-separator="至"
          start-placeholder="不限"
          end-placeholder="不限"
        ></el-date-picker>
      </div>
      <div class="finish-time filter-item">
        <span>创建时间</span>
        <el-date-picker
          size="small"
          format="yyyy-MM-dd HH:mm"
          v-model="createTime"
          style="width:100%"
          type="datetimerange"
          range-separator="至"
          start-placeholder="不限"
          end-placeholder="不限"
        ></el-date-picker>
      </div>
      <div class="finish-time filter-item">
        <span>开始时间</span>
        <el-date-picker
          size="small"
          format="yyyy-MM-dd HH:mm"
          v-model="startTime"
          style="width:100%"
          type="datetimerange"
          range-separator="至"
          start-placeholder="不限"
          end-placeholder="不限"
        ></el-date-picker>
      </div>
      <div class="finish-time filter-item">
        <span>到期时间</span>
        <el-date-picker
          size="small"
          format="yyyy-MM-dd HH:mm"
          v-model="endTime"
          style="width:100%"
          type="datetimerange"
          range-separator="至"
          start-placeholder="不限"
          end-placeholder="不限"
        ></el-date-picker>
      </div>
      <div class="finish-time filter-item">
        <span>最后更新时间</span>
        <el-date-picker
          size="small"
          format="yyyy-MM-dd HH:mm"
          v-model="lastModifyTime"
          style="width:100%"
          type="datetimerange"
          range-separator="至"
          start-placeholder="不限"
          end-placeholder="不限"
        ></el-date-picker>
      </div>
    </template>
    <div class="operate-btns">
      <span
        class="el-dropdown-link more-btn"
        @click="spreatMoreHandler"
        v-if="false"
      >
        {{ spread ? '收起' : '展开' }}更多
        <i
          class="el-icon--right"
          :class="spread ? `el-icon-arrow-up` : `el-icon-arrow-down`"
        ></i>
      </span>
      <el-button size="mini" @click="resetHandler">重置</el-button>
      <el-button type="primary" size="mini" @click="searchHandler"
        >搜索</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchWords: '',
      status: -1,
      executeMan: 0,
      createMan: '我',
      joinMan: '',
      finishTime: [],
      createTime: [],
      startTime: [],
      endTime: [],
      lastModifyTime: [],
      joinManOptions: [{}],
      executeManOptions: [{}],
      createManOptions: [{}],
      spread: false
    }
  },
  props: {
    value: {
      string: Object,
      default: {}
    }
  },
  mounted() {
    this.searchWords = this.value.searchWords
    this.status = this.value.status
  },
  methods: {
    updateHandler() {
      this.$emit('input', {
        searchWords: this.searchWords,
        status: this.status,
        executeMan: this.executeMan,
        createMan: this.createMan,
        joinMan: this.joinMan,
        finishTime: this.finishTime,
        createTime: this.createTime,
        startTime: this.startTime,
        endTime: this.endTime,
        lastModifyTime: this.lastModifyTime
      })
    },
    spreatMoreHandler() {
      this.spread = !this.spread
    },
    resetHandler() {
      this.searchWords = ''
      this.status = -1
      this.finishTime = []
      this.createTime = []
      this.startTime = []
      this.endTime = []
      this.lastModifyTime = []
      this.updateHandler()
    },
    searchHandler() {
      this.$emit('search')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-operate {
  /deep/ {
    .el-range-separator {
      width: auto;
      height: auto;
    }
    .el-icon-time {
      display: none;
    }
    .el-date-editor {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.filter-operate {
  min-width: 800px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 24px 16px 6px 28px;
  // justify-content: space-between;
  background: white;
  margin-bottom: 8px;
  position: relative;
  color: #333;
  flex-wrap: wrap;
  > .filter-item {
    width: 246px;
    margin: 0 12px 18px;
    > span {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
      color: #666;
    }
  }
}
.input-item {
  width: 100%;
  height: 32px;
}
.more-btn {
  font-size: 12px;
  margin-right: 14px;
  cursor: pointer;
}

.operate-btns {
  position: absolute;
  right: 32px;
  bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media screen and (min-width: 1024px) and (max-width: 1440px) {
  .filter-item {
    width: 30% !important;
  }
}
@media screen and (min-width: 1440px) {
  .filter-item {
    width: 22% !important;
  }
}
</style>
