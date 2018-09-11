<template>
  <Layout  :layout="layout"/>
</template>
<script>

import Layout from './layout.vue'
export default {
    data(){
      return {
        layout: {
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
