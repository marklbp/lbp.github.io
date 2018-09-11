import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'

export default {
  state: {
    admin_info: {
      userName: '',
      realName: '',
      idNumber: '',
      sex: '',
      birthday: '',
      email: '',
      status: '0',
      remark: ''
    },
    userInfo: {
      oldUserName:'',
      newUserName:'',
      organizationId:''
    },
  },
  mutations: {
    ADMIN_INFO: (state, data) => {
      state.admin_info = data
      if (state.admin_info.status == '') {
        state.admin_info.status = '0'
      }
    },
    CLEAN_ADMIN_INFO: (state, data) => {
      state.admin_info = {
        userName: '',
        realName: '',
        idNumber: '',
        sex: '',
        birthday: '',
        email: '',
        status: '0',
        remark: ''
      }
    },
    GET_ADMIN_INFO: (state, data) => {
      for (let i in state.admin_info) {
        state.admin_info[i] = data[i]
      }
      if (state.admin_info.status == '') {
        state.admin_info.status = '0'
      }
    },
    SET_ADMIN_INFO: () => {
      // /crm/user/modifyAdmin
    }
  },
  actions: {
    getInfoByUserName({ commit }, parames) {
      api.getInfoByUserName(parames).then((res) => {
        let result = res.data;
        if (result) {
          commit(types.GET_ADMIN_INFO, result)
        }
      })
    },
    modifyAdmin({ commit }, parames) {
      api.modifyAdmin(parames).then((res) => {
        // commit(types.SP_ADD_SUCCESS)
      })
    },
    getAdminByOrgId({ commit }, parames) {
      api.getAdminByOrgId(parames).then((res) => {
        // commit(types.SP_ADD_SUCCESS)
      })
    }
  }
}
