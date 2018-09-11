<template>
    <Layout  :mc="mc"/>
</template>
<style type="text/css">
    .org-container{
      padding-top: 0 !important;
    }
</style>
<script>
    import Layout from './layout.vue'

    export default {
        data() {
            let showSaasSidebar = this.$route.path.indexOf('saas')!==-1
            return {
              mc: {
                  private: true,
                  showSidebar: true,
                  showHeader: false,
                  showBreadcrumb: true,
                  showFooter: false,
                  flag: true,
                  showSaasSidebar: showSaasSidebar
              }
            }
        },
        components: {
            Layout
        }
    }

</script>
