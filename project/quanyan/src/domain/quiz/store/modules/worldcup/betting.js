/* 下注 */
const state = {
  //  冠军列表
  ftChampionItemList: [],
  //  冠亚军列表
  ftChampionSecItemList: [],
  //  冠军商品单价以及商品编码
  ftChampion_model: {
    itemId: 0,
    price: 1,
    // 卖家id
    sellerId: 0
  },
  //  冠亚军商品单价以及商品编码
  ftChampionSec_model: {
    itemId: 0,
    price: 1,
    // 卖家id
    sellerId: 0
  }
}

const getters = {
  //  已选中的冠军列表
  selectedftChampion: state => {
    let arr = []
    state.ftChampionItemList.forEach(item => {
      if (item._selected && !item._is_over) arr.push(item)
    })
    return arr
  },
  //  已选中的冠亚军列表
  selectedftChampionSec: state => {
    let arr = []
    state.ftChampionSecItemList.forEach(item => {
      if (item._selected && !item._is_over) arr.push(item)
    })
    return arr
  }
}

const mutations = {
  //  修改整个冠军列表数据
  setftChampionItemList (state, val = []) {
    state.ftChampionItemList = val
  },
  setftChampionSecItemList (state, val = []) {
    state.ftChampionSecItemList = val
  },
  //  设置冠军商品信息
  setFtChampion_model (state, model = {}) {
    state.ftChampion_model.itemId = model.itemId || 0
    //  钱转换成积分（1毛钱=1积分）（返回单位是分）
    state.ftChampion_model.price = (parseFloat(model.price) / 10) || 1
    state.ftChampion_model.sellerId = model.sellerId || 0
  },
  //  设置冠亚军商品信息
  setFtChampionSec_model (state, model = {}) {
    state.ftChampionSec_model.itemId = model.itemId || 0
    //  钱转换成积分（1毛钱=1积分）（返回单位是分）
    state.ftChampionSec_model.price = (parseFloat(model.price) / 10) || 1
    state.ftChampionSec_model.sellerId = model.sellerId || 0
  },
  //  删除某个已选中的冠军赛事
  delSelectedChampion (state, _autoId) {
    state.ftChampionItemList.forEach(item => {
      if (item._autoId === _autoId) item._selected = false
    })
  },
  //  删除某个已选中的冠亚军赛事
  delSelectedChampionSec (state, _autoId) {
    state.ftChampionSecItemList.forEach(item => {
      if (item._autoId === _autoId) item._selected = false
    })
  },
  //  选择猜冠军
  changeFtChampionSelect (state, _autoId) {
    state.ftChampionItemList.forEach(item => {
      if (item._autoId === _autoId && !item._is_over) item._selected = !item._selected
    })
  },
  //  选择猜冠亚军
  changeFtChampionSecSelect (state, _autoId) {
    state.ftChampionSecItemList.forEach(item => {
      if (item._autoId === _autoId && !item._is_over) item._selected = !item._selected
    })
  },
  //  清空猜冠军数据
  clearFtChampionSelect (state) {
    state.ftChampionItemList.forEach(item => {
      item._selected = false
    })
  },
  //  清空猜冠亚军数据
  clearFtChampionSecSelect (state) {
    state.ftChampionSecItemList.forEach(item => {
      item._selected = false
    })
  },
  //  设置冠军是否已结束
  setFtChampionOver (state, matchIds = []) {
    state.ftChampionItemList.forEach(content => {
      if (matchIds.includes(content.matchId)) {
        content._selected = false
        content._is_over = true
      }
    })
  },
  //  设置冠亚军是否已结束
  setFtChampionSecOver (state, matchIds = []) {
    state.ftChampionSecItemList.forEach(content => {
      if (matchIds.includes(content.matchId)) {
        content._selected = false
        content._is_over = true
      }
    })
  }
}

//  需要缓存的state
const cacheState = ['ftChampionItemList', 'ftChampionSecItemList', 'ftChampion_model', 'ftChampionSec_model']
cacheState.forEach(item => {
  mutations[`_set_${item}`] = (state, val) => {
    state[item] = val
  }
})

export default {
  state,
  mutations,
  getters
}
