import X from './stores/x'
export default {
  demo: {
    namespaced: true,
    state: {
      test: 1,
      ...X.state
    },
    mutations: {
      setTest(state, data) {
        state.test = data
        console.log('demo mutation->setTest', data)
      },
      ...X.mutations
    },
    actions: {
      setTest({ commit }, data) {
        commit('setTest', data)
      },
      ...X.actions
    }
  }
}
