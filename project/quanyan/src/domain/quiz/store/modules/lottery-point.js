import { get, post } from '@/services/request.js'
const state = {
}

const mutations = {
}

const actions = {
  getMyLotteryPointManageModel ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  },
  getApplyLotteryPointManageModel ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  },
  getLotteryPointRecordModel ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  },
  getLotteryPointDetailModel ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  },
  applyLotteryPoint ({commit}, payload) {
    return post('')
  },
  exchangePointToBalance ({commit}, payload) {
    return post('')
  },
  exchangeBalanceToPoint ({commit}, payload) {
    return post('')
  }
}

export default {
  state,
  actions,
  mutations
}
