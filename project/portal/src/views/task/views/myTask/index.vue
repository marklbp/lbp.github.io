<template>
  <task-filter type="global"/>
</template>
<script>
export default {
  name: 'task',
  components: {
    'task-filter': _ => import('~/components/task-filter')
  }
}
</script>