import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'

export default {
  state: {
    lists: [],
    add: {
      success: false,
      failure: null,
    },
    put: {
      success: false,
      failure: null,
    }
  },
  mutations: {
    LENDER_LIST(state, data) {
      state.lists = data
    },
    LENDER_DETAIL(state, data) {
      state.lists = data
    },
    LENDER_ADD: (state) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', null);
    },
    LENDER_PUT: (state) => {
      Vue.set(state.put, 'success', false);
      Vue.set(state.put, 'failure', null);
    },
    LENDER_ADD_SUCCESS: (state) => {
      Vue.set(state.add, 'success', true);
    },
    LENDER_ADD_FAILURE: (state, data) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', data);
    }

  },
  actions: {
    getLenderListCode({ commit }, parames) {
      return api.fetchLenderList(parames).then((res) => {
        let result = res.data.list[0];
        commit(types.LENDER_LIST, result)
      })
    },
    getLenderList({ commit }, parames) {
      return api.fetchLenderList(parames).then((res) => {
        
        commit(types.LENDER_LIST, res.data.list)
      })
    },
    getLenderDetail({ commit }, parames) {
      return api.getLenderDetail(parames).then((res) => {
        let result = res.data;
        commit(types.LENDER_LIST, result)
      })
    },
    postLenderAdd({ commit }, data) {
      return api.postLender(data).then((res) => {
        commit(types.LENDER_ADD_SUCCESS)
      })
    },
    putLender({ commit }, data) {
      return api.putLender(data).then((res) => {
        commit(types.LENDER_PUT)
      })
    }
  }
}
