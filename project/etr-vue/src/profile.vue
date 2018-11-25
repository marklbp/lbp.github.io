<template>
  <form class="page-profile">
    <md-field>
      <md-field-item
        class="avatar"
        name="avatar"
        title="个人头像"
        arrow="arrow-right"
        solid
        align="right"
        @click="">
        <div class="cover"><img src="./assets/img/me-portrait.png"></div>
      </md-field-item>
    </md-field>
    <md-field>
      <md-field-item
        name="realname"
        title="姓名"
        arrow="arrow-right"
        :value="realname"
        solid
        align="right"
        @click="">
      </md-field-item>
    </md-field>
    <md-field>
      <md-field-item
        name="phone"
        title="手机"
        arrow="arrow-right"
        :value="phone"
        solid
        align="right"
        @click="$router.push('/phone-bind')"
        @touchend.prevent="$router.push('/phone-bind')">
      </md-field-item>
    </md-field>
    <md-field>
      <md-field-item
        name="wx"
        title="微信"
        arrow="arrow-right"
        :value="wx"
        solid
        align="right"
        @click="">
      </md-field-item>
    </md-field>
    <md-field>
      <md-field-item
        name="password"
        title="密码"
        arrow="arrow-right"
        :value="password"
        solid
        align="right"
        @click="$router.push('/password')">
      </md-field-item>
    </md-field>
    <md-field class="margin-top-20">
      <md-field-item
        name="company"
        title="公司"
        arrow="arrow-right"
        :value="company"
        solid
        align="right"
        @click="$router.push('/my-company')">
      </md-field-item>
    </md-field>
    <md-field>
      <md-field-item
        name="job"
        title="职位"
        arrow="arrow-right"
        :value="job"
        solid
        align="right"
        @click="">
      </md-field-item>
    </md-field>
  </form>
</template>
<script>
  import {Icon, Popup, PopupTitleBar, DatePicker, Field, FieldItem, InputItem, Dialog} from 'mand-mobile'
  export default {
    name: 'profile',
    beforeRouteEnter (now, prev, next) {
      if (!localStorage.login) return next ('/login')
      next()
    },
    components: {
      [DatePicker.name]: DatePicker,
      [Field.name]: Field,
      [FieldItem.name]: FieldItem,
      [InputItem.name]: InputItem,
      [Popup.name]: Popup,
      [PopupTitleBar.name]: PopupTitleBar,
      [Icon.name]: Icon,
      [Dialog.name]: Dialog
    },
    data () {
      return {
        avatar: '',
        realname: '',
        phone: '',
        wx: '',
        password: '',
        company: '',
        job: ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .md-field {
    margin-bottom: 2px;
  }
  .avatar {
    .cover {
      overflow: hidden;
      width: 130px;
      height: 130px;
      img {
        width: 100%;
      }
    }
  }
  .margin-top-20 {
    margin-top: 20px;
  }
</style>