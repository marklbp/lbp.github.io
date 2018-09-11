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
    GUARANTOR_LIST(state, data) {
      state.lists = data.list
    },
    GUARANTOR_DETAIL(state, data) {
      state.lists = data
    },
    GUARANTOR_ADD: (state) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', null);
    },
    GUARANTOR_PUT: (state) => {
      Vue.set(state.put, 'success', false);
      Vue.set(state.put, 'failure', null);
    },
    GUARANTOR_ADD_SUCCESS: (state) => {
      Vue.set(state.add, 'success', true);
    },
    GUARANTOR_ADD_FAILURE: (state, data) => {
      Vue.set(state.add, 'success', false);
      Vue.set(state.add, 'failure', data);
    },
  },
  actions: {
    getGuarantorListCode({ commit }, parames) {
      api.fetchGuarantorList(parames).then((res) => {
        let result = res.data[0];
        commit(types.GUARANTOR_LIST, result)
      })
    },
    getGuarantorList({ commit }, parames) {
      api.fetchGuarantorList(parames).then((res) => {
        commit(types.GUARANTOR_LIST, res.data)
      })
    },
    getGuarantorDetail({ commit }, parames) {
      api.getGuarantorDetail(parames).then((res) => {
        let result = res.data;
        commit(types.GUARANTOR_LIST, result)
      })
    },
    postGuarantorAdd({ commit }, data) {
      api.postGuarantor(data).then((res) => {
        commit(types.GUARANTOR_ADD_SUCCESS)
      })
    },
    putGuarantor({ commit }, data) {
      api.putGuarantor(data).then((res) => {
        commit(types.GUARANTOR_PUT)
      })
    }
  }
}
