import Vue from 'vue';
import VeeValidate, {Validator} from 'vee-validate';

Vue.use(VeeValidate, {
  locale: 'zh_CN',
  dictionary: {
    zh_CN: {
      messages: {
        email: field => `请输入有效的${field}`,
        required: field => "请输入" + field
      },
      attributes: {
        email: '邮箱',
        password: '密码',
        phone: '手机号',
        code: '验证码',
      }
    }
  }
}); 

let rules = {
  'phone': {
    getMessage: field => '请输入有效手机号',
    validate: value => /^1[3|4|5|7|8]\d{9}$/.test(value)
  },
  'code': {
    getMessage: field => '请输入有效验证码',
    validate: value => !!value
  }
}

Object.keys(rules).forEach(k => Validator.extend(k, rules[k]));

