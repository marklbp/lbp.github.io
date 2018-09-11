import Storage from '@/plugins/storage'

function processMenus(menus) {
    let result = [];
    function s(data, res, parent) {
        data.map((item, i) => {
            let val = 'object' == typeof item.value && item.value || 'object' == typeof item && item || {};
            let obj = {
                ...val
                ,menu: []
            };
            let path = obj.path || obj.value;
            if(!obj.names){
                obj.names = [...(parent&&parent.names || ''),val.name||'']
            }
            let _parent
            if(parent){
                obj._parent = parent;
                _parent = parent;
                while(_parent._parent){
                    _parent = _parent._parent
                }
                _parent.pathMap[path] = obj.names;
            }else{
                obj._parent = null;
                obj.pathMap = {[path]: [obj.name]};
            }
            res.push(obj);
            if (item.leaf && item.leaf.length > 0) {
                s(item.leaf, obj.menu, obj);
            }
        })
    }

    function delParent(result){
        result.forEach(r=>{
            delete r._parent;
            delete r.names;
            if(r.menu){
                delParent(r.menu)
            }
        })
    }
    s(menus, result);
    delParent(result);
    return result;
}


export function SIGN_IN(state, menus){
	state.isAuthenticated = true;
    this.commit('UPDATE_MENUS', menus);
}
export function SIGN_OUT(state){
	state.isAuthenticated = false;
	state.menus = state.menus.splice(0, state.menus.length);
    state.admin = {};
	Storage.clear()
}

export function SAVE_ADMIN_INFO(state, admin){
    for(let key in admin)this._vm.$set(state.admin, key ,admin[key]);
    Storage.set('ADMIN', admin)
}

export function SAVE_MENUS(state, menus){
    //console.log('save_menus', menus)
    if(!menus || !menus[0])return
    if(!menus[0].menu)menus = processMenus(menus);
    state.menus.splice(0, state.menus.length, ...menus);


}

export function UPDATE_MENUS(state, menus){
    this.commit("SAVE_MENUS", menus);
    Storage.set('MENUS', menus);
}

export function UPDATE_PRIVATE_MENUS(state, menus){
    this.commit("SAVE_MENUS", menus);
    Storage.set('PRIVATE_MENUS', menus);
}
