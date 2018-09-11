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
    SP_LIST(state, data) {
      state.lists = data
    },
    SP_DETAIL(state, data) {
      state.lists = data
    },
    SP_ADD: (state) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', null);
    },
    SP_PUT: (state) => {
      Vue.set(state.put, 'success', false);
      Vue.set(state.put, 'failure', null);
    },
    SP_ADD_SUCCESS: (state) => {
      Vue.set(state.add, 'success', true);
    },
    SP_ADD_FAILURE: (state, data) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', data);
    },
  },
  actions: {
    getSpListCode({ commit }, parames) {
      api.fetchSpList(parames).then((res) => {
        let result = res.data[0];
        commit(types.SP_LIST, result)
      })
    },
    getSpList({ commit }, parames) {
      api.fetchSpList(parames).then((res) => {
        commit(types.SP_LIST, res.data)
      })
    },
    getSpDetail({ commit }, parames) {
      api.getSpDetail(parames).then((res) => {
        let result = res.data;
        commit(types.SP_LIST, result)
      })
    },
    postSpAdd({ commit }, data) {
      api.postSp(data).then((res) => {
        commit(types.SP_ADD_SUCCESS)
      })
    },
    putSp({ commit }, data) {
      api.putSp(data).then((res) => {
        commit(types.SP_PUT)
      })
    }
  }
}
