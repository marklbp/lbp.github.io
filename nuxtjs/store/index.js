import axios from 'axios'

export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    //debugger;
    console.log(req.headers.cookie)
    let cookie, usernameIndex, username;
    if (req.session && req.session.authUser) {
      username = req.session.authUser;
    }
    if(req.headers.cookie && (usernameIndex = req.headers.cookie.indexOf('username')) > -1){
      cookie = req.headers.cookie.indexOf(";", usernameIndex);
      cookie = req.headers.cookie.substring(usernameIndex, cookie > -1 ? cookie : req.headers.cookie.length);
      username = cookie.replace(/.+=(.+)/,"$1");
    }
    if(username){
      commit('SET_USER', {username})
    }
  },
  async login({ commit }, { username, password }) {
    try {
      const { data } = await axios.post('/api/login', { username, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    await axios.post('/api/logout');
    commit('SET_USER', null)
  }

}