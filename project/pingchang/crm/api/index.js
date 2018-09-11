import request from '@/plugins/axios'
import Util from '@/utils'
import lender from './lender'
import guarantor from './guarantor'
import sp from './sp'
import admin from './admin'
import cooperation from './cooperation'
import agency from './agency'
import common from './common'
import reviewEnter from './reviewEnter'

let merge = Util.merge;

let preReq = (Axios, Url)=>{
    let module = Object.keys(Url);
    let r = {};
    module.forEach(_n=>{
        let m = Object.keys(Url[_n]);
        r[_n] = {}
        m.forEach(n=>{
            r[_n][n] = (_url, params)=>{
                let m = Url[_n];
                if('object' == typeof _url){
                    params = _url;
                    _url = undefined;
                }
                let _method = m[n]._method;
                let config = m[n].config;
                let method = config.method;
                let name = m[n].name;
                let _data = config.data;
                let _params = config.params;
                let data;
                if(_data)params = data = merge(true, {}, _data, params);

                if(_params)params = merge(true, {}, _params, params);

                let url = _url || m[n].url.replace(/\{([^\{\}]+)\}/g,(a,b)=>''+params[b]);

              if (params && params._editId) {
                params.id = params._editId;
                delete params._editId;
              }

              if (params && params._addId) {
                delete params.id;
                delete params._addId;
              }

                if('ajax' == _method){
                    if(_data || _params)config = merge(true, {}, config,'get' != method ? {data}:{params})
                    return Axios.ajax(url, config, name);
                }

                if(method == 'get'){
                    if(!_params)return Axios.get(url, null, name);
                    return Axios.get(url, params, name);
                }

                if(!_data)return Axios[method](url, null, name);
                return Axios[method](url, data, name);
            }
        })
    })
    return r;
}

let _api = {
    // 登录接口
    async signin(params) {
        let signIn = await request.post('/login', params, '登录');
        //console.log(data, admin)
        return signIn
    }
    ,async getAdminInfo(){
        let admin = await request.get('/user/getUserInfo');
        return admin
    }
    // 退出接口
    ,async signout(params) {
        let {data} = await request.get('/logout', params/*, '登出'*/)
        return data
    },
    // 查询绑定列表
    async searchBindList(params) {
        let {data} = await request.get('/lenderOrganizationSp/getHasBulidListByParentIdAndChildType', params)
        return data
    },
    // 添加绑定
    async addBind(params) {
        let {data} = await request.post('/lenderOrganizationSp/build', params)
        return data
    },
    /**
     * 获取页面列表按钮权限
     * @param params
     * @returns {Promise<*>}
     */
    async getButtonListByparentId(params) {
        if(!params.id){return false;}
        let {data} = await request.get('/resource/getButtonListByparentId', params)
        return data
    },

    getButtonListByparentId2(params) {
        if(!params.id){return false;}
        return request.get('/resource/getButtonListByparentId', params)
        //return data
    },
    // 出账列表
    async fetchList(params) {
        let {data} = await request.get('/outaccount/apply/detail', params)
        return data
    },

    searchLenderBindList(params){
        return request.get('/sp/hasbind/LenderList',{limit: 100000, ...params})
    },

    // 获取用户菜单
    async getResource(params) {
        let {data} = await request.get('/resource/CRM', params)
        return data
    },

    // 更新心跳token，约定每10分钟获取一次
    async getHeartToken(params) {
        let {data} = await request.get('/token', params)
        return data
    }

    ,...lender

    ,...guarantor

    ,...sp

    ,...admin

    ,...cooperation

    ,...reviewEnter

}

const api = Object.assign(_api, {
    ...preReq(request, {lender: _api.lender})
    ,...preReq(request, {guarantor: _api.guarantor})
    ,...preReq(request, {sp: _api.sp})
    ,...preReq(request, agency)
    ,...preReq(request, common)
})

export default api
