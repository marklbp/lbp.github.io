<template>
  <rich-text v-model="html" maxlength="1000" show-word-limit />
</template>
<script>
export default {
  name: 'rich-editor',
  components: {
    'rich-text': _ => import('~/components/rich-text')
  },
  data() {
    return {
      html: '写点什么'
    }
  },
  watch: {
    html(v) {
      console.log(v)
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
