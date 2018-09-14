/* 下注 */
const state = {
  //  赛事列表
  ftMatchSummaryItemList: [],
  //  计算过关方式
  passFav: [],
  //  商品单价以及商品编码
  ft_model: {
    itemId: 0,
    price: 1,
    sellerId: 0
  }
}

const getters = {
  //  已选择的赛事
  selectedMatchs: state => {
    let arr = []
    state.ftMatchSummaryItemList.forEach(item => {
      item.ftMatchItemList.forEach(content => {
        //  无论是主胜，平，负，让主胜，让平，让负只要选择就默认该场赛事选中,而且赛事未结束
        if ((content._victory_selected || content._flat_selected || content._defeat_selected || content._givevictory_selected || content._giveflat_selected || content._givedefeat_selected) && !content._is_over) arr.push(content)
      })
    })
    //  计算过关方式
    let len = arr.length
    if (len < 2) {
      state.passFav = []
    } else {
      //  最大串关方式8串1
      len = len > 8 ? 8 : len
      let passArr = []
      for (let i = 2; i <= len; i++) {
        passArr.push(`${i}串1`)
      }
      state.passFav = passArr
    }
    console.log('过关方式==================================》', state.passFav)
    return arr
  }
}

const mutations = {
  //  供状态管理器钩子函数使用
  _set_ftMatchSummaryItemList (state, val) {
    state.ftMatchSummaryItemList = val
  },
  _set_ft_model (state, val) {
    state.ft_model = val
  },
  //  修改整个赛事列表数据
  setftMatchSummaryInfoList (state, val = []) {
    state.ftMatchSummaryItemList = val
  },
  //  选择赛事
  changeMatchSelect (state, {_autoId, key}) {
    state.ftMatchSummaryItemList.forEach(item => {
      item.ftMatchItemList.forEach(content => {
        if (content._autoId === _autoId) content[key] = !content[key]
      })
    })
  },
  //  删除已选中的某个赛事
  delSelectedMatch (state, _autoId) {
    state.ftMatchSummaryItemList.forEach(item => {
      item.ftMatchItemList.forEach(content => {
        if (content._autoId === _autoId) {
          content._victory_selected = content._flat_selected = content._defeat_selected = content._givevictory_selected = content._giveflat_selected = content._givedefeat_selected = false
        }
      })
    })
  },
  //  清空已选中的所有赛事
  clearSelectedMatch (state) {
    state.ftMatchSummaryItemList.forEach(item => {
      item.ftMatchItemList.forEach(content => {
        content._victory_selected = content._flat_selected = content._defeat_selected = content._givevictory_selected = content._giveflat_selected = content._givedefeat_selected = false
      })
    })
  },
  //  设置商品信息
  setFt_model (state, model = {}) {
    state.ft_model.itemId = model.itemId || 0
    //  钱转换成积分（1毛钱=1积分）（返回单位是分）
    state.ft_model.price = (parseFloat(model.price) / 10) || 1
    state.ft_model.sellerId = model.sellerId || 0
  },
  //  设置赛事是否已结束
  setMatchsOver (state, matchIds = []) {
    state.ftMatchSummaryItemList.forEach(item => {
      item.ftMatchItemList.forEach(content => {
        if (matchIds.includes(content.matchId)) {
          content._is_over = true
        }
      })
    })
  }
}

export default {
  state,
  getters,
  mutations
}
