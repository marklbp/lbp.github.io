import { get } from '@/services/request.js'
const state = {
}

const mutations = {
}

const actions = {
  getExplosionList ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  },
  getExplosionDetail ({commit}, payload) {
    return get('').then(res => {
      return res
    })
  }
}

export default {
  state,
  actions,
  mutations
}
