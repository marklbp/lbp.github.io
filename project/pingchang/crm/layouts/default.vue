<template>
    <Layout :mc="mc"/>
</template>
<script>
    import Layout from './layout.vue'

    export default {
        data() {
            return {
                mc: {
                    showSidebar: true,
                    showHeader: true,
                    showBreadcrumb: true,
                    showFooter: false,
                }
            }
        },
        components: {
            Layout
        }
    }
</script>
