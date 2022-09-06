<template>
  <div class="create-active-wrap">
    <router-back text="新建活动" />
    <div class="active-info">
      <div class="active-input">
        <div class="active-title active-item">
          <p class="item-title">
            <span>*</span>
            活动标题
          </p>
          <el-input
            v-model="inputTitle"
            placeholder="请输入活动标题"
            maxlength="30"
            size="small"
            show-word-limit
          ></el-input>
        </div>
        <div class="active-time active-item">
          <div class="item-title">
            <p class="item-title">
              <span>*</span>
              活动时间
            </p>
          </div>
          <el-date-picker
            v-model="inputTime"
            type="datetimerange"
            size="small"
            style="height:34px;"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
            >
          </el-date-picker>
        </div>
        <div class="active-type active-item">
          <div class="item-title">
            <p class="item-title">
              <span>*</span>
              活动类型
            </p>
          </div>
          <el-select v-model="inputType" placeholder="请选择" size="small">
            <el-option
              v-for="item in [
                { id: 1, name: '平台型活动' },
                { id: 2, name: '店铺型活动' }
              ]"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="active-address active-item">
          <div class="active-title">
            <p class="item-title">地点</p>
            <el-input
              v-model="inputAddress"
              placeholder="请输入活动地点"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <!-- 暂不开放 -->
        <div class="active-type active-item" v-if="false">
          <div class="item-title">
            <p class="item-title">参与者</p>
          </div>
          <peoples-select
            v-model="inputPeoples"
            :data="peoplesList"
            multiple
            isDelete
          ></peoples-select>
        </div>
        <div class="active-repeat active-item" v-if="false">
          <div class="item-title">
            <p class="item-title">重复</p>
          </div>
          <el-select v-model="inputRepeat" placeholder="请选择" size="small">
            <el-option
              v-for="(item, i) in ['不重复', '重复']"
              :key="i"
              :value="i"
              :label="item"
            ></el-option>
          </el-select>
        </div>
        <div class="active-notice active-item" v-if="false">
          <div class="item-title">
            <p class="item-title">提醒</p>
          </div>
          <el-select v-model="inputNotice" placeholder="请选择" size="small">
            <el-option
              v-for="(item, i) in ['每月提醒', '每周提醒']"
              :key="i"
              :value="i"
              :label="item"
            ></el-option>
          </el-select>
        </div>
        <!-- 暂不开放 -->
      </div>
      <div class="active-desc">
        <p class="desc-title">描述</p>
        <rich-text
          v-model="inputDesc"
          :config="richConfig"
          maxlength="1000"
          show-word-limit
        ></rich-text>
        <!-- 暂不开放 -->
        <div class="active-relative" v-if="false">
          <h4>关联内容</h4>
          <p>+添加关联内容</p>
        </div>
        <!-- 暂不开放 -->
      </div>
      <div class="commit-btns">
        <el-button @click="cancleHandler">取消</el-button>
        <el-button
          type="primary"
          @click="submitHandler"
          :disabled="disableSubmit"
          >确定并发布</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'createActivity',
  data() {
    return {
      inputTitle: '', // 活动标题
      inputTime: [], // 活动时间
      inputType: '', // 活动类型: 2 店铺型, 1 平台型
      inputAddress: '', // 活动地点
      inputJoiner: '', // 参与人
      inputNotice: 0, // 提醒间隔： 0 每月提醒
      inputRepeat: 0, // 重复： 0 不重复， 1 重复
      inputPeoples: [], // 选择的人员
      peoplesList: [], // 所有人员列表
      inputDesc: '', // 活动描述
      disableSubmit: false, // 禁用提交
      richConfig: {
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
    }
  },
  methods: {
    createActivity(newP) {
      const params = {
        type: this.inputType,
        activityName: this.inputTitle,
        activityStartTime: this.inputTime[0].getTime(),
        activityEndTime: this.inputTime[1].getTime(),
        address: this.inputAddress,
        description: this.inputDesc
      }
      Object.assign(params, newP)
      return this.$api.calendar.createActivity(params, {
        needToast: false,
        headers: {
          groupId: this.$route.params.storeId
        }
      })
    },
    validateParams() {
      if (!this.inputTitle.trim()) {
        return '请输入活动标题'
      }
      if (!this.inputTime || !this.inputTime.length) {
        return '请选择活动时间'
      }
      if (!this.inputType) {
        return '请选择活动类型'
      }
    },
    cancleHandler() {
      this.$router.push(`/${this.$route.params.storeId}/store-calendar`)
    },
    async submitHandler() {
      const msg = this.validateParams()
      if (msg) {
        return this.$message({
          message: msg,
          type: 'error'
        })
      }
      try {
        this.disableSubmit = true
        const res = await this.createActivity()
        this.$message({
          message: '创建成功',
          type: 'success',
          onClose: () => {
            this.$router.push(`/${this.$route.params.storeId}/store-calendar`)
          }
        })
      } catch (err) {
        this.$message({
          message: err.msg || err.message,
          type: 'error'
        })
        this.disableSubmit = false
      }
    }
  },
  components: {
    routerBack: _ => import('~/components/router-back'),
    peoplesSelect: _ => import('~/components/peoples-select'),
    richText: _ => import('~/components/rich-text')
  }
}
</script>
<style lang="scss" scoped>
.active-info {
  background: white;
  padding: 32px 32px 24px;
}
.active-input {
  overflow: hidden;
  > div {
    width: 46%;
    float: left;
    &:nth-child(2n + 1) {
      margin-right: 24px;
    }
  }
  /deep/ {
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
    .el-input__inner {
      height: auto;
    }
  }
}
.item-title {
  font-size: 12px;
  color: #666666ff;
  margin: 0 0 7px 0;
  > span {
    color: #ed4040ff;
  }
}
.active-item {
  margin-bottom: 25px;
}
.active-desc {
  font-size: 12px;
  color: #666666ff;
  margin-bottom: 9px;
}
.active-relative {
  font-size: 12px;
  margin-top: 24px;
  > h4 {
    color: #666666ff;
    margin: 0 0 16px 0;
    font-weight: normal;
  }
  > p {
    margin: 0;
    color: #3366ffff;
  }
}
.commit-btns {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  left: 0;
  border-left: 240px solid #262a39;
  bottom: 0px;
  background: #fafafaff;
  display: flex;
  height: 56px;
  justify-content: center;
  align-items: center;
  > span {
    width: 60px;
    height: 32px;
    line-height: 32px;
    color: #666666ff;
    border: 1px solid #d9d9d9ff;
    margin-right: 8px;
    box-sizing: border-box;
    text-align: center;
  }
  > a {
    background: #3366ffff;
    text-align: center;
    line-height: 32px;
    height: 32px;
    color: white;
    width: 94px;
  }
}
</style>
