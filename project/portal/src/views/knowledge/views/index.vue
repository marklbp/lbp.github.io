<template>
  <knowledge-list type="global" />
</template>
<script>
export default {
  name: 'knowledgeList',
  components: {
    'knowledge-list': _ => import('~/components/knowledge-list')
  }
}
</script>
<style lang="scss"></style>
