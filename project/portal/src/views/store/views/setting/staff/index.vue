<template>
  <div>
    <!-- UI 要求去掉
    <router-back :disable-route="true" text="成员权限" />-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺成员" name="member">
        <handle-staff v-if="isShow"></handle-staff>
      </el-tab-pane>
      <el-tab-pane label="店铺角色" name="role">
        <div>
          <handle-role v-if="!isShow"></handle-role>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  components: {
    /* routerBack: _ => import('~/components/router-back'), // UI 要求去掉 */
    handleStaff: _ => import('./handle-staff'),
    handleRole: _ => import('./handle-role')
  },
  data() {
    return {
      activeName: 'member',
      isShow: true
    }
  },
  methods: {
    handleClick(tab) {
      const { path, query } = this.$route
      this.$router.push({
        path,
        query: {
          taskTab: tab.name
        }
      })
      if (tab.name == 'member') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  },
  created() {
    const { query, path } = this.$route
    this.activeName = query.taskTab || 'member'
    this.$router.push({
      path,
      query: {
        taskTab: this.activeName
      }
    })
    if (this.activeName == 'member') {
      this.isShow = true
    } else {
      this.isShow = false
    }
  }
}
</script>
<style lang="scss" scoped src="./staff.scss" />
