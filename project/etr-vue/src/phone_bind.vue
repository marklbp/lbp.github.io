<template>
  <form class="page-phone-bind" @submit.prevent="phoneBind">
    <md-field>
      <md-input-item
        name="phone"
        placeholder="请输入手机号"
        clearable
        v-model="phone"
        v-validate="'required'"></md-input-item>
    </md-field>
    <md-field>
      <md-input-item
        name="code"
        placeholder="请输入验证码"
        clearable
        v-model="code"
        v-validate="'required'"></md-input-item>
        <span class="btn-get-code">获取验证码</span>
    </md-field>
    <div class="btn-bind"><md-button @click="phoneBind">绑&nbsp;&nbsp;&nbsp;&nbsp;定</md-button></div>
  </form>
</template>

<script>
import {InputItem, Field, Button} from 'mand-mobile'
import './plugins/validate'
export default {
  name: 'phone-bind',
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Button.name]: Button
  },
  data () {
    return {
      phone: '',
      code: ''
    }
  },
  methods: {
    phoneBind () {}
  }
}

</script>

<style lang="scss" scoped>
  .page-phone-bind {
    padding-top: 12px;
  }
  .btn-bind {
    margin-top: 73px;
    margin-left: 55px;
    margin-right: 55px;
    .md-button {
      height: 88px;
      line-height: 88px;
      border-radius: 10px;
      background-color: #4B9EEA;
    }
  }
  .md-field {
    position: relative;
    ~.md-field {
      margin-top: 1px;
    }
    :global(.md-field-content) {
      :global(.md-input-item-container) {
        &:before {
          display: none;
        }
      }
    }
    .btn-get-code {
      position: absolute;
      right: 32px;
      top: 26px;
      width: 163px;
      height: 47px;
      line-height: 47px;
      border: 1px solid #4B9EEA;
      border-radius: 6px;
      color: #4B9EEA;
      text-align: center;
      font-size: 25px;
    }
  }
</style>