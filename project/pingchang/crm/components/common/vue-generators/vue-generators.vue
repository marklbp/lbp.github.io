<template>
  <div class="vue-generators">
    <el-form :inline="true" :model="modelData" label-position="right" label-width='130px' data-vv-scope="sss">
      <el-row :gutter="24">
        <!-- :data-vv-scope="item.scope" -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-for='(item, index) in formData' :key='index' :style='{width:item.type === "textarea"?"100%":""}'>
          <!-- input -->
          <el-form-item :label="item.label" :for="item.name" :class="{ 'vee-control': true }" v-if="item.type === 'input'">
            <el-input v-model='item.model' placeholder="请输入内容" class="input-with-select" :disabel="item.disabel" :class="{'input': true,'is-danger': errors.has(`${item.name}`) }" :name='item.name' v-validate="'required'">
            </el-input>
            <span v-show="errors.has(`${item.name}`)" class="help is-danger">{{ errors.first(`${item.name}`) }}</span>
          </el-form-item>
          <!-- inp -->
          <el-form-item :label="item.label" :for="item.name" :class="{ 'vee-control': true }" v-if="item.type === 'select'">
            <el-select clearable v-model='item.model' placeholder="请选择" :disabel="item.disabel" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(`${item.name}`) }" :name='item.name'>
              <el-option v-for="list in item.options" :key="list.value" :label="list.label" :value="list.value"></el-option>
            </el-select>
            <span v-show="errors.has(`${item.name}`)" class="help is-danger">{{ errors.first(`${item.name}`) }}</span>
          </el-form-item>
          <!--日期-->
          <el-form-item :label="item.label" :for="item.name" :class="{ 'vee-control': true }" v-if="item.type === 'date'">
            <el-date-picker value-format="yyyy-MM-dd" :editable=false v-model='item.model' type="date" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(`${item.name}`) }" :name='item.name' :placeholder="item.label"></el-date-picker>
            <span v-show="errors.has(`${item.name}`)" class="help is-danger">{{ errors.first(`${item.name}`) }}</span>
          </el-form-item>
          <!-- 单选 -->
          <el-form-item :label="item.label" :for="item.name" :class="{ 'vee-control': true }" v-if="item.type === 'radio'">
            <el-radio v-model='item.model' v-for='(list,index) in item.val' :key="index" :label="list.key" v-validate="'required|in:0,1'">{{list.val}}</el-radio>
          </el-form-item>
          <!-- 文本域 -->
          <el-form-item :label="item.label" class="gen-textarea" :for="item.name" :class="{ 'vee-control': true }" v-if="item.type === 'textarea'">
            <el-input type="textarea" :rows="4" v-model='item.model' placeholder="请输入内容" class="input-with-select" :disabel="item.disabel" :class="{'input': true,'is-danger': errors.has(`${item.name}`) }" :name='item.name' v-validate="'required'">
            </el-input>
            <span v-show="errors.has(`${item.name}`)" class="help is-danger">{{ errors.first(`${item.name}`) }}</span>
          </el-form-item>
        </el-col>
        <slot name="pch-modal-footer"></slot>
      </el-row>
      <!-- <p class="control has-icon has-icon-right">
        <input name="name" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
        <i v-show="errors.has('name')" class="fa fa-warning"></i>
        <span v-show="errors.has('name')" class="help is-danger">1313231312332312</span>
      </p> -->
    </el-form>
  </div>
</template>
<style lang="scss">
@import "./vue-generators.scss"

</style>
<script>
import Vue from 'vue'
import { Validator } from 'vee-validate'
import { mapState } from 'vuex'
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
      test: '资方名称'
    }
  }
};
Validator.localize(dictionary);
// validator.detach('test');

export default {
  props: {
    formData: {
      type: Array,
      default: () => [{
        type: 'input',
        label: '',
        name: '',
        className: '',
        data: '111',
        model: '',
        scope: '',
        disabel: false,
        defaultTip: ''
      }]
    },
    modelData: {
      type: Object
    }
  },
  methods: {
    onValidate() {
      this.$validator.validateAll();
    },
    onClear() {
      this.errors.clear();
    }
  },
  computed: mapState({
    user: state => state.global.admin_info
  }),
  created() {},
  // methods: {
  //   validateChild() {
  //     Vue.$emit('validate');
  //   },
  //   clearChild() {
  //     Vue.$emit('clear');
  //   }
  // },
  // created() {
  //   Vue.$on('errors-changed', (errors) => {
  //     this.errors.clear();
  //     errors.forEach((e) => {
  //       this.errors.add(e.field, e.msg, e.rule, e.scope);
  //     });
  //   });
  // },
  watch: {
    "user" (news, old) {
      //console.log(news)
    }
  },
}

/*

[{
          type: 'input',
          label: '登录名',
          name: 'test',
          data: '111',
          model: '4',
          scope: '5',
          disabled:true,
          defaultTip: '7'
        }, {
          type: 'select',
          label: '姓名',
          name: 'test1',
          className: '3',
          data: '111',
          model: '4',
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          scope: '5',
          defaultTip: '7'
        }, {
          type: 'date',
          label: '1',
          name: 'test4',
          className: '3',
          data: '111',
          model: '4',
          scope: '5',
          defaultTip: '7'
        }, {
          type: 'radio',
          label: '姓名',
          name: 'test2',
          className: '3',
          data: '111',
          model: '4',
          scope: '5',
          val: [{ key: 1, val: '有效' }, { key: 0, val: '无效' }],
          defaultTip: '7'
        },
        {
          type: 'textarea',
          label: '1',
          name: 'test3',
          className: '3',
          data: '111',
          model: '4',
          scope: '5',
          defaultTip: '7'
        }
      ]
 */

</script>
