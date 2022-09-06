<template>
  <div>
    <router-back :disable-route="true" text="店铺信息" />
    <p>主体内容</p>
  </div>
</template>
<script>
export default {
  name: 'store-profile',
  components: {
    'router-back': _ => import('~/components/router-back')
  }
}
</script>
