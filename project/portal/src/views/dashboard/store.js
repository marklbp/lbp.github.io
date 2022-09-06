export default {
  dashboard: {
    namespaced: true,
    state: {
      reset: false,
      stopRoll: false
    },
    mutations: {
      setReset(state, data) {
        state.reset = data
      },
      setStopRoll(state, data) {
        state.stopRoll = data
      }
    }
  }
}
