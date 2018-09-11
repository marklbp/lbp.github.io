import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'


export default {
    state: {
        pageData: {},
        lenderAgency: {},
        track: [],
        applyNumber: 0
    },
    mutations: {
        GET_REVIEW_ENTER(state, data) {
            state.pageData = data
            state.lenderAgency = data.lenderAgency
            state.applyNumber = data.lenderAgency.applyNumber
        },
        GET_REVIEW_ENTER_SS(state, data) {
            state.pageData = data
            state.lenderAgency = data.lenderStore
            state.applyNumber = data.lenderStore.applyNumber
        },
        GET_TRACK_APPROVAL(state, data) {
            data.reverse();
            state.track = data
        },
    },
    actions: {
        getLenderAgencyAudit({commit, dispatch}, params) {
            api.getLenderAgencyAudit(params).then((res) => {
                commit(types.GET_REVIEW_ENTER, res.data);
                dispatch('getTrackApproval',{applyNumber: res.data && res.data.lenderAgency && res.data.lenderAgency.applyNumber})
            })
        },
        getLenderAgencyAudit_ss({commit, dispatch}, params) {
            api.getLenderAgencyAudit_ss(params).then((res) => {
                commit(types.GET_REVIEW_ENTER_SS, res.data);
                dispatch('getTrackApproval',{applyNumber: res.data && res.data.lenderStore && res.data.lenderStore.applyNumber})
            })
        },
        //轨迹
        getTrackApproval({commit}, params) {
            api.getTrackApproval(params).then((res) => {
                commit(types.GET_TRACK_APPROVAL, res.data)
            })
        },
    }
}
