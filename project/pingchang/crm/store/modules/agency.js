import api from '@/api'

export default {
  state: {

  },
  mutations: {
  },
  actions: {
    postAdmissionBase({commit}, params){
      return api.agency.postAdmissionBase(params)
      .then(res=>res)
      .catch(err=>err)
    }
  }
}
