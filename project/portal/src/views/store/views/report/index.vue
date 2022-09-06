<template>
  <div>
    <router-back :disable-route="true" text="数据报表" />
  </div>
</template>
<script>
export default {
  name: 'store-report',
  components: {
    'router-back': _ => import('~/components/router-back')
  }
}
</script>
