import request from '@/plugins/axios'

export default {
    /**
     * 合作机构管理
     */
    //合作机构列表
    async getInfoListAndSystemAdmin(params) {
        let {data} = await request.get('/lgs/relation/getInfoListAndSystemAdmin', params)
        return data
    },
    // 查询机构
    async getOrgList_ext(params) {
        let {data} = await request.get('/ext/org/list', params)
        return data
    },
    // 查询机构和子机构列表
    async getOrgChildren_ext(params) {
        if (params.ownerId && params.id) {
            let paramsid = params.id;
            delete params.id
            let {data} = await request.get('/ext/org/' + paramsid + '/children', params)
            return data
        }
        let data = null
        return data
    },
    // 修改机构接口
    async putOrgModify_ext(params) {
        if (params.id) {
            let paramsid = params.id;
            let {data} = await request.put('/ext/org/' + paramsid, params)
            return data
        }
        let data = null
        return data
    },
    // 增加机构接口
    async addOrgModify_ext(params) {
        let {data} = await request.post('/ext/org', params)
        return data
    },
    //删除机构
    async delOrg_ext(params) {
        let id = params.id;
        delete params.id;
        let {data} = await request.delete('/ext/org/' + id+'?ownerId='+params.ownerId)
        return data
    },

    /**
     * 合作机构----角色管理
     */
    // 查询角色
    async getRoleList_ext(params) {
        for (let i in params) {
            if (!params[i]) delete params[i]
        }
        let {data} = await request.get('/ext/role/list', params)
        return data
    },
    // 修改角色接口
    async putRoleModify_ext(params) {
        console.log(params)
        if (params.id) {
            let paramsid = params.id;
            let {data} = await request.put('/ext/role/' + paramsid, params)
            return data
        }
        let data = null
        return data
        // let { data } = await request.put('/role/' + params)
        // return data
    },
    // 增加角色接口
    async addRoleModify_ext(params) {
        let {data} = await request.post('/ext/role', params)
        return data
    },
    //删除角色
    async delRole_ext(params) {
        if (params.id) {
            let id = params.id
            delete params.id
            let {data} = await request.delete('/ext/role/' + id, params)
            return data
        }
        let data = null
        return data
    },

    /**
     * 合作机构--员工管理
     */

    //获取员工
    async getUser_ext(params) {
        let {data} = await request.get('/ext/user/getInfoListByDepartmentId', params)
        return data
    },
    // 修改员工
    async putUser_ext(params) {
        let {data} = await request.post('/ext/user/update', params)
        return data
    },
    // 增加员工
    async addUser_ext(params) {
        let {data} = await request.post('/ext/user/add', params)
        return data
    },
    //删除员工
    async delUser_ext(params) {
        let id = params.id;
        let {data} = await request.delete('/ext/user/' + id, params)
        return data
    },
    //查询员工列表
    async getUserList_ext(params) {
        let {data} = await request.get('/ext/user/list', params)
        return data
    },
    // 重置员工密码
    async resetPassword_ext(params) {
        let {data} = await request.put('/ext/user/password/reset', params)
        return data
    },
    // 查询绑定管理员
    async getInfoByUserName_ext(params) {
        if (params.userName) {
            let userName = params.userName
            delete params.userName;
            let {data} = await request.get('/ext/user/getInfoByUserName/' + userName, params)
            return data
        }
        let data = null
        return data
    },
    /**
     * 合作机构--角色权限
     */
    //查询角色权限
    async getRolePrivilege_ext(params) {
        if (params.roleIds) {
            let roleIds = params.roleIds
            delete params.roleIds
            let {data} = await request.get('/ext/role/' + roleIds + '/resources', params)
            return data
        }
        let data = null
        return data
    },
    //修改角色权限
    async putRolePrivilege_ext(params) {
        if (params.roleId) {
            let roleIds = params.roleId
            let {data} = await request.put('/ext/role/' + roleIds + '/resources', params)
            return data
        }
    },
    //根据员工获取其角色
    async getUserEmployees_ext(params) {
        let {data} = await request.get('/role/getRolesByUserId', params)
        return data
    },
    //获取员工列表
    async getEmployeesList_ext(params) {
        let {data} = await request.get('/ext/user/getInfoListByOwnerId', params)
        return data
    },
    //添加员工角色
    async addUserRoles_ext(params) {
        if (params.userId) {
            let userId = params.userId
            let {data} = await request.post('/ext/user/' + userId + '/roles', params)
            return data
        }
        return data = null
    },
    //修改员工角色
    async putUserPrivilege_ext(params) {
        if (params.userId) {
            let userId = params.userId
            delete params.userId;
            let {data} = await request.put('/ext/user/' + userId + '/roles', params)
            return data
        }
    },
    // 复制员工权限
    async copyUserPrivilege_ext(params) {
        //let {data} = await request.post('/ext/identity/roles/copy', params)
        // 服务端api变更
        let {data} = await request.post('/identity/roles/copy', params)
        return data
    },

    // 合作机构管理左侧菜单
    async getListByparentId(params) {
        let {data} = await request.get('/resource/getListByparentId', params)
        return data
    },
    // 经销商saas部分私有菜单接口
    async getListByparentIdResourceTree(params) {
        let {data} = await request.get('/resource/resourceTree', params)
        return data
    },



    //根据员工id获取所有角色
    async getAllRoles_ext(params) {
        if (params.userId) {
            let userid = params.userId
            delete params.userId;
            let {data} = await request.get('/ext/role/' + userid + '/allRoles', params)
            return data
        }
        let data = null
        return data
    },

    /**
     * 合作机构 logo 关于我们
     */
    //logo上传
    async postLogo(params) {
        if(!params.ownerId||!params.fileId){return false;}
        let {data} = await request.post('/lgs/relation/submitLogo', params)
        return data
    },
    async getLogo(params) {
        if(!params.ownerId){return false;}
        let {data} = await request.get('/lgs/relation/getLogo', params)
        return data
    }
}
