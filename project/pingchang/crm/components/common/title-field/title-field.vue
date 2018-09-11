<template>
  <div class="title-field">
    <div class="pch-field">
      <div class='legend'>
        <span class="leg-line"></span>
        <slot name='title'></slot>
      </div>
      <div class="pch-field-box">
        <slot name='con'></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" >
@import "./title-field.scss";
</style>
<script>
export default {
  name: 'TitleField',
  created() {},
  watch: {}
}
</script>
