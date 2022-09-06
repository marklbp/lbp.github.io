<template>
  <task-filter type="store"/>
</template>
<script>
export default {
  name: 'task',
  components: {
    'task-filter': _ => import('~/components/task-filter')
  }
}
</script>