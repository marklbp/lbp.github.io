import request from '@/plugins/axios'

export default {
	/**
     * 用户管理
     */
    // 查询绑定管理员
    async getInfoByUserName(params) {
        let {data} = await request.get('/user/getInfoByUserName/' + params)
        return data
    },
    // 变更管理员
    async modifyAdmin(params) {
        console.log(params)
        let {data} = await request.post('/user/modifyAdmin', params)
        return data
    },
    // 通过获取机构管理员
    //
    async getAdminByOrgId(params) {
        let {data} = await request.get('/user/getAdminByOrgId/' + params)
        return data
    },

    /**
     * 机构管理
     */
    // 查询机构
    async getOrgList(params) {
        let {data} = await request.get('/org/list', params)
        return data
    },
    // 查询机构和子机构列表
    async getOrgChildren(params) {
        if (params.id) {
            let paramsid = params.id;
            delete params.id
            let {data} = await request.get('/org/' + paramsid + '/children', params)
            return data
        }
        let data = null
        return data
    },
    // 修改机构接口
    async putOrgModify(params) {
        if (params.id) {
            let paramsid = params.id;
            let {data} = await request.put('/org/' + paramsid, params)
            return data
        }
        let data = null
        return data
    },
    // 增加机构接口
    async addOrgModify(params) {
        let {data} = await request.post('/org', params)
        return data
    },
    //删除机构
    async delOrg(params) {
        let {data} = await request.delete('/org/' + params)
        return data
    },

    /**
     * 角色管理
     */
    // 查询角色
    async getRoleList(params) {
        for (let i in params) {
            if (!params[i]) delete params[i]
        }
        let {data} = await request.get('/role/list', params)
        return data
    },
    // 查询所有角色
    async getRoleListAll(params) {
        for (let i in params) {
            if (!params[i]) delete params[i]
        }
        let {data} = await request.get('/role/allList', params)
        return data
    },
    // 修改角色接口
    async putRoleModify(params) {
        if (params.id) {
            let paramsid = params.id;
            let {data} = await request.put('/role/' + paramsid, params)
            return data
        }
        let data = null
        return data
        // let { data } = await request.put('/role/' + params)
        // return data
    },
    // 增加角色接口
    async addRoleModify(params) {
        let {data} = await request.post('/role', params)
        return data
    },
    //删除角色
    async delRole(params) {
        let {data} = await request.delete('/role/' + params)
        return data
    },

    /**
     * 员工管理
     */

    //获取员工
    async getUser(params) {
        for (let i in params) {
            if (!params[i]) {
                delete params[i]
            }
        }
        let {data} = await request.get('/user/getInfoListByDepartmentId', params)
        return data
    },
    // 修改员工
    async putUser(params) {
        let {data} = await request.post('/user/update', params)
        return data
    },
    // 增加员工
    async addUser(params) {
        let {data} = await request.post('/user/add', params)
        return data
    },
    //删除员工
    async delUser(params) {
        let id = params.id;
        let {data} = await request.delete('/user/' + id, params)
        return data
    },
    //查询员工列表
    async getUserList(params) {
        let {data} = await request.get('user/list', params)
        return data
    },
    /**
     * 角色权限
     */
    //查询角色权限
    async getRolePrivilege(params) {
        if (params.roleIds) {
            let roleIds = params.roleIds
            delete params.roleIds
            let {data} = await request.get('/role/' + roleIds + '/resources', params)
            return data
        }
        let data = null
        return data
    },
    //修改角色权限
    async putRolePrivilege(params) {
        if (params.roleId) {
            let roleIds = params.roleId
            // delete params.roleIds;
            let {data} = await request.put('/role/' + roleIds + '/resources', params)
            return data
        }
    },

    //根据员工获取其角色
    async getUserEmployees(params) {
        let {data} = await request.get('/role/getRolesByUserId', params)
        return data
    },
    //获取员工列表
    async getEmployeesList(params) {
        let {data} = await request.get('/user/getInfoListByOwnerId', params)
        return data
    },
    //根据员工id获取所有角色
    async getAllRoles(params) {
        if (params.userId) {
            let userId = params.userId;
            delete params.userId;
            let {data} = await request.get('/role/' + userId + '/allRoles')
            return data
        }
        let data = null
        return data
    },
    // 重置员工密码
    async resetPassword(params) {
        let {data} = await request.put('/user/password/reset', params)
        return data
    },
    /**
     * 获取下拉列表接口
     * /dict/list/{type}
     */
    async getSelectList(params) {
        let {data} = await request.get('/dict/list/' + params)
        return data
    },


    //添加员工角色
    async addUserRoles(params) {
        if (params.userId) {
            let userId = params.userId
            let {data} = await request.post('user/' + userId + '/roles', params)
            return data
        }
        let data = null
        return data
    },
    //修改员工角色
    async putUserPrivilege(params) {
        if (params.userId) {
            let userId = params.userId
            delete params.userId;
            let {data} = await request.put('/user/' + userId + '/roles', params)
            return data
        }
    },
    // 复制员工权限
    async copyUserPrivilege(params) {
        let {data} = await request.post('/identity/roles/copy', params)
        return data
    }
}