import api from '@/api'

/*export function nuxtServerInit({commit}, {req}){
    commit("SIGN_IN", [])
}*/

export function signIn({commit, dispatch}, param) {
    return api.signin(param).then((res) => {
        if(res.error)return res
        let signIn = res;
        commit("SIGN_IN", signIn && signIn.success && signIn.success.leaf || []);
        return signIn
    }).catch(err=>err)
}

export function signOut({commit}) {
    commit("SIGN_OUT");
    return api.signout()
    .then(res=>res)
    .catch(err=>err)
}

export function getAdminInfo({commit}, admin){
    if(admin)return commit('SAVE_ADMIN_INFO', admin)
    return api.getAdminInfo()
    .then(res=>{
        if(res.error)return Promise.reject(res);
        //console.log(res)
        commit('SAVE_ADMIN_INFO', res.success)
        return res;
    }).catch(err=>err)
}

export function updateMenus({commit}, menus){
    commit('UPDATE_MENUS', menus);
}

export function updatePrivateMenus({commit}, menus){
    commit('UPDATE_PRIVATE_MENUS', menus);
}
