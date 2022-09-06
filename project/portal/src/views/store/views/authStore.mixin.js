export default {
  methods: {
    authStore({ storeId, storeList }) {
      if (!storeId || !storeList) return
      const store = storeList.find(
        val => parseInt(val.id, 10) === parseInt(storeId, 10)
      )
      let bzCode = store && store.bzCode
      if (bzCode) {
        return this.$api
          .authStore({
            shopId: bzCode,
            appCode: 'portal'
          })
          .then(res => {
            if (res.status !== 20000) {
              throw new Error(res.message)
            }
            return res.data
          })
      }
    }
  }
}
