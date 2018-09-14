import Vue from 'vue'
import Vuex from 'vuex'
import guess from './modules/guess'
import lotteryPoint from './modules/lottery-point'
import information from './modules/information'
import order from './modules/order'
import FBBetting from './modules/fb-betting.js'
import WorldCupBetting from './modules/worldcup/betting.js'
import createStorePlugin from './plugin.js'
import { get } from '@/services/request.js'

Vue.use(Vuex)

const state = {
  //  显示根节点
  showRouterView: true,
  //  足彩系统参数
  LotterySetting: {
    // 单次押注倍数上限
    singleTimeMax: 1000,
    // 当日押注彩分上限
    singleDayMax: 1000
  },
  //  验证赛事是否停售
  verMatchIsOver: {
    matchType: '',
    matchIdList: []
  }
}

const mutations = {
  //  设置是否显示根节点
  setShowRouterView (state, val) {
    state.showRouterView = !!val
  },
  //  设置足彩系统参数
  _set_LotterySetting (state, val = {}) {
    state.LotterySetting.singleTimeMax = Number(val.singleTimeMax || 1000)
    state.LotterySetting.singleDayMax = Number(val.singleDayMax || 1000)
  },
  //  设置验证数据
  _set_verMatchIsOver (state, val = {}) {
    state.verMatchIsOver.matchType = val.matchType
    state.verMatchIsOver.matchIdList = val.matchIdList || []
  }
}

const actions = {
  //  获取足彩系统参数
  getLotterySetting (context) {
    let promise = get('trademanager.getLotterySetting')
    promise
      .then(res => {
        let { content } = res
        context.commit('_set_LotterySetting', ((content && content.length > 0 && content[0]) || {}))
      })
      .catch(e => {
        context.commit('_set_LotterySetting')
        throw new Error(e)
      })
    return promise
  }
}

//  状态缓存白名单
const whiteList = [
  //  系统参数
  {
    stateName: 'LotterySetting',
    cacheKey: 'fb_sys_set'
  },
  //  足彩赛事列表
  {
    stateName: 'FBBetting/ftMatchSummaryItemList',
    cacheKey: 'fb_mat_list'
  },
  //  足彩(商品单价以及商品编码)
  {
    stateName: 'FBBetting/ft_model',
    cacheKey: 'ft_bet_mdl'
  },
  //  猜冠军(商品单价以及商品编码)
  {
    stateName: 'WorldCupBetting/ftChampion_model',
    cacheKey: 'ft_cmp_mdl'
  },
  //  猜冠亚军(商品单价以及商品编码)
  {
    stateName: 'WorldCupBetting/ftChampionSec_model',
    cacheKey: 'ft_cmpsec_mdl'
  },
  //  猜冠军列表
  {
    stateName: 'WorldCupBetting/ftChampionItemList',
    cacheKey: 'ft_cmp_list'
  },
  //  猜冠亚军列表
  {
    stateName: 'WorldCupBetting/ftChampionSecItemList',
    cacheKey: 'ft_cmpsec_list'
  },
  //  验证赛事是否停售
  {
    stateName: 'verMatchIsOver',
    cacheKey: 'ver_mat_over'
  }
]

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [createStorePlugin(whiteList)],
  modules: {
    guess,
    lotteryPoint,
    information,
    order,
    FBBetting: {
      namespaced: true,
      ...FBBetting
    },
    WorldCupBetting: {
      namespaced: true,
      ...WorldCupBetting
    }
  }
})

export default store
