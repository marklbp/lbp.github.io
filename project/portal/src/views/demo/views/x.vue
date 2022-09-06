<template>
  <div>{{ x }}</div>
</template>
<script>
export default {
  name: 'demo-x',
  computed: {
    ...Vuex.mapState({
      x: 'demo/x'
    })
  },
  mounted() {
    this.setX('reset demo-x value')
    console.log(this.$store.state.demo.x, this.x)
  },
  methods: {
    ...Vuex.mapActions({ setX: 'demo/setX' })
  }
}
</script>
