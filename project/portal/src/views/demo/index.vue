<template>
  <div>
    This is a demo.
    <tools v-model="toolVal" />
  </div>
</template>
<script>
export default {
  name: 'demo',
  data() {
    return {
      toolVal: '1,3,6'
    }
  },
  created() {
    this.get()
    this.post()
    this.ajax()
    this.$store.dispatch('demo/setTest', 'demo view')
  },
  components: {
    tools: _ => import('~/components/tools')
  },
  mounted() {},
  methods: {
    get() {
      this.$api.demo
        .get({ paramKey: 1 })
        .then(r => {
          // 只关注业务成功状态，即code === 0，无需再判断成功状态，直接处理数据
        })
        .catch(e => {
          // 只关注失败状态，即code !== 0
        })
    },
    post() {
      this.$api.demo
        .post(
          {
            paramKey: 2,
            id: 3
          },
          {
            needToast: false /*关闭全局错误提示标识*/,
            headers: {
              /*请求头headers也可以在此处传入*/
            }
          }
        )
        .then(r => {
          // 只关注业务成功状态，即code === 0
        })
        .catch(e => {
          // 只关注失败状态，即code !== 0
        })
    },
    async ajax() {
      let res
      try {
        res = await this.$api.demo.post({ paramKey: 4, id: 5 })
        // 只关注业务成功状态，即code === 0，无需再判断成功状态，直接处理数据
      } catch (e) {
        console.log('Error', e)
      }
    }
  }
}
</script>
