<template>
  <div class="icon">
    <ul>
      <li v-for="name in iconNames" :key="name">
        <span :class="`font-icon ${name}`"></span>
        <br />
        <i>{{ name }}</i>
      </li>
    </ul>
  </div>
</template>

<script>
const iconNames = require('./icon.json')
export default {
  name: 'icon',
  // components: {},
  // props: {},
  data() {
    return {
      iconNames
    }
  },
  // created() {},
  mounted() {},
  methods: {}
  // computed: {},
  // watch: {},
  // beforeDestory(){}
}
</script>

<style lang="scss" scoped>
.icon {
  padding: 20px;
  ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      width: 100px;
      height: 90px;
      text-align: center;
      span {
        font-size: 20px;
      }
      &:hover {
        color: #36f;
        background: #eee;
      }
    }
  }
}
</style>
