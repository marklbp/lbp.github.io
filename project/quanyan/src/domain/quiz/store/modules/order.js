
const state = {
  defaultOption: {
    state: 0,
    pageNo: 0
  },
  selectOrderRecordIndex: 0
}

const mutations = {
}

const actions = {
  saveSelectTabIndex ({commit}, payload) {
    state.selectOrderRecordIndex = payload.selectTabIndex
  },
  getSelectTabIndex ({commit}, payload) {
    return state.selectOrderRecordIndex
  }
}

export default {
  state,
  actions,
  mutations
}
