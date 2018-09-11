    import Vue from 'vue'
    import api from '@/api'
    import * as types from '@/store/mutation-types'
    import config  from '@/config/options'

    export default {
      state: {
        interview_Credentials_Type: [],
        company_Nature: [],
        contactType: [],
        lender_type: [],
        loan_type: [],
        company_type: [],
        agencyTypes: [
          {value: 20, name: '集团', en: 'group'}
          ,{value: 30, name: '经销商', en: 'agency'}
          ,{value: 10, name: '公司', en: 'company'}
        ],
        agencyTypesNames: {
          group: 20
          ,agency: 30
          ,company: 10
          ,store: 40
          ,shop: 50
        },
        taxPayerTypes: [],
        groups: []
      },
      mutations: {
        INTER_VIEW_CREDENTIALS_TYPE(state, data) {
          state.interview_Credentials_Type = data
        },
        COMPANY_NATURE(state, data) {
          state.company_Nature = data
        },
        CONTACT_TYPE(state, data) {
          state.contactType = data
        },
        LENDER_TYPE(state, data) {
          state.lender_type = data
        },
        LOAN_TYPE(state, data) {
          state.loan_type = data
        },
        COMPANY_TYPE(state, data) {
          state.company_type = data
        },
        SAVE_GROUPS_LIST(state, data){
          state.groups.splice(0, state.groups.length, ...data)
        }
        ,SAVE_TAX_TYPE(state, data){
          let length = state.taxPayerTypes.length;
          state.taxPayerTypes.splice(0, length, ...data)
        }
      },
      actions: {
        // 证件类型
        getInterview_Credentials_Type({ commit }, parames) {
          // api.getSelectList('Interview_Credentials_Type').then((res) => {
          //   let { data } = res;
          //   commit(types.INTER_VIEW_CREDENTIALS_TYPE, data)
          // })
          commit(types.INTER_VIEW_CREDENTIALS_TYPE, config.Interview_Credentials_Type)
        },
        getCompany_Nature({ commit }, parames) {
          // api.getSelectList('Company_Nature').then((res) => {
          //   let { data } = res;
          //   commit(types.COMPANY_NATURE, data)
          // })
          commit(types.COMPANY_NATURE, config.Company_Nature)
        },
        //联系人类型
        getContactType({ commit }, parames) {
          // api.getSelectList('ContactType').then((res) => {
          //   let { data } = res;
          //   commit(types.CONTACT_TYPE, data)
          // })
          commit(types.CONTACT_TYPE, config.ContactType)
        },
        getLender_Type({ commit }, parames) {
          // api.getSelectList('Lender_Type').then((res) => {
          //   let { data } = res;
          //   commit(types.LENDER_TYPE, data)
          // })
          commit(types.LENDER_TYPE, config.Lender_Type)
        },
        //进件类型
        getLoan_Type({ commit }, parames) {
          // api.getSelectList('Loan_Type').then((res) => {
          //   let { data } = res;
          //   commit(types.LOAN_TYPE, data)
          // })
          commit(types.LOAN_TYPE, config.Loan_Type)
        },
        //公司证件类型
        getCompany_type({ commit }, parames) {
          // api.getSelectList('Loan_Type').then((res) => {
          //   let { data } = res;
          //   commit(types.LOAN_TYPE, data)
          // })
          commit(types.COMPANY_TYPE, config.company_type)
        },
        getGroupsListByAgencyType({commit}){
          return api.agency.getGroupsListByAgencyType().then(res=>{
            if(res.error || !res.success.list || res.success.list.length <= 0)return;
            let data = res.success.list.map(item=>{
              return {
                name: item.name
                ,value: item.id
              }
            });
            commit("SAVE_GROUPS_LIST", data);
            return res
          })
          .catch(err=>err)
        }
        ,commonGetType({commit}, params){
          let mutation = params.mutation;
          return api.common.getType(params).then(res=>{
            if(res.error || res.success && res.success.length <= 0)return res;
            let taxPayerTypes = res.success.map(t=>{
              return {
                value: t.key,
                name: t.value
              }
            })
            commit(mutation, taxPayerTypes);
            return res
          }).catch(err=>err)
        }
      }
    }
