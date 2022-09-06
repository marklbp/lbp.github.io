<template>
  <el-container class="layout">
    <sidebar />
    <el-container class="layout-main">
      <headerbar />
      <el-main><router-view class="el-main-inner"/></el-main>
    </el-container>
  </el-container>
</template>
<script>
import Headerbar from './headerbar'
import Sidebar from './sidebar'
export default {
  name: 'layout',
  components: {
    Headerbar,
    Sidebar
  }
}
</script>
<style scoped lang="scss">
.layout {
  height: 100%;
  &-main {
    flex-direction: column;
    background-color: $--global-bg;
    /deep/ .el-main {
      display: flex;
      padding-top: 26px;
      &-inner {
        flex: 1;
        width: 100%;
        min-width: 960px;
        &:after {
          content: '';
          width: 100%;
          height: 24px;
          display: block;
        }
      }
    }
  }
}
</style>
