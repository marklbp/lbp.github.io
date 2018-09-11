<template>
  <div class="vue-generators">
    <el-form :inline="true" label-position="right" label-width='130px' data-vv-scope="form-1">
      <h3 class="pch-modal-title">变更管理员</h3>
      <el-row :gutter="24">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="登录名">
            <el-input v-model='oldUserAdmin.userName' placeholder="请输入内容" class="input-with-select" :disabled="true" name='oldUserAdmin.userName' v-validate="'required'">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="姓名">
            <el-input v-model='oldUserAdmin.realName' placeholder="请输入内容" class="input-with-select" :disabled="true">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="手机号码" for="user.userName" :class="{ 'vee-control': true }">
            <el-input placeholder="请输入内容" v-model="user.userName" class="input-with-select" v-validate="'required|mobile'" :class="{'input': true, 'is-danger': errors.has('user.userName') }" name='user.userName'>
              <el-button slot="append" icon="el-icon-search" @click='searchAdmin'></el-button>
            </el-input>
            <span v-show="errors.has('user.userName')" class="help is-danger">{{ errors.first('user.userName') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <hr>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="登录名" :class="{ 'vee-control': true }">
            <el-input v-model='user.userName' placeholder="请输入内容" class="input-with-select" :disabled="true" :class="{'input': true,'is-danger': errors.has('user.userName') }" name='user.userName' v-validate="'required'">
            </el-input>
            <span v-show="errors.has('user.userName')" class="help is-danger">{{ errors.first('user.userName') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="姓名" :class="{ 'vee-control': true }">
            <el-input v-model='user.realName' placeholder="请输入内容" class="input-with-select" :disabled="true" :class="{'input': true,'is-danger': errors.has('user.realName') }" name='user.realName' v-validate="'required'">
            </el-input>
            <span v-show="errors.has('user.realName')" class="help is-danger">{{ errors.first('user.realName') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="身份证号码" :class="{ 'vee-control': true }">
            <el-input v-model='user.idNumber' placeholder="请输入内容" class="input-with-select" :disabled="true" :class="{'input': true,'is-danger': errors.has('user.idNumber') }" name='user.idNumber' v-validate="'required'">
            </el-input>
            <span v-show="errors.has('user.idNumber')" class="help is-danger">{{ errors.first('user.idNumber') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="机构" :class="{ 'vee-control': true }">
            <el-input v-model='oldUserAdmin.name' placeholder="请输入内容" class="input-with-select" :disabled="true" :class="{'input': true,'is-danger': errors.has('oldUserAdmin.realName') }" name='oldUserAdmin.realName' v-validate="'required'">
            </el-input>
            <span v-show="errors.has('oldUserAdmin.realName')" class="help is-danger">{{ errors.first('oldUserAdmin.realName') }}</span>
          </el-form-item>
        </el-col>
        <slot name="pch-modal-footer"></slot>
      </el-row>
    </el-form>
  </div>
</template>
<style lang="scss">
@import "~assets/scss/base/_base";

</style>
<script>
import Vue from 'vue'
import { Validator } from 'vee-validate'
import { mapState } from 'vuex'
import api from '@/api'
import defaultOption from '~/config/options'

let vm = new Vue()
const dictionary = {
  zh_CN: {
    custom: {
      name: {
        // required: () => '请选择注册地址'
      }
    },
    messages: {
      lender: {
        test: () => '请选择类型',
      }
    },
    attributes: {
      user: {
        "userName": "用户名",
        "realName": "姓名",
        "idNumber": "身份证号码",
        "sex": "性别",
        "birthday": "生日",
        "email": "邮箱",
        "status": "状态，1",
        "remark": "备注"
      }
    }
  }
};
Validator.localize(dictionary);

export default {
  props: {
    user: Object,
    oldUserAdmin: Object
  },
  data() {
    return {}
  },
  methods: {
    onValidate() {
      this.$validator.validateAll();
    },
    onClear() {
      this.errors.clear();
    },
    searchAdmin() {
      if(!defaultOption.phonevalidate.test(this.user.userName)){
          this.$message({
              message: '请输入正确的手机号',
              type: 'warning'
          });
          return false
      }
      api.getInfoByUserName(this.user.userName).then((res) => {
        let result = res.data;
        if (!res.error || 'string' != typeof res.data) {
          for (let i in this.user) {
            if (i !== 'name') {
              this.user[i] = result[i]
            }
          }
        } else {
          this.$message({
            message: '未查找到该管理员信息，请先添加管理员！',
            type: 'warning'
          });
        }
      })
    }
  },

  computed: mapState({
    // user: state => state.user.admin_info
  }),
  created() {},
  watch: {
    "user" (news, old) {
      //console.log(news)
    }
  },
}

</script>
