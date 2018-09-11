import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'

function getParames(parames){
  if(!parames)parames = {};
  if(process.browser && !parames.ownerId){
    let search = location.search.substring(1);
    let ownerId = parames.ownerId || '';
    //let parentId = parames.parentId || '';
    if(search.length > 0){
      ownerId = search.replace(/.*ownerId=(\d+).*/,'$1') || ownerId;
      //parentId = search.replace(/.*buttonId=(\d+).*/,'$1') || parentId;
    }
    parames.ownerId = ownerId;
    //parames.parentId = parentId
  }
  return parames;
}

export default {
  state: {
    lists: [],
    orgList: [],
    roleList:[]
  },
  mutations: {
    ORG_LIST_EXT(state, data) {
      state.lists = [data]
    },
    ORG_ALL_LIST_EXT(state, data) {
      state.orgList = [data]
    },
    ROLE_LIST_EXT(state, data) {
      state.roleList = data.list
    }
  },
  actions: {
    getOrgList_ext({ commit }) {
      api.getOrgList_ext().then((res) => {
        commit(types.ORG_LIST_EXT, res.data)
      })
    },

    getAllOrgList_ext({ commit }, parames) {
      /*if (process.browser) {
        let ownerId = window.localStorage.getItem('ownerId'),
          resultParames = {},
          obj = { ownerId: ownerId };
        resultParames = parames ? Object.assign(parames, obj) : obj

        api.getOrgChildren_ext(resultParames).then((res) => {
          commit(types.ORG_ALL_LIST_EXT, res.data)
        })
      }*/
      //debugger;
      parames = getParames(parames);
      api.getOrgChildren_ext(parames).then((res) => {
        commit(types.ORG_ALL_LIST_EXT, res.data)
      })
    },
    getRoleList_ext({ commit }, parames) {
      /*if (process.browser) {
        let ownerId = window.localStorage.getItem('ownerId'),
          resultParames = {},
          obj = { ownerId: ownerId };

        resultParames = parames ? Object.assign(parames, obj) : obj

        api.getRoleList_ext(resultParames).then((res) => {
          commit(types.ROLE_LIST_EXT, res.data)
        })
      }*/
      parames = getParames(parames);
      api.getRoleList_ext(parames).then((res) => {
        commit(types.ROLE_LIST_EXT, res.data)
      })
    }
  }
}
