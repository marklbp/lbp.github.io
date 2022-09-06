import modules from './custom'
export default {
  state: {
    collapsed: false,
    STORE_LIST: Vue.prototype.$cache.get('STORE_LIST', []),
    storeMenus: [], // 当前店铺授权菜单
    authData: {} // 当前店铺所有授权信息
  },
  mutations: {
    collapseMenu(state, collapsed) {
      state.collapsed = collapsed
    },
    setStoreList(state, data) {
      this._vm.$cache.set('STORE_LIST', data)
      state.STORE_LIST = data
    },
    saveStoreMenus(state, data) {
      state.storeMenus = data || []
    },
    saveAuthDate(state, data) {
      state.authData = data || {}
    }
  },
  actions: {
    toggleMenu({ commit }, collapsed) {
      commit('collapseMenu', collapsed)
    },
    setStoreList({ commit }, data) {
      commit('setStoreList', data)
    }
  },
  modules
}
