<template>
  <div id='Header'>
    <el-menu :default-active="activeIndex2" class="pch-header" mode="horizontal" @select="handleSelect">
      <!-- <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu> -->
      <el-submenu index="3">
        <template slot="title"><span>{{realName}}</span></template>
        <el-menu-item index="3-1" @click="logout">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
/*import api from '@/api'*/
import Storage from '@/plugins/storage'
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      realName: '管理员'
    };
  }
  ,computed: {
    ...mapGetters(['admin'])
  }
  ,created(){
    let admin = Storage.get('admin');
    this.realName = (this.admin && this.admin.realName) || (admin &&  admin.realName) || this.realName
  }
  ,methods: {
    handleSelect(key, keyPath) {
    },
    logout() {
      this.$store.dispatch("signOut").catch(err=>err).finally(()=>{this.redirectToLogin()});
    },
    /**
   * 未登陆跳转到登陆页
   * 1. 匹配包含域名pingchang666才跳转，否则不处理
   * 2. 替换当前系统关键字成login，例如贷前daikuan->login
   * @return {[type]} [description]
   */
  redirectToLogin() {
    let _host = location.host;
    if(_host.indexOf('pingchang666') == -1){
      this.$router.replace('/auth/sign-in')
      return;
    }

    _host = _host.replace('erp', 'login');
    if (process.browser) location.href = '//' + _host + '/#/account/' + encodeURIComponent(location.href);
    // this.$router.replace('/auth/sign-in')
  }
  }
  ,watch: {
    '$store.state.admin': function(n){
      this.realName = n && n.realName
    }
  }
}

</script>
<style lang="scss">
@import "./Header.scss"

</style>
