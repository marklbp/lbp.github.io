import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'


export default {
  state: {
    lists: [],
    orgList: []
  },
  mutations: {
    ORG_LIST(state, data) {
      state.lists = [data]
    },
    ORG_ALL_LIST(state, data) {
      state.orgList = [data]
    }
  },
  actions: {
    getOrgList({ commit }, param) {
      api.getOrgList(param).then((res) => {
        commit(types.ORG_LIST, res.data)
      })
    },
    getAllOrgList({ commit }, parames) {
      api.getOrgChildren(parames).then((res) => {
        commit(types.ORG_ALL_LIST, res.data)
      })
    }
  }
}
