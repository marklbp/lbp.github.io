<template>
  <div class="page-inner">
    <router-back text="新建独立任务" />
    <el-form :model="vm" ref="formRef" :rules="rules" label-position="top">
      <div class="form-body">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="label">
              <el-input v-model="vm.label" maxlength="60" size="small">
                <template slot="suffix"
                  >{{ vm.label.length }}/60</template
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人">
              <el-select
                style="width: 100%;"
                filterable
                size="small"
                v-model="seledOperatorIds"
                ref="elselect"
                popper-class="filter-prop-popper"
              >
                <el-option
                  v-for="(item, index) in opratePersonList"
                  :key="'opratePerson' + index"
                  :label="item.realName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="抄送人">
              <el-select
                style="width: 100%;"
                filterable
                size="small"
                multiple
                v-model="seledSendIds"
                ref="elselect"
                popper-class="filter-prop-popper"
              >
                <el-option
                  v-for="(item, index) in sendPersonList"
                  :key="'opratePersont' + index"
                  :label="item.realName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="vm.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                type="datetime"
                class="datetime"
                size="100%"
                :picker-options="pickerOptions"
                placeholder="请选择"
                @change="startTimeChange"
                default-time="00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="截止时间" prop="endTime">
              <el-date-picker
                v-model="vm.endTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                type="datetime"
                class="datetime"
                size="100%"
                :picker-options="pickerOptions"
                placeholder="请选择"
                @change="dateTimeChange"
                default-time="23:59:59"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select size="small" v-model="vm.priority" style="width:100%;">
                <el-option value="0" label="普通" />
                <el-option value="1" label="紧急" />
                <el-option value="2" label="非常紧急" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="重复">
              <el-select size="small" v-model="vm.cyclical" style="width:100%;">
                <el-option value="once" label="不重复" />
                <el-option value="daily" label="每天" />
                <el-option value="weekly" label="每周" />
                <el-option value="monthly" label="每月" />
                <el-option value="yearly" label="每年" />
                <el-option value="workday" label="工作日" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义提醒" prop="remindTime">
              <el-date-picker
                v-model="vm.remindTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                type="datetime"
                class="datetime"
                size="100%"
                :picker-options="pickerOptions"
                placeholder="请选择"
                @change="remindTimeChange"
                default-time="00:00:00"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="自定义标签" prop="remindTime">
              <ross-tag v-model="vm.tags" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述" style="height:auto;">
          <rich-text
            v-model="vm.description"
            maxlength="1000"
            :config="richConfig"
            show-word-limit
          ></rich-text>
        </el-form-item>
        <el-form-item label="工具">
          <tools v-model="vm.tools" :addable="true" :deletable="true" />
        </el-form-item>
        <el-form-item label="附件">
          <attachments style="width: 50%" v-model="fileList" />
        </el-form-item>
      </div>
      <el-form-item
        class="form-footer"
        :style="{ width: `calc(100% - ${footerW}px)` }"
      >
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="disableSave"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let { mapState } = Vuex
const richConfig = {
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
    'fullscreen'
  ]
}
export default {
  components: {
    'rich-text': _ => import('~/components/rich-text'),
    attachments: _ => import('~/components/attachments'),
    'router-back': _ => import('~/components/router-back'),
    'ross-tag': _ => import('~/ross-components/ross-tag'),
    tools: _ => import('~/components/tools')
  },
  data() {
    return {
      vm: {
        copyPerson: '',
        description: '',
        attachment: '',
        startTime: '',
        endTime: '',
        remindTime: '',
        assignee: '',
        groupId: 0,
        label: '',
        priority: '0',
        tools: '',
        cyclical: 'once',
        tags: []
      },
      pickerOptions: {
        // 禁止选择小于当前日期的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        label: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      //执行人list
      opratePersonList: [],
      //抄送人List
      sendPersonList: [],

      // 所有人员列表
      personList: [],
      //选择的执行人
      seledOperatorIds: [],
      //选择的抄送人
      seledSendIds: [],
      fileList: [],
      disableSave: false,
      richConfig,
      footerW: 260
    }
  },
  computed: {
    ...mapState(['collapsed']),
    seledOperator() {
      const arr = this.opratePersonList.filter(
        t => this.seledOperatorIds.indexOf(t.id) >= 0
      )
      return arr.map(({ id, realName: name, pic, color }) => ({
        name,
        id,
        pic,
        color,
        active: true
      }))
    },
    seledSends() {
      const arr = this.sendPersonList.filter(
        t => this.seledSendIds.indexOf(t.id) >= 0
      )
      return arr.map(({ id, realName: name, pic, color }) => ({
        name,
        id,
        pic,
        color,
        active: true
      }))
    }
  },
  created() {
    this.vm.groupId = this.$route.params.storeId
    this.$api.flowSetting
      .getAssignee(
        {
          groupId: this.$route.params.storeId
        },
        { headers: { groupId: this.$route.params.storeId } }
      )
      .then(result => {
        this.sendPersonList = JSON.parse(JSON.stringify(result.data.records))
        this.opratePersonList = JSON.parse(JSON.stringify(result.data.records))
      })
  },
  methods: {
    clickPeopleHandler(ind, type) {
      const target = type === 0 ? 'seledOperator' : 'seledSends'
      this[target].splice(ind, 1)
    },
    changePeopleHandler(list, type) {
      const target = type === 0 ? 'seledOperator' : 'seledSends'
      this[target] = list
    },
    dateTimeChange(date) {
      this.vm.endTime = date
    },
    startTimeChange(date) {
      this.vm.startTime = date
    },
    remindTimeChange(date) {
      this.vm.remindTime = date
    },
    async onSubmit() {
      if (!this.vm.label) return this.$message.error('请输入任务名称')
      this.disableSave = true
      //抄送人id
      this.vm.copyPerson = this.seledSends.map(v => v.id).join(',')
      //执行人id
      this.vm.assignee =
        this.seledOperator.map(v => v.id).join(',') ||
        (this.$cache.get('USER_INFO') || {}).id
      // 上传文件url
      this.vm.attachment = this.fileList.map(({ url, name }) => ({
        url,
        name
      }))
      const tags = this.vm.tags.join(',')
      try {
        let result = await this.$api.independent.save(
          { ...this.vm, tags },
          {
            headers: { groupId: this.$route.params.storeId }
          }
        )
        this.$message.success('保存成功')
        setTimeout(() => {
          this.disableSave = false
          this.$router.back()
        }, 1000)
        // this.$message({ : 'success', message: '保存成功'})
      } catch (error) {
        this.disableSave = false
      }
    }
  },
  watch: {
    collapsed(newV, oldV) {
      this.footerW = newV ? 72 : 260
    }
  }
}
</script>

<style lang="scss" scoped>
.page-inner {
  display: flex;
  flex-direction: column;
  user-select: none;
  position: relative;
  &:after {
    display: none !important;
  }
  /deep/ {
    .el-form-item__label {
      line-height: 100%;
      padding: 0;
      margin-bottom: 8px;
    }
  }
  .el-form-item__label {
    padding-bottom: 0;
  }
  .header {
    padding: 0 32px;
  }
  .el-form {
    background: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .form-body {
    padding: 32px;
    flex: 1;
    overflow: auto;
  }
  .addTool {
    display: flex;
    position: relative;
    width: 60px;
    height: 60px;
    border: 1px dashed #ddd;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      width: 20px;
      height: 2px;
      background: #ddd;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &:after {
      content: '';
      position: absolute;
      width: 2px;
      height: 20px;
      background: #ddd;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .datetime {
    width: 100%;
  }
  .checkList {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    .toolItem {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border: 1px solid #ccc;
      font-size: 14px;
      .checkBox {
        position: absolute;
        left: 8px;
        top: 8px;
      }
      .toolInfo {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          height: 50px;
          width: 50px;
        }
        span {
          padding-top: 15px;
          text-align: center;
        }
      }
    }
  }
  .upload {
    width: 50%;
  }
  .addChildrenTask {
    margin: 0;
    line-height: 20px;
    height: 20px;
    color: #3366ff;
    cursor: pointer;
  }
  .form-footer {
    position: fixed;
    right: 40px;
    bottom: 0;
    width: calc(100% - 260px);
    z-index: 0;
    height: 56px;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    margin-left: -$--main-padding;
    margin-right: -$--main-padding;
    transition: 0.25s width;
    transition-property: width;
    transition-duration: 0.25s;
    transition-timing-function: ease;
    transition-delay: 0s;
    .footer__action {
      text-align: center;
    }
  }
}
.peoples-wrap {
  display: flex;
  align-items: center;
}
</style>
<style>
.el-scrollbar__wrap {
  box-sizing: content-box;
}
.set_remind_rules {
  position: absolute;
  right: 0;
  top: -20px;
  z-index: 1;
  padding: 0;
}
</style>
