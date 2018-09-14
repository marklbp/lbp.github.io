import { get } from '@/services/request.js'
const state = {
  defaultOption: {
    state: 0,
    pageNo: 0
  }
}

const mutations = {
}

const actions = {
  getGuessDetailModel ({commit}, payload) {
    let recordId = payload.recordId
    return get('lotterycenter.getUserBuyRecordDetail', {recordId}).then(res => {
      return res
    })
  }
}

export default {
  state,
  actions,
  mutations
}
