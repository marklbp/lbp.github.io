<template>
  <form class="page-my-company" @submit.prevent="submit">
    <md-field>
      <md-input-item
        name="company"
        placeholder="请输入公司"
        clearable
        v-model="company"
        v-validate="'required'"
      ></md-input-item>
    </md-field>
    <div class="list"></div>
    <div class="btn-bind"><md-button @click="submit">确&nbsp;&nbsp;&nbsp;&nbsp;定</md-button></div>
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
      company: ''
    }
  },
  methods: {
    submit () {}
  }
}

</script>

<style lang="scss" scoped>
  .page-my-company {
    padding-top: 12px;
  }
  .md-field {
    margin-bottom: 20px;
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
</style>