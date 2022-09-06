<template>
  <task-filter type="store" :has-store="true"/>
</template>
<script>
export default {
  name: 'store-task',
  components: {
    'task-filter': _ => import('~/components/task-filter')
  }
}
</script>