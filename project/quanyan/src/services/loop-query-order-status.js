import { get } from '@/services/request'

const DEFAULT_TRYTIMES = 5
const DEFAULT_INTERVAL = 5000

// TODO: don't trigger loop when init 0 seconds
export default function loopQueryOrderStatus (orderId, options) {
  var times = 0
  options.tryTimes = options.tryTimes || DEFAULT_TRYTIMES
  options.interval = options.interval || DEFAULT_INTERVAL
  options.callback = options.callback || (() => true)
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    var tick = setInterval(() => {
      if (times >= options.tryTimes) {
        clearInterval(tick)
        reject(new Error('loop query order status: tried 5 times, stop it'))
        return
      }

      get('trademanager.queryBizOrderForBuyer', {bizOrderId: orderId}, {noLoading: true}).then(res => {
        if (res.content && res.content.length > 0) { // } && res.content[0].mainOrder) {
          var order = res.content[0].mainOrder
          if (order && options.callback(order)) {
            clearInterval(tick)
            resolve(res)
          }
        } else {
          if (times + 1 === options.tryTimes) reject(new Error('api response error'))
        }
      }).catch(err => {
        if (times + 1 === options.tryTimes) reject(err)
      })

      times++
    }, options.interval)
  })
}
