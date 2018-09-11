<template>
  <div>
    <div v-for="(item,index) in [1,2,3,4]" :key='index'>
      <div>{{index}}</div>
    </div>
  </div>
</template>
<style lang="scss">
@import "./group.scss"

</style>
