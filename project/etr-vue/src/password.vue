<template>
  <form class="page-phone-bind" @submit.prevent="submit">
    <md-field>
      <md-input-item
        type="password"
        name="password"
        placeholder="请设置6-20登录密码"
        clearable
        v-model="password"
        v-validate="'required'"
      ></md-input-item>
      <md-input-item
        type="password"
        name="password2"
        placeholder="请再次输入密码"
        clearable
        v-model="password2"
        v-validate="'required'"
        ></md-input-item>
    </md-field>
    <div class="btn-bind"><md-button @click="submit">确&nbsp;&nbsp;&nbsp;&nbsp;定</md-button></div>
  </form>
</template>

<script>
import {InputItem, Field, Button} from 'mand-mobile'
import './plugins/validate'
export default {
  name: 'password',
  components: {
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [Button.name]: Button
  },
  data () {
    return {
      password: '',
      password2: ''
    }
  },
  methods: {
    submit () {}
  }
}

</script>

<style lang="scss" scoped>
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
</style>