import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'


export default {
  state: {
    roleList: []
  },
  mutations: {
    ROLE_LIST(state, data) {
      state.roleList = data.list
    }
  },
  actions: {
    getRoleList({ commit }, parames) {
      api.getRoleList(parames).then((res) => {
        commit(types.ROLE_LIST, res.data)
      })
    }
  }
}
