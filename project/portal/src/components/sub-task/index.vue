<template>
  <div>
    <a
      v-for="t in tasks"
      href="javascript:void(0)"
      :class="{
        ['task ' + (t.status == 2 ? 'task-done' : '')]: true,
        finished: Number(t.status) === 2,
        pause: Number(t.status) === 3,
        delay: t.endTime && t.endTime < window.portalTime,
        danger: false,
        cancel: Number(t.status) === 4
      }"
      :key="t.id"
      @click="go(t.processInstanceId || t.dataCloneId)"
    >
      <div class="left">
        <div class="label" :class="{ 'label-cancel': Number(t.status) === 4 }">
          {{ t.label }}
        </div>
        <div class="time" v-if="t.endTime || t.startTime">
          {{ t.startTime | formatTime('y-M-d') }} 至
          {{ t.endTime | formatTime('y-M-d') }}
        </div>
        <!-- <div class="time">{{ $helper.formatTime(t.endTime) }}</div> -->
        <peoples-select :edit="false" v-model="t.assignee" />
      </div>
      <div class="right">
        <span class="status-bar" :class="statusClass(t.status)">
          {{ statusText(t.status) }}
        </span>
        <!-- <el-dropdown
          v-if="
            (t.status != null || independency) &&
              t.status != 2 &&
              t.processInstanceId
          "
          @command="updateStatus"
        >
          <div class="circle"></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="t.status != 0 && t.status != 1"
              :command="'0,' + t.processInstanceId"
              >待处理</el-dropdown-item
            >
            <el-dropdown-item
              v-if="t.status != 1"
              :command="'1,' + t.processInstanceId"
              >进行中</el-dropdown-item
            >
            <el-dropdown-item
              v-if="t.status != 2"
              :command="'2,' + t.processInstanceId"
              >已完成</el-dropdown-item
            >
            <el-dropdown-item
              v-if="t.status != 3"
              :command="'3,' + t.processInstanceId"
              >已暂停</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>-->
        <!-- <div class="circle status-done" v-if="t.status == 2"></div> -->
        <!-- <div class="more"></div> -->
      </div>
    </a>
    <span v-if="edit" class="btn-add" @click="add">+添加子任务</span>
    <el-dialog
      title="添加子任务"
      top="5%"
      v-if="dialog"
      :visible.sync="dialog"
      width="650px"
      ref="dialog"
      :before-close="confirm"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item size="small" label="名称" prop="label">
              <el-input v-model="form.label" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人" prop="assignee">
              <el-select
                style="width: 100%;"
                filterable
                size="small"
                v-model="assigneeIds"
                ref="elselect"
                popper-class="filter-prop-popper"
              >
                <el-option
                  v-for="(item, index) in persons"
                  :key="'opratePerson' + index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item size="small" label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择日期"
                style="width:100%;"
                default-time="00:00:00"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="抄送人" prop="copyPerson">
              <el-select
                style="width: 100%;"
                filterable
                multiple
                size="small"
                v-model="copyPersonIds"
                ref="elselect"
                popper-class="filter-prop-popper"
              >
                <el-option
                  v-for="(item, index) in persons"
                  :key="'opratePersont' + index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item size="small" label="截止时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择日期"
                style="width:100%;"
                default-time="23:59:59"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="优先级" prop="priority">
              <el-select
                v-model="form.priority"
                style="width:100%;"
                placeholder="请选择"
              >
                <el-option
                  v-for="({ name, id }, i) in $constant.PRIORITIES"
                  :key="i + Math.random()"
                  :label="name"
                  :value="id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" v-if="showRemindTime">
          <el-col :span="12">
            <el-form-item
              size="small"
              label="自定义提醒"
              prop="remindTime"
              class="remindTime"
            >
              <el-date-picker
                v-model="form.remindTime"
                type="datetime"
                placeholder="选择时间"
                style="width:100%;"
                default-time="00:00:00"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12"></el-col> -->
        </el-row>
        <el-form-item size="small" label="描述" prop="description">
          <rich-text
            v-model="form.description"
            show-word-limit
            class="sub-rich-text"
            :config="{
              items: [
                'fontname',
                'fontsize',
                'forecolor',
                'hilitecolor',
                'emoticons',
                'bold',
                'italic',
                'underline',
                'justifyleft',
                'justifycenter',
                'justifyright',
                'indent',
                'outdent',
                'insertorderedlist',
                'insertunorderedlist',
                'link',
                'portal-image-upload',
                'preview',
                'fullscreen'
              ]
            }"
          />
        </el-form-item>
        <el-form-item label="工具" prop="tools" class="tools_box">
          <tools v-model="form.tools" :addable="true" :deletable="true" />
        </el-form-item>
        <el-form-item size="small" label="附件" prop="attachment">
          <attachment-upload v-model="form.attachment" style="width: 50%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" class="btn-gray" size="small" @click="confirm"
          >取消</el-button
        >
        <el-button size="small" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'sub-task',
  props: {
    edit: {
      type: Boolean,
      default: _ => true
    },
    persons: {
      type: Array,
      default: _ => []
    },
    taskDefinitionKey: {
      type: String,
      default: _ => ''
    },
    value: {
      type: Array,
      default: _ => []
    },
    independency: {
      type: Boolean,
      default: _ => false
    },
    hasMessagePage: {
      type: Boolean,
      default: true
    },
    nodeStatus: {
      type: [String, Number, Object],
      default: _ => ''
    }
  },
  components: {
    'rich-text': _ => import('~/components/rich-text'),
    'peoples-select': _ => import('~/components/peoples-select'),
    'attachment-upload': _ => import('~/components/upload'),
    tools: _ => import('~/components/tools')
  },
  data() {
    this.window = window
    return {
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        start: '08:30',
        step: '00:15',
        end: '18:30'
      },
      form: this.resetForm(),
      rules: {
        label: { required: true, message: '必填', trigger: 'blur' }
      },
      /*loading: false,*/
      dialog: false,
      assigneeIds: [],
      copyPersonIds: []
    }
  },
  computed: {
    tasks: {
      set(v) {
        this.$emit('input', v)
      },
      get() {
        return this.value
      }
    },
    executor() {
      return this.resetPersons(this.form.assignee)
    },
    copyor() {
      return this.resetPersons(this.form.copyPerson)
    },
    showRemindTime() {
      return this.nodeStatus === '0' || this.nodeStatus === '1'
    }
  },
  methods: {
    add() {
      this.reset()
      this.dialog = !this.dialog
    },
    reset() {
      this.form = this.resetForm()
    },
    statusText(statusCode) {
      const result = this.$constant.TASK_STATUS.find(
        item => statusCode == item.id
      )
      return result ? result.name : '待处理'
    },
    statusClass(statusCode) {
      return ['padding', 'processing', 'done', 'stop', 'cancel'][statusCode]
    },
    resetForm() {
      const data = {
        label: '',
        assignee: [],
        copyPerson: [],
        startTime: '',
        endTime: '',
        priority: 0,
        description: '',
        tools: '',
        attachment: []
      }
      if (this.showRemindTime) {
        data.remindTime = ''
      }
      return data
    },
    save() {
      this.$refs.form.validate(v => {
        if (!v) return
        let loading = this.$loading({
          target: this.$refs.dialog.$el.firstChild
        })
        let { form, params, headers, assignee, copyPerson } = this.preSave()
        this.$api.flowSetting
          .addSubTask(params, { headers })
          .then(({ data }) => {
            loading.close()
            // let value = [...this.tasks]
            let last = Object.assign(
              { ...form },
              { assignee, copyPerson, ...data }
            )
            if (last.assignee.length <= 0) {
              let v = this.$cache.get('USER_INFO')
              last.assignee.push({
                id: (v && v.id) || '',
                pic: (v && (v.pic || v.photo)) || '',
                color: (v && v.color) || 'blue',
                name: (v && (v.name || v.realName || v.userName)) || ''
              })
            }
            if (!last.hasOwnProperty('status')) {
              last.status = 0
            }
            // value.push(last)
            // this.tasks = value
            this.tasks.push(last)
            this.$message.success('添加成功')
            this.$emit('fetchList')
            this.add()
          })
          .catch(e => {
            loading.close()
          })
      })
    },
    preSave() {
      let form = JSON.parse(JSON.stringify(this.form))
      let assignee = form.assignee
      let copyPerson = form.copyPerson
      form.copyPerson = form.copyPerson.map(({ id }) => id).join(',')
      form.assignee = form.assignee.map(({ id }) => id).join(',')
      if (form.assignee.length <= 0 && this.independency) {
        let user = this.$cache.get('USER_INFO', { id: '-1' })
        form.assignee = user.id
        assignee = [
          {
            id: form.assignee,
            name: user.realName || user.userName,
            pic: user.photo,
            color: user.color || this.$helper.color()
          }
        ]
      }
      form.attachment = form.attachment.map(({ url, name }) => ({
        url,
        name
      }))
      form.startTime = this.$helper.formatTime(form.startTime)
      form.endTime = this.$helper.formatTime(form.endTime)
      if (this.showRemindTime) {
        form.remindTime = this.$helper.formatTime(form.remindTime)
      }
      let headers = { groupId: this.$route.params.storeId }
      let params = {
        ...headers,
        ...form
      }

      if (this.independency) {
        params.processInstanceId = this.$route.params.processExecId
        params.processType = '1'
      } else {
        params.rootProcessInstanceId = this.$route.params.rootProcessExec
        params.taskDefinitionKey = this.taskDefinitionKey
        params.processType = '2'
      }
      return { form, params, headers, assignee, copyPerson }
    },
    async confirm() {
      try {
        await this.$confirm('新增子任务尚未保存，是否要保存后继续', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        })
        this.save()
      } catch (e) {
        this.add()
      }
    },
    resetPersons(persons) {
      return this.persons.map(({ id, name, pic, color }) => ({
        id,
        name,
        pic,
        color,
        active: persons.find(p => p.id == id),
        disable: false
      }))
    },
    go(id) {
      const { info } = this.$route.query
      if (this.independency) {
        let path = `/${this.$route.params.storeId}/task-detail${
          this.hasMessagePage ? '-message' : ''
        }/${id}`
        this.$router.push(path)
      } else {
        this.$router.push(
          `${this.$route.path.replace(
            new RegExp('flow-detail', 'g'),
            'process-task-detail'
          )}/${id}`
        )
      }
    },
    async updateStatus(v) {
      try {
        let params = {
          status: v.split(',')[0],
          processExecId: v.split(',')[1]
        }
        await this.$api.flowSetting.updateTaskStatus(params, {
          headers: {
            groupId: this.$route.params.storeId
          }
        })
        this.$message.success('更新成功')
        this.tasks = this.tasks.map(t => {
          if (t.processInstanceId == params.processExecId) {
            t.status = params.status
          }
          return {
            ...t
          }
        })
      } catch (ex) {}
    }
  },
  watch: {
    assigneeIds(val, old) {
      if (val) {
        const arr = this.persons.filter(t => val.indexOf(t.id) >= 0)
        this.form.assignee = arr.map(({ id, name, pic, color }) => ({
          id,
          name,
          pic,
          color,
          active: true,
          disable: false
        }))
      }
    },
    copyPersonIds(val, old) {
      if (val) {
        const arr = this.persons.filter(t => val.indexOf(t.id) >= 0)
        this.form.copyPerson = arr.map(({ id, name, pic, color }) => ({
          id,
          name,
          pic,
          color,
          active: true,
          disable: false
        }))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.task {
  display: flex;
  padding: 12px;
  border: 1px solid #d9d9d9;
  margin-top: 8px;
  transition: 0.3s;
  &:first-child {
    margin-top: 0;
  }
  &:last-of-type {
    margin-bottom: 16px;
  }
  &:hover {
    box-shadow: 0px 0px 10px 0px #3333331a;
  }
  &-done {
    background-color: #fafafa;
  }
  .label-cancel {
    text-decoration: line-through;
  }
  .label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #333;
  }
  .left {
    width: 80%;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    flex: 1;
    .status-bar {
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 12px;
      line-height: 1;
      &.done {
        background: rgba(51, 102, 255, 0.1);
        color: rgba(51, 102, 255, 0.8);
        opacity: 0.8;
      }
      &.padding {
        background: rgba(240, 240, 240, 1);
        color: #999999;
      }
      &.processing {
        background: rgba(51, 102, 255, 0.1);
        color: #3366ff;
      }
      &.stop {
        background: rgba(240, 240, 240, 1);
        color: #999999;
      }
      &.cancel {
        background: rgba(240, 240, 240, 1);
        color: #999999;
      }
    }
  }
  .more {
    /deep/ .el-dropdown-link {
      cursor: pointer;
      display: block;
      transform: rotate(90deg);
    }
  }
  .circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ccc;
    &.status-done,
    &:hover {
      border-color: $--color-primary;
    }
    &.status-done {
      position: relative;
      background-color: $--color-primary;
      opacity: 0.7;
      &:after {
        content: '';
        position: absolute;
        width: 4px;
        height: 7px;
        border-right: 2px solid #fff;
        border-bottom: 2px solid #fff;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -55%) rotate(45deg);
      }
    }
  }
  .time {
    margin-top: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    color: #999;
  }
}
/deep/ .el-input__suffix {
  line-height: 30px;
}
/deep/ .el-form-item {
  margin-bottom: 24px;
  &__label {
    display: block;
    float: none;
    text-align: left;
    line-height: 1;
    margin-bottom: 8px;
  }
}
.btn-add {
  display: inline-block;
  font-size: 14px;
  color: $--color-primary;
  cursor: pointer;
}
/deep/ {
  .el-form-item__label {
    font-size: 12px;
  }
  .tools_box {
    .el-form-item__content {
      padding-top: 12px;
    }
  }
}
.sub-rich-text.rich-text-container {
  &.hide-statusbar {
    height: 150px;
    /deep/ .ke-toolbar {
      height: 25px !important;
    }
    /deep/ .ke-edit {
      height: 125px !important;
    }
  }
}

/deep/ .el-form-item__content {
  line-height: 19px;
}

/deep/ .el-dialog__body {
  padding: 14px 24px;
}

.finished {
  opacity: 0.6;
}
.pause {
  opacity: 0.6;
}
.cancel {
  opacity: 0.6;
}
.danger {
  .time {
    background: #f5a623;
    color: white;
    display: inline;
    border-radius: 2px;
    padding: 0 2px;
  }
}
.delay {
  .time {
    display: inline;
    background: #ed4040;
    color: white;
    border-radius: 2px;
    padding: 0 2px;
  }
}
</style>
