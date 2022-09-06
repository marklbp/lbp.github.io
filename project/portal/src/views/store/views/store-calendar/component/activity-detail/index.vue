<template>
  <page-init :loading="loading" :message="message" :code="404">
    <div class="active-detail-wrap">
      <div class="router-back-wrap">
        <router-back />
        <el-input
          class="activity-name"
          v-model="activityName"
          placeholder="请输入活动标题"
          maxlength="30"
          size="small"
          @focus="editorTitle = true"
          @blur="editorTitle = false"
          @change="
            updateActivity()
            editorTitle = false
          "
          :show-word-limit="editorTitle"
        ></el-input>
      </div>
      <div class="active-detail-container">
        <div class="activity-platform">
          <el-select
            v-model="type"
            placeholder="请选择"
            size="small"
            class="activity-type"
            @change="updateActivity"
          >
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
        <div class="active-info">
          <!-- 暂不开放 -->
          <div class="active-joiner" v-if="false">
            <span>
              参与人：
            </span>
            <peoples-select></peoples-select>
          </div>
          <!-- 暂不开放 -->
          <div class="active-time">
            <span>活动时间</span>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              size="small"
              style="height:34px;"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="-"
              end-placeholder="-"
              @change="updateActivity"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </div>
          <div class="active-repeat"></div>
        </div>
        <div class="active-address">
          <span>活动地点：</span>
          <el-input
            v-model="address"
            @change="
              updateActivity()
              editorAddress = false
            "
            maxlength="30"
            @focus="editorAddress = true"
            @blur="editorAddress = false"
            :show-word-limit="editorAddress"
          ></el-input>
        </div>
        <div class="active-desc">
          <span>活动描述</span>
          <p
            v-if="!editorDesc"
            @click="editorDesc = !editorDesc"
            v-html="description"
          ></p>
          <div class="rich-text-wrap" v-else>
            <rich-text
              v-model="richTextDesc"
              :config="richConfig"
              :maxlength="1"
              show-word-limit
            ></rich-text>
            <div class="rich-text-btn">
              <el-button type="primary" @click="confirmDesc"
                ><i class="el-icon-check"></i
              ></el-button>
              <el-button @click="cancleDesc"
                ><i class="el-icon-close"></i
              ></el-button>
            </div>
          </div>
        </div>
        <!-- 暂不开放 -->
        <div class="active-relate" v-if="false">
          <span>关联内容</span>
          <div>
            关联呢荣老师的军阀势力扩大
          </div>
        </div>
        <!-- 暂不开放 -->
      </div>
    </div>
  </page-init>
</template>
<script>
export default {
  name: 'activity-detail',
  data() {
    return {
      loading: true,
      message: '',
      editorAddress: false,
      editorTitle: false,
      editorName: false,
      type: 1,
      editorDesc: false,
      activityName: '',
      joinPeople: [],
      code: 0,
      time: [],
      address: '',
      description: '',
      richTextDesc: '',
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
  props: ['id', 'storeId'],
  components: {
    pageInit: _ => import('~/components/page-init'),
    routerBack: _ => import('~/components/router-back'),
    peoplesSelect: _ => import('~/components/peoples-select'),
    richText: _ => import('~/components/rich-text')
  },
  created() {
    this.initData()
  },
  methods: {
    getDetail(id) {
      return this.$api.calendar.activityDetail(
        {
          id
        },
        {
          needToast: false,
          headers: {
            groupId: this.storeId
          }
        }
      )
    },
    validateParams() {
      if (!this.activityName.trim()) {
        return '请输入活动标题'
      }
      if (!this.time || !this.time.length) {
        return '活动时间不能为空'
      }
      if (!this.type) {
        return '请选择活动类型'
      }
    },
    confirmDesc() {
      if (this.description !== this.richTextDesc) {
        this.description = this.richTextDesc
        this.updateActivity()
      }
      this.richTextDesc = ''
      this.editorDesc = false
    },
    cancleDesc() {
      this.richTextDesc = ''
      this.editorDesc = false
    },
    async initData() {
      this.loading = true
      const detail = await this.getDetail(this.id).catch(err => {
        this.loading = false
        this.message = err.msg || err.message
        this.code = 404
        return { data: {} }
      })
      this.loading = false
      const {
        data: {
          type,
          activityName,
          activityStartTime,
          activityEndTime,
          address,
          description
        }
      } = detail
      this.type = type
      this.activityName = activityName
      this.time = [new Date(+activityStartTime), new Date(+activityEndTime)]
      this.address = address
      this.description = description
    },
    updateActivity() {
      const msg = this.validateParams()
      if (msg) {
        return this.$message({
          message: msg,
          type: 'error'
        })
      }
      this.loading = true
      const params = {
        id: this.id, // 活动id
        type: this.type, // 平台型1 店铺型2
        activityName: this.activityName, // 活动名
        activityStartTime: this.time[0].getTime(), // 开始时间
        activityEndTime: this.time[1].getTime(), // 截至时间
        address: this.address, // 地址
        description: this.description // 描述
      }
      this.$api.calendar
        .updateActivity(params, {
          needToast: false,
          headers: {
            groupId: this.storeId
          }
        })
        .then(res => {
          this.loading = false
          this.message = ''
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.loading = false
          this.message = ''
          this.$message({
            message: err.message || err.msg || '保存失败',
            type: 'error'
          })
        })
    }
  },
  watch: {
    editorDesc(newV) {
      if (newV) {
        this.richTextDesc = this.description
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.router-back-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 23px;
  /deep/ {
    .breadcrumb {
      margin: 0;
    }
  }
}
.activity-platform {
  margin-bottom: 23px;
  /deep/ {
    .el-input__inner {
      padding-left: 0 !important;
      color: #999;
      &::-webkit-input-placeholder {
        color: #999;
      }
    }
  }
}
.activity-name {
  max-width: 300px;
  font-size: 20px;
  color: #333333ff;
  font-weight: bold;
  /deep/ {
    .el-input__inner {
      font-size: 20px;
      color: #333333ff;
      border: none;
      background: transparent;
      font-weight: bold;
      padding-right: 50px;
      text-overflow: ellipsis;
      &:hover {
        outline: 1px #999 dashed;
      }
    }
    .el-input__count-inner {
      background: transparent !important;
    }
  }
}
.activity-type {
  /deep/ {
    .el-input__inner {
      border: none;
      background: none;
      padding-left: 10px;
      + .el-input__suffix {
        display: none;
      }
      &:hover {
        outline: 1px dashed #999;
        + .el-input__suffix {
          display: block;
        }
      }
      &:focus {
      }
    }
  }
}
.active-detail-container {
  padding: 24px 32px;
  background: white;
}
.router-back-wrap {
  display: flex;
  // align-items: center;
  > span {
    line-height: 24px;
    color: #999;
    margin-left: 20px;
  }
}
.active-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.active-joiner,
.active-time,
.active-address {
  margin-right: 24px;
  > span {
    font-size: 14px;
    color: #999;
    margin-right: 10px;
  }
}
.active-time {
  /deep/ {
    .el-date-editor {
      border-color: transparent;
      &:hover {
        border: 1px dashed #999;
      }
    }
    .el-input__icon {
      display: none;
    }
  }
}
.active-joiner {
  display: flex;
  justify-items: center;
  align-items: center;
}
.active-time,
.active-address {
  > span:nth-child(2) {
    color: #333;
  }
}
.active-address {
  padding-bottom: 25px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8ff;
  display: flex;
  align-items: center;
  > span {
    margin-right: 0;
    width: 70px;
    flex-shrink: 0;
  }
  /deep/ {
    .el-input__inner {
      border: none;
      &:hover {
        outline: 1px dashed #999;
      }
    }
  }
}
.active-desc,
.active-relate {
  display: flex;
  margin-bottom: 24px;
  > span {
    color: #999;
    margin-right: 16px;
  }
  > div {
    color: #333;
  }
}
.active-desc {
  display: flex;
  line-height: 32px;
  font-size: 14px;
  > p {
    margin: 0;
    flex: 1;
    &:hover {
      outline: 1px dashed #999;
    }
  }
  /deep/ {
    .rich-text-wrap {
      flex: 1;
    }
    .ke-toolbar {
      display: none !important;
    }
  }
  .rich-text-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
.active-relate {
  margin-bottom: 0;
}
</style>
