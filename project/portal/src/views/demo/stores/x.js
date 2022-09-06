export default {
  state: {
    x: 'This is demo-x page'
  },
  mutations: {
    setX(state, v) {
      state.x = v
    }
  },
  actions: {
    setX({ commit }, v) {
      commit('setX', v)
    }
  }
}
