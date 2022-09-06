<template>
  <div class="my-task-warpper">
    <filter-container
      :showInput="false"
      :showFilteMore="true"
      @reset-search="resetFilter()"
      :params="searchParams"
      hasExport
      :hasStore="hasStore"
    >
      <template slot="filter_main">
        <div class="filter-left">
          <el-radio-group v-model="activeName" size="small" v-if="!hasStore">
            <el-radio-button
              v-for="item in tabConfig"
              :key="item.name"
              :label="item.name"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <div class="filter-action">
          <el-checkbox
            v-model="searchParams.isHideFile"
            true-label="1"
            false-label="0"
            >隐藏已归档</el-checkbox
          >
          <el-select
            v-model="searchParams.sort"
            v-show="viewType == 'task'"
            style="width: 130px; margin-right: 16px;"
          >
            <el-option value="0" label="默认排序" />
            <el-option value="1" label="创建时间倒序" />
          </el-select>
          <el-select
            v-if="type != 'global'"
            v-model="viewType"
            style="width: 108px;"
          >
            <el-option value="task" label="任务视图" />
            <el-option value="process" label="流程视图" />
            <el-option value="calendar" label="日历视图" />
          </el-select>
        </div>
      </template>
      <template slot="filter-more">
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">关键词</div>
          <el-input v-model="keyWord" @change="filterByKeyword" clearable />
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">发起人</div>
          <el-select
            v-page="renderPeopleList"
            filterable
            size="small"
            :disabled="activeName == 1"
            v-model="searchParams.creator"
            clearable
            remote
            :remote-method="remoteMethod"
            @clear="remoteMethod()"
          >
            <el-option
              v-for="(item, index) in persons"
              :key="Math.random() + '' + index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12" v-if="type !== 'global'">
          <div class="label">标签</div>
          <el-select
            v-model="tags"
            placeholder="全部"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="option in tagList"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">状态</div>
          <el-select
            v-model="searchParams.status"
            placeholder="全部"
            clearable
            filterable
          >
            <el-option
              v-for="(option, index) in statusList"
              :key="Math.random() + '' + index"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12">
          <div class="label">{{viewType == 'calendar' && type != 'global'  ? '创建' : '截止'}}时间</div>
          <el-date-picker
            prefix-icon="font-icon icon-time"
            v-model="from2toTime"
            type="datetimerange"
            size="small"
            style="height:34px;width: 100%"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
            >
          </el-date-picker>
        </el-col>
        <el-col :lg="8" :md="8" :xm="12" v-if="type === 'global'"> </el-col>
      </template>
    </filter-container>
    <taskList
      :has-store="hasStore"
      :params="searchParams"
      v-if="viewType == 'task' || type == 'global'"
      :type="type"
    />
    <progressList
      :has-store="hasStore"
      v-if="viewType == 'process' && type != 'global'"
      :params="searchParams"
    />
    <gantt-view :has-store="hasStore" :params="searchParams" v-if="viewType == 'calendar' && type != 'global'"/>
  </div>
</template>
<script>
import settingCache from '~/utils/SettingCache'
import { getPersons } from '~/mixins'
let loginUser = Vue.prototype.$cache.get('USER_INFO', {})
export default {
  props: {
    hasStore: {
      default: _ => false,
      type: Boolean
    },
    type: {
      default: _ => 'global',
      type: String
    }
  },
  components: {
    filterContainer: _ => import('~/components/filter'),
    taskList: _ => import('~/components/task-list'),
    progressList: _ => import('~/components/process-list'),
    ganttView: _ => import('~/components/gantt-view')
  },
  mixins: [getPersons],
  data() {
    var activeName = this.$route.query.myTab || 0
    var viewType = settingCache.getItem('myTask/viewType', 'task')
    var inStoreCalendar = viewType === 'calendar' && this.type != 'global'
    let {s, e} = this.setTimeRange()
    return {
      viewType,
      activeName,
      tabConfig: [
        { label: '我执行的', name: '0' },
        { label: '我创建的', name: '1' },
        { label: '抄送给我的', name: '2' }
      ],
      personIndex: -10,
      tagList: [],
      statusList: this.$constant.TASK_STATUS,
      persons: [],
      tags: [],
      tagsOption: '',
      from2toTime: inStoreCalendar ? [new Date(s), new Date(e)] : '',
      keyWord: '',
      searchParams: {
        keyWord: '',
        tags: '',
        status: '',
        fromTime: inStoreCalendar ? this.$helper.formatTime(s) : '',
        toTime: inStoreCalendar ? this.$helper.formatTime(e) : '',
        creator: activeName == 1 ? loginUser.id : '',
        searchType: activeName,
        isHideFile: '1',
        sort: '0'
      }
    }
  },
  watch: {
    from2toTime(val) {
      this.searchParams = {
        ...this.searchParams,
        fromTime: this.$helper.formatTime(val ? val[0] : ''),
        toTime: this.$helper.formatTime(val ? val[1] : '')
      }
    },
    tags(val) {
      this.searchParams = {
        ...this.searchParams,
        tags: (val || []).join(',')
      }
    },
    viewType(val) {
      settingCache.setItem('myTask/viewType', val)
      this.toggleStatusList()
      this.resetFilter(true, val)
      this.$router.push({
        path: this.$route.path,
        query: {
          myTab: this.$route.query.myTab || 0,
          taskTab: this.$route.query.taskTab,
          view: val
        }
      })
    },
    activeName(val) {
      const { path, query } = this.$route
      let searchType = val
      this.searchParams = {
        ...this.searchParams,
        creator: val == 1 ? loginUser.id : this.searchParams.creator,
        searchType
      }
      this.resetPeopleList()
      this.$router.push({
        path,
        query:
          this.type == 'global'
            ? {
                myTab: val
              }
            : {
                myTab: val,
                taskTab: this.$route.query.taskTab,
                view: this.viewType
              }
      })
    }
  },
  directives: {
    page: {
      bind(el, binding, vnode) {
        const selectWrap = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        function scrollHandler() {
          if (vnode.context.$persons && vnode.context.$persons.length <= 100) {
            return
          }
          const arriveBottom =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (arriveBottom) {
            binding.value(10)
            this.scrollTop -= 10
          }
          if (this.scrollTop < 10) {
            binding.value(-10)
            this.scrollTop += 10
          }
        }
        selectWrap.addEventListener(
          'scroll',
          Vue.prototype.$helper.throttle(scrollHandler)
        )
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getPersons()
      // 缓存一份全部人员的列表
      this.$$persons = this.$persons
      this.renderPeopleList()
      await this.queryTags()
      this.activeName = this.$route.query.myTab || '0'
    },
    async queryTags() {
      if (this.type === 'global') return
      try {
        const { get } = this.$api.tag
        const params = {
          groupId: this.groupId
        }
        const result = await get(null, { headers: { ...params } })

        this.tagList = result.data
      } catch (error) {
        console.log(error)
      }
    },
    filterByKeyword(v) {
      /*处理输入筛选*/
      this.searchParams.keyWord = v
    },
    resetFilter(fromViewTypeToggle, view) {
      let {s, e} = this.setTimeRange()
      let inStoreCalendar = fromViewTypeToggle && view === 'calendar' && this.type != 'global'
      /*处理重置筛选*/
      this.keyWord = ''
      this.from2toTime = inStoreCalendar ? [new Date(s), new Date(e)] : ''
      this.tags = []
      this.searchParams = Object.assign({
        keyWord: '',
        tags: '',
        status: '',
        creator: this.activeName == 1 ? this.searchParams.creator : '',
        searchType: this.activeName,
        isHideFile: this.searchParams.isHideFile,
        sort: this.searchParams.sort
      }, {
        fromTime: inStoreCalendar ? this.$helper.formatTime(s) : '',
        toTime: inStoreCalendar ? this.$helper.formatTime(e) : ''
      })
    },
    setTimeRange() {
      let s = new Date().getTime() - 45 * 24 * 3600 * 1000
      let e = new Date().getTime() + 44 * 24 * 3600 * 1000
      return {s, e}
    },
    toggleStatusList() {
      if (this.viewType == 'task') {
        this.statusList = this.$constant.TASK_STATUS
      } else {
        this.statusList = this.$constant.FLOW_STATUS.filter(
          ({ id }) => id != 0 && id != 5
        )
      }
    },
    renderPeopleList(size) {
      if (this.$persons.length <= 100) {
        this.persons = this.$persons.map(p => ({ ...p }))
        return
      }
      this.personIndex += size || 10
      this.personIndex = this.personIndex <= 0 ? 0 : this.personIndex
      var persons = this.$persons.slice(this.personIndex, this.personIndex + 10)

      if (persons.length < 10 && persons.length > 0) {
        persons = persons.concat(this.$persons.slice(0, 10 - persons.length))
      } else if (persons.length <= 0) {
        this.personIndex -= 10
        persons = this.$persons.slice(this.personIndex, this.personIndex + 10)
        persons = persons.concat(this.$persons.slice(0, 10 - persons.length))
      }
      if (this.activeName == 1) {
        /*我创建的*/
        if (persons.findIndex(p => p.id == loginUser.id) < 0) {
          persons.unshift({
            id: loginUser.id,
            name: loginUser.realName || loginUser.userName
          })
        }
      } else {
        if (
          this.searchParams.creator.length > 0 &&
          persons.findIndex(p => p.id == this.searchParams.creator) < 0
        ) {
          let people = this.$$persons.find(
            p => p.id == this.searchParams.creator
          )
          persons.unshift(people)
        }
      }
      this.persons = persons
    },
    remoteMethod(query) {
      let persons
      if (typeof query === 'string' && query.length > 0) {
        persons = this.$$persons.filter(p => p.name.indexOf(query) > -1)
      }
      this.resetPeopleList(persons)
    },
    resetPeopleList(persons, page) {
      persons = Array.isArray(persons) ? persons : []
      persons = persons.length > 0 ? persons : this.$$persons
      this.$persons = persons
      this.personIndex = page || -10
      this.renderPeopleList()
    }
  },
  computed: {
    groupId() {
      const { storeId } = this.$route.params
      return !storeId ? this.storeId : storeId
    }
  }
}
</script>
<style lang="scss" scoped>
.my-task-warpper {
  // display: flex;
  // flex-direction: column;
  // height: 100%;
  .filter-left {
    display: flex;
    align-items: center;
    padding-left: 32px;
  }
  .filter-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    height: 57px;
    padding-right: 16px;
    .el-checkbox {
      margin-right: 16px;
      & /deep/ .el-checkbox__label {
        color: #333 !important;
      }
    }
  }
  .page-init {
    flex: 1;
    height: auto;
  }
  .task-list {
    height: 100%;
    overflow-y: auto;
  }
}
/deep/ .el-radio-button:first-child .el-radio-button__inner,
/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 2px 0 0 2px;
}
.el-radio-button:last-child .el-radio-button__inner .el-col-placeholder {
  text-indent: -90999px;
}
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: rgba(51, 102, 255, 0.1);
  color: #3366ff;
}
/deep/ .el-range-editor--small .el-range-separator {
  height: auto;
  width: auto;
}
</style>
