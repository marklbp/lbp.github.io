<template>
  <div class="page-inner">
    <router-back text="任务提醒设置" :disableRoute="true" />
    <div class="page-content">
      <el-form
        :model="formData"
        :rules="comRules"
        ref="remindForm"
        label-width="100px"
        class="form-box"
      >
        <h4>
          提醒规则
          <el-tooltip
            content="规则中设置的小时数必须为整数，最小为0，最大为24"
            placement="right"
          >
            <i class="question-icon">?</i>
          </el-tooltip>
        </h4>
        <div class="form-filed">
          <el-checkbox
            v-model="formData.createRemind"
            :false-label="1"
            :true-label="0"
            >任务生成时提醒</el-checkbox
          >
        </div>
        <div class="form-filed">
          <el-checkbox
            v-model="formData.remindBeforeOverdue"
            :false-label="1"
            :true-label="0"
            >任务截止时间前</el-checkbox
          >
          <el-form-item prop="hoursBeforeOverdue">
            <el-input-number
              v-model="formData.hoursBeforeOverdue"
              :precision="0"
              :controls="false"
              :min="0"
              :max="24"
            ></el-input-number
            >小时提醒
          </el-form-item>
        </div>
        <div class="form-filed">
          <el-checkbox
            v-model="formData.remindOverdue"
            :false-label="1"
            :true-label="0"
            >任务逾期后</el-checkbox
          >
          <el-form-item prop="hoursOverdue">
            <el-input-number
              v-model="formData.hoursOverdue"
              :precision="0"
              :controls="false"
              :min="0"
              :max="24"
            ></el-input-number
            >小时提醒
          </el-form-item>
        </div>

        <div class="form-filed">
          <el-checkbox
            v-model="formData.remindSecondLevel"
            :false-label="1"
            :true-label="0"
            >任务逾期后</el-checkbox
          >
          <el-form-item prop="hoursOverdueSecondLevel">
            <el-input-number
              v-model="formData.hoursOverdueSecondLevel"
              :precision="0"
              :controls="false"
              :min="0"
              :max="99"
            ></el-input-number
            >小时提醒二级预警人：
          </el-form-item>
          <el-form-item prop="secondLevelReminder">
            <el-select
              style="width: 320px;"
              filterable
              size="small"
              multiple
              v-model="formData.secondLevelReminder"
              popper-class="filter-prop-popper"
            >
              <el-option
                v-for="(item, index) in assignees"
                :key="'opratePersont' + index"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="form-filed">
          <el-checkbox
            v-model="formData.remindFirstLevel"
            :false-label="1"
            :true-label="0"
            >任务逾期后</el-checkbox
          >
          <el-form-item prop="hoursOverdueFirstLevel">
            <el-input-number
              v-model="formData.hoursOverdueFirstLevel"
              :precision="0"
              :controls="false"
              :min="0"
              :max="99"
            ></el-input-number
            >小时提醒一级预警人：
          </el-form-item>
          <el-form-item prop="firstLevelReminder">
            <el-select
              style="width: 320px;"
              filterable
              size="small"
              multiple
              v-model="formData.firstLevelReminder"
              popper-class="filter-prop-popper"
            >
              <el-option
                v-for="(item, index) in assignees"
                :key="'opratePersont' + index"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="button-warpper">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'store-remind',
  components: {
    'router-back': _ => import('~/components/router-back')
  },
  data() {
    return {
      formData: {
        hoursBeforeOverdue: '', // 截止前小时数
        hoursOverdue: '', // 逾期后小时数
        remindBeforeOverdue: '', // 是否开启截止前提醒，0：是 1：否
        remindOverdue: '', // 是否开启逾期后提醒，0：是 1：否
        createRemind: '', // 是否创建时提醒，0：是；1：否

        firstLevelReminder: '', // 一级告警人的id: '123,456,789'
        hoursOverdueFirstLevel: '', // 一级告警人截止后提醒的时间
        hoursOverdueSecondLevel: '', // 二级告警人截止后提醒的时间
        remindFirstLevel: '', // 是否开启一级告警人逾期后提醒，0：是；1：否
        remindSecondLevel: '', // 是否开启二级告警人逾期后提醒，0：是；1：否
        secondLevelReminder: '' // 二级告警人的id ,
      },
      assignees: [],
      rules: {
        hoursBeforeOverdue: [
          {
            required: true,
            message: '请将规则补充完整',
            trigger: ['blur', 'change']
          }
        ],
        hoursOverdue: [
          {
            required: true,
            message: '请将规则补充完整',
            trigger: ['blur', 'change']
          }
        ],
        hoursOverdueSecondLevel: [
          {
            required: true,
            message: '请将规则补充完整',
            trigger: ['blur', 'change']
          }
        ],
        hoursOverdueFirstLevel: [
          {
            required: true,
            message: '请将规则补充完整',
            trigger: ['blur', 'change']
          }
        ]
      },
      httpConfig: {}
    }
  },
  computed: {
    comRules() {
      const rules = {
        ...this.rules,
        secondLevelReminder: [
          {
            required: this.formData.remindSecondLevel === 0,
            message: '请选择二级预警人',
            trigger: ['blur', 'change']
          }
        ],
        firstLevelReminder: [
          {
            required: this.formData.remindFirstLevel === 0,
            message: '请选择一级预警人',
            trigger: ['blur', 'change']
          }
        ]
      }
      return rules
    }
  },
  created() {
    const { storeId } = this.$route.params
    this.httpConfig = {
      headers: {
        groupId: storeId || ''
      }
    }
    this.getSettingConfig()
    this.getAssignee()
  },
  methods: {
    async getAssignee() {
      try {
        this.$api.flowSetting
          .getAssignee(
            {
              groupId: this.$route.params.storeId
            },
            { headers: { groupId: this.$route.params.storeId } }
          )
          .then(result => {
            this.assignees = result.data.records
          })
      } catch (err) {
        console.error(err)
      }
    },
    async getSettingConfig() {
      try {
        const { querySetting } = this.$api.remind
        const res = await querySetting({}, this.httpConfig)
        const data = res.data
        if (data) {
          this.formData = {
            hoursBeforeOverdue: data.hoursBeforeOverdue,
            hoursOverdue: data.hoursOverdue,
            remindBeforeOverdue: data.remindBeforeOverdue,
            remindOverdue: data.remindOverdue,
            createRemind: data.createRemind,
            firstLevelReminder: data.firstLevelReminder
              ? data.firstLevelReminder.split(',')
              : null,
            hoursOverdueFirstLevel: data.hoursOverdueFirstLevel,
            hoursOverdueSecondLevel: data.hoursOverdueSecondLevel,
            remindFirstLevel: data.remindFirstLevel,
            remindSecondLevel: data.remindSecondLevel,
            secondLevelReminder: data.secondLevelReminder
              ? data.secondLevelReminder.split(',')
              : null,
            groupId: data.groupId,
            id: data.id
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    async updateSettingConfig() {
      try {
        const { updateSetting } = this.$api.remind
        const formData = this.formData
        const secondArr = formData.secondLevelReminder
        const firstArr = formData.firstLevelReminder
        const data = {
          ...formData,
          secondLevelReminder: secondArr ? secondArr.join(',') : secondArr,
          firstLevelReminder: firstArr ? firstArr.join(',') : firstArr
        }
        const res = await updateSetting(data, this.httpConfig)
        this.$message.success('操作成功')
      } catch (err) {
        console.error(err)
      }
    },
    save() {
      console.log(this.$refs)
      this.$refs.remindForm.validate(vaild => {
        if (vaild) {
          this.updateSettingConfig()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-content {
  .form-box {
    background: #fff;
    padding: 24px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      .question-icon {
        margin-left: 8px;
        width: 14px;
        height: 14px;
        text-align: center;
        line-height: 12px;
        font-size: 12px;
        color: #999999;
        border: 1px solid #999999;
        font-style: normal;
        border-radius: 100%;
        font-weight: 500 !important;
        display: inline-block;
        box-sizing: border-box;
        &:hover {
          color: #666666;
        }
      }
    }
    .form-filed {
      margin-top: 24px;
      font-size: 14px;
      .el-form-item {
        display: inline-block;
        margin-bottom: 0;
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }
      .el-input-number {
        margin: 0 8px;
        width: 88px;
      }
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;
    }
  }
  .button-warpper {
    text-align: center;
    margin-top: 24px;
    .el-button {
      width: 90px;
    }
  }
}
</style>
