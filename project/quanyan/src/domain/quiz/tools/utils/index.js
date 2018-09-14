import { Toast } from 'mand-mobile'
import store from 'quiz/store/index.js'
//  根据日期取周
const dayModel = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
}
export function getWeek (time) {
  return (Object.prototype.toString.call(time) === '[object Date]' && dayModel[time.getDay()]) || ''
}

//  文字提示
export function showTip (content) {
  Toast.info(content)
}

//  刷新路由
export function reload () {
  store.commit('setShowRouterView', false)
  let timer = requestAnimationFrame(() => {
    store.commit('setShowRouterView', true)
    cancelAnimationFrame(timer)
  })
}

export default {
  //  根据日期取周
  getWeek,
  //  文字提示
  showTip
}
