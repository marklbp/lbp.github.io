/**
 *
 *  用户本地设置持久化
 *  USER_SETTING = {
 *    userid: {
 *        myTask/viewType: 1,
 *        storeTask/viewType: 1,
 *        dashboard/showHelpTip: true
 *    }
 *  }
 * @class SettingCache
 */

class SettingCache {
  constructor() {
    this.prefix = 'USER_SETTING'
    this.cache = Vue.prototype.$cache
  }

  get userId() {
    return this.cache.get('USER_INFO', {}).id || '0'
  }

  setItem(key, value) {
    const settings = this.cache.get(this.prefix)
    let newSettings
    if (settings) {
      const userData = settings[this.userId] || {}
      newSettings = {
        ...settings,
        [this.userId]: {
          ...userData,
          [key]: value
        }
      }
    } else {
      newSettings = {
        [this.userId]: {
          [key]: value
        }
      }
    }
    this.cache.set(this.prefix, newSettings)
  }

  getItem(key, defaultValue) {
    const settings = this.cache.get(this.prefix)
    const reNull = defaultValue => (!defaultValue ? null : defaultValue)
    if (!settings || (settings && !settings[this.userId])) {
      return reNull(defaultValue)
    }
    const value = settings[this.userId][key]
    return !value ? reNull(defaultValue) : value
  }
}

export default new SettingCache()
