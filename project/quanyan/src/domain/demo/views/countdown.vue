<template lang="html">
  <div class="count-down">
    <count-down :startTime="Date.now() - 300000" :format="'HH:MM:ss'" :systemTime="Date.now() + 60000" :duration="600000"></count-down>
  </div>
</template>

<script>
import countDown from '@/components/count-down'

export default {
  components: { countDown }
}
</script>

<style scoped>
.count-down {
  font-size: 100px;
  color: green;
  text-align: center;
}

</style>
