import Vue from 'vue'
import api from '@/api'
import * as types from '@/store/mutation-types'


export default {
    state: {
        bindVal: [],
        bind: {
            success: false,
            failure: null,
        },
        ownerId: '',
        parentId: '',
        menuBtnsList:{
            tabButtonList:[],
            wrapButtonList:[],
            search:[]
        }
    },
    mutations: {
        SEARCH_BIND_LIST(state, data) {
            state.bindVal = data
        },
        ADD_BIND: (state) => {
            Vue.set(state.bind, 'success', false);
            Vue.set(state.bind, 'failure', null);
        },
        ADD_BIND_SUCCESS: (state) => {
            Vue.set(state.bind, 'success', true);
        },
        ADD_BIND_FAILURE: (state, data) => {
            Vue.set(state.bind, 'success', false);
            Vue.set(state.bind, 'failure', data);
        },
        SET_OWNERID(state, data) {
            state.ownerId = parseInt(data)
            if (process.browser) {
                localStorage.setItem('ownerId', parseInt(data));
            }
        },
        SET_PARENT_ID(state, data) {
            state.parentId = parseInt(data)
            if (process.browser) {
                localStorage.setItem('parentId', parseInt(data));
            }
        },
        GET_PARENT_ID(state, data) {
            if (process.browser) {
                let parentId = window.localStorage.getItem('parentId')
                state.parentId = parentId
            }
        },
        GET_MENU_BUTTON_LIST(state,data){
            let btnLen = state.menuBtnsList.tabButtonList.length;
            let wBtnLen = state.menuBtnsList.wrapButtonList.length;
            let sBtnLen = state.menuBtnsList.search.length;
            state.menuBtnsList.tabButtonList.splice(0, btnLen, ...data.tabButtonList);
            state.menuBtnsList.wrapButtonList.splice(0, wBtnLen, ...data.wrapButtonList);
            state.menuBtnsList.search.splice(0, sBtnLen, ...data.search);
        }
    },
    actions: {
        // 查询绑定
        searchBindList({commit}, parames) {
            api.searchBindList(parames).then((res) => {
                let result = res.data.map(item => item.childId)
                // let result = res.data.map(item => item.id)
                commit(types.SEARCH_BIND_LIST, result)
            })
        },
        searchLenderBindList({commit}, params) {
            return api.searchLenderBindList(params).then(res => {
                let result = res.success.list.map(item => item.id)
                commit(types.SEARCH_BIND_LIST, result)
            })
        },
        // 添加绑定
        addBind({commit}, data) {
            api.addBind(data).then((res) => {
                commit(types.ADD_BIND)
            })
        },
        //获取页面button
        getMenuButtonList({commit},id){
            //debugger
            if (!id) return false;
            api.getButtonListByparentId({id}).then((res) => {
                if (res && res.data) {
                    let data = res.data,
                        whitelist = ['add', /*'import',*/ 'copy', 'submit'];

                    let obj ={
                        tabButtonList:[],
                        wrapButtonList:[],
                        search:[]
                    }

                    data.forEach((btn, i)=>{
                        if(whitelist.indexOf(data[i]['value']) > -1){
                            obj.wrapButtonList.push(data[i])
                        }else if(data[i]['value'] == 'query'){
                            obj.search = data[i]
                        } else {
                            obj.tabButtonList.push(data[i])
                            /*if(data[i]['value']){
                                obj.tabButtonList.push(data[i])
                            }else{
                                obj.tabButtonList.push(data[i])
                            }*/
                        }
                    })

                    commit(types.GET_MENU_BUTTON_LIST,obj)
                }
            })
            //console.log(data);
        }
    }
}
