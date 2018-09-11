import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'



export default {
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user || null
    }

  },
  actions: {

  },
  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
    loggedUser(state) {
      return state.user
    }
  }
}
