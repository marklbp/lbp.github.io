<template>
  <knowledge-list />
</template>
<script>
export default {
  name: 'storeKnowledgeList',
  components: {
    'knowledge-list': _ => import('~/components/knowledge-list')
  }
}
</script>
<style lang="scss"></style>
