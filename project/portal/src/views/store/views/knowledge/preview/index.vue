<template>
  <knowledge-preview />
</template>
<script>
export default {
  name: 'knowledgePreview',
  components: {
    'knowledge-preview': _ => import('~/components/knowledge-list/preview')
  }
}
</script>
<style lang="scss"></style>
