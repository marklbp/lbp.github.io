<template>
  <div class="vue-generators">
    <el-form :inline="true"  label-position="right" label-width='130px' data-vv-scope="sss">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="登录名" :class="{ 'vee-control': true }">
            <el-input :maxlength="255" v-model='user.userName' placeholder="请输入内容" class="input-with-select" disabel :class="{'input': true,'is-danger': errors.has('user.userName') }" name='user.userName' v-validate="'required'" disabled>
            </el-input>
            <span v-show="errors.has('user.userName')" class="help is-danger">{{ errors.first('user.userName') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="姓名" :class="{ 'vee-control': true }">
            <el-input :maxlength="255" v-model='user.realName' placeholder="请输入内容" class="input-with-select" :class="{'input': true,'is-danger': errors.has('user.realName') }" name='user.realName' v-validate="'required'">
            </el-input>
            <span v-show="errors.has('user.realName')" class="help is-danger">{{ errors.first('user.realName') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="身份证号码" :class="{ 'vee-control': true }">
            <el-input v-model='user.idNumber' placeholder="请输入内容" class="input-with-select" :class="{'input': true,'is-danger': errors.has('user.idNumber') }" name='user.idNumber' v-validate="'required|validid'">
            </el-input>
            <span v-show="errors.has('user.idNumber')" class="help is-danger">{{ errors.first('user.idNumber') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="性别" :class="{ 'vee-control': true }">
              <el-radio disabled v-model='user.sex' label="0">女</el-radio>
              <el-radio  disabled v-model='user.sex' label="1">男</el-radio>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="出生日期">
            <el-input v-model='user.birthday' class="input-with-select input" placeholder="出生日期" disabled name='user.birthday'>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="邮箱">
            <el-input :maxlength="64" name="email" :class="{'input': true,'is-danger': errors.has('email') }" v-model='user.email' placeholder="请输入内容" class="input-with-select" v-validate="'required|email'">
            </el-input>
            <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="机构">
            <el-input v-model='name2' disabled class="input-with-select input" name='name' placeholder="机构">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="角色">
            <el-input class="input-with-select"  disabled value="系统管理员">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item label="有效" :class="{ 'vee-control': true }">
            <el-radio v-model='user.status' label="0">是</el-radio>
            <el-radio v-model='user.status' label="1">无</el-radio>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="备注" class="gen-textarea">
            <el-input v-model='user.remark' placeholder="请输入内容" class="input-with-select" :class="{'input': true }" name='user.remark' type="textarea" :rows="4">
            </el-input>
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
import validID from "@/plugins/validID"
let vm = new Vue()
const dictionary = {
  zh_CN: {
    custom: {
      name: {
        // required: () => '请选择注册地址'
      },
      realName: {
        required: '请填写真实名'
      }
    },
    messages: {
      lender: {
        test: () => '请选择类型',
      }
    },
    attributes: {
      user:{
        "userName": "用户名",
        "realName": "姓名",
        "idNumber": "身份证号码",
        "sex": "性别",
        "birthday": "生日",
        "email": "邮箱",
        "status": "状态",
        "remark": "备注"
      }
    }
  }
};
Validator.extend('validid', {
  getMessage: ()=> '请输入有效身份证号码',
  validate: value => {
    let val = validID(value);
    if('string' == typeof val)return false;
    return true;
  }
})
Validator.localize(dictionary);

export default {
   props: {
    // url: String,
    user2: Object,
    name2: String,
  },
  data(){
    return {
      user: {
        "userName": undefined,
        "realName": undefined,
        "idNumber": undefined,
        "sex": "0",
        "birthday": undefined,
        "email": undefined,
        "status": "0",
        "remark": undefined
      }
    }
  },
  methods: {
    onValidate() {
      this.$validator.validateAll();
    },
    onClear() {
      this.errors.clear();
    },
    validID(v){
      v = validID(v.target.value);
      if('string' == typeof v){
        this.user.birthday = "";
        this.user.sex = ""
        return;
      }
      this.user.birthday = v.birth.join("-");

      this.user.sex = v.sex == "F" ? '0' : '1'
    }
  },
  created() {
    this.user = Object.assign({
        "userName": undefined,
        "realName": undefined,
        "idNumber": undefined,
        "sex": undefined,
        "birthday": undefined,
        "email": undefined,
        "status": "0",
        "remark": undefined
    },this.user2);
  },
  watch: {
    "user.idNumber" : function(news, old) {
      let v = validID(news);
      if('string' == typeof v){
        this.user.birthday = "";
        this.user.sex = ""
        return;
      }
      this.user.birthday = v.birth.join("-");
      this.user.sex = v.sex == "F" ? '0' : '1'
    }
  },
}
</script>
