export const getPersons = {
  methods: {
    /**
     * 获取人员接口供抄送人、执行人下拉选择用途
     * @param  {String|Number} groupId 店铺id
     * @param  {Boolean} need          false -> 被引入组件实例上注入$persons属性, true -> 接口请求失败后不接力抛错
     * @param  {Number} delFlag        -1|0|1 -> 全部|可用|禁用
     * @return {Object}                Promise实例
     */
    async getPersons(groupId, need, delFlag, ...args) {
      try {
        let params = { groupId: groupId || this.$route.params.storeId }
        if (delFlag !== undefined) {
          params.delFlag = delFlag
        }
        args.forEach(obj => {
          if (obj && typeof obj == 'object') {
            Object.assign(params, obj)
          }
        })
        let { data } = await this.$api.flowSetting.getAssignee(params, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
        let records = data.records || []
        if (!need) {
          this.$persons = records.map(r => {
            var o = {
              id: r.id,
              name: r.realName || r.userName,
              pic: r.photo,
              color: r.color
            }
            if (r.delFlag == 1) {
              o.disable = true
            }
            return o
          })
        }
        return data
      } catch (e) {
        return need ? e : Promise.reject(e)
      }
    }
  }
}

export const getCategories = {
  methods: {
    /**
     * 获取流程模板分类接口
     * @param  {Boolean} need true -> 接口请求失败后不接力抛错
     * @return {Object}       Promise实例
     */
    async getCategories(need) {
      try {
        let { data } = await this.$api.flowSetting.getCategoryList(null, {
          headers: { groupId: this.$route.params.storeId },
          needToast: false
        })
        if (!need) this.$categories = data
        return data
      } catch (e) {
        return need ? e : Promise.reject(e)
      }
    }
  }
}

export const querySubModelListByPage = {
  methods: {
    /**
     * 选择流程模板接口
     * @param  {Boolean} need true -> 接口请求失败后不接力抛错
     * @return {Object}       Promise实例
     */
    async querySubModelListByPage(currentPage, pageSize, need) {
      try {
        let { data } = await this.$api.querySubModelListByPage(
          { currentPage },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (!need) {
          this.$templates = JSON.parse(JSON.stringify(data))
        }
        return data
      } catch (e) {
        return need ? e : Promise.reject(e)
      }
    }
  }
}

// 获取机器人支持的服务
export const queryRobotServices = {
  methods: {
    /**
     * 获取机器人支持的服务
     * @param  {Boolean} need true -> 接口请求失败后不接力抛错
     * @return {Object}       Promise实例
     */
    async queryRobotServices(currentPage, pageSize, need) {
      try {
        let { data } = await this.$api.queryRobotServices(
          {},
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (!need) {
          this.$services = JSON.parse(JSON.stringify(data))
        }
        return data
      } catch (e) {
        return need ? e : Promise.reject(e)
      }
    }
  }
}
// 获取机器人支持的服务
export const queryServiceForm = {
  methods: {
    /**
     * 选择流程模板接口
     * @param  {Boolean} need true -> 接口请求失败后不接力抛错
     * @return {Object}       Promise实例
     */
    async queryServiceForm(ministryLabel, need) {
      try {
        let { data } = await this.$api.queryServiceAttribute(
          { ministryLabel },
          {
            headers: { groupId: this.$route.params.storeId },
            needToast: false
          }
        )
        if (!need) {
          this.$serviceForms = JSON.parse(JSON.stringify(data))
        }
        return data
      } catch (e) {
        return need ? e : Promise.reject(e)
      }
    }
  }
}

export default {
  getPersons,
  getCategories,
  queryRobotServices,
  queryServiceForm
}
