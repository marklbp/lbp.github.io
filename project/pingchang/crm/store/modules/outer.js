import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'


export default {
  state: {
    apply: {
      lists: []
    }
  },
  mutations: {
    OUTER_APPLY_DETAIL(state, data) {
      state.apply.lists = data
    }
  },
  actions: {
    getOuterApplyDetail({ commit }) {
      api.fetchList().then((res) => {
        commit(types.OUTER_APPLY_DETAIL, res.list)
      })
    }
  }
}
