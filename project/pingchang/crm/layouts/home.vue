<template>
  <Layout  :mc="mc"/>
</template>
<script>

import Layout from './layout.vue'
export default {
    data(){
      return {
        mc: {
          showSidebar: true,
          showHeader: true,
          showBreadcrumb: false,
          showFooter: false
        }
      }
    },
    components: {
      Layout
    }
}
</script>