// 每周的中文映射，getDay() 出来0是代表周日以此类推
const weekStrs = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
// 每个月的天数，二月需要根据是否是闰年再计算,闰年二月为29天其余为28天
const mouthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const mergeLabels = {
  0: '销售流水',
  7: 'GMV',
  14: '客单价',
  17: '转化率',
  20: 'UV'
}

const mergeLabelsWeek = {
  0: '销售流水',
  3: 'GMV',
  6: '客单价',
  9: '转化率',
  12: 'UV'
}

const tableLabelsWeek = ['每日目标', '每日实际', '每日完成度']

const tableLabels = [
  '每日目标',
  '每日实际',
  '每日完成度',
  'MTD目标',
  'MTD实际',
  'MTD目标完成度',
  'MTD实际完成度',
  '每日目标',
  '每日实际',
  '每日完成度',
  'MTD目标',
  'MTD实际',
  'MTD目标完成度',
  'MTD实际完成度',
  '每日目标',
  '每日实际',
  '每日完成度',
  '每日目标',
  '每日实际',
  '每日完成度',
  '每日目标',
  '每日实际',
  '每日完成度',
  'MTD目标',
  'MTD实际',
  'MTD目标完成度',
  'MTD实际完成度'
]
// 销售流水、GMV、UV,使用以上标题 客单价、转化率、使用以上前三个标题

const filedMaps = [
  'payTarget',
  'payAmt',
  'payProgress',
  'mtdPayTarget',
  'mtdPayAmt',
  'mtdPayTargetProgress',
  'mtdPayAmtProgress',
  'gmvTarget',
  'gmvAmt',
  'gmvProgress',
  'mtdGmvTarget',
  'mtdGmvAmt',
  'mtdGmvTargetProgress',
  'mtdGmvProgress',
  'adptTarget',
  'adpt',
  'adptProgress',
  'uvConvRateTarget',
  'uvConvRate',
  'uvConvRateProgress',
  'uvTarget',
  'uv',
  'uvProgress',
  'mtdUvTarget',
  'mtdUv',
  'mtdUvTargetProgress',
  'mtdUvProgress'
]

const filedMapsWeek = [
  'payTarget',
  'payAmt',
  'payProgress',
  'gmvTarget',
  'gmvAmt',
  'gmvProgress',
  'adptTarget',
  'adpt',
  'adptProgress',
  'uvConvRateTarget',
  'uvConvRate',
  'uvConvRateProgress',
  'uvTarget',
  'uv',
  'uvProgress'
]

/**
 * 是否是闰年
 * @param {Number} year
 * @returns {Boolean}
 */
function isLeapYear(year) {
  /**
   * 1、是否能被4整除且不能被100的整除
   * 2、是否是400的倍数
   */
  const condition1 = year % 4 == 0 && year % 100 !== 0
  const condition2 = year % 400 == 0
  if (condition1 || condition2) {
    return true
  } else {
    return false
  }
}

/**
 * 生成日历数据
 * @param {String} scale quarter\mouth\week
 * @param {String} dateString 2019-09
 * @returns {Array}
 */
function createCalendarDays(scale, dateString) {
  /**
   * 1、获取当前时间
   * 2、获取当前月的第一天是周几
   * 3、根据scale生成不同的日历数据 周/月/季
   */
  const nowDate = dateString ? new Date(dateString) : new Date()
  const nowYear = nowDate.getFullYear()
  const nowMouth = nowDate.getMonth()
  const nowDay = nowDate.getDate()
  // 现实中的月份
  // const nowRealMouth = nowMouth + 1
  const fisrtDate = new Date(nowYear, nowMouth, 1)
  const nowFisrtWeek = fisrtDate.getDay()
  const nowWeek = nowDate.getDay()
  switch (scale) {
    case 'week':
      return getWeekDays(nowYear, nowMouth, nowWeek, nowDay)
    case 'quarter':
      // TODO
      break
    default:
      return getMouthDays(nowYear, nowMouth, nowFisrtWeek)
  }
}
/**
 * 获取一月维度的日历
 * @param {*} nYear 当前年
 * @param {*} nMouth 当前月
 * @param {*} nowMouthFisrtWeek 当月一号是周几
 * @returns
 */
function getMouthDays(nYear, nMouth, nowMouthFisrtWeek) {
  let mouthDayList = []
  mouthDays[1] = isLeapYear(nYear) ? 29 : 28
  for (let i = 0; i < mouthDays[nMouth]; i++) {
    const weekDay = weekStrs[(nowMouthFisrtWeek + i) % 7]
    const day = i + 1
    mouthDayList.push({
      day,
      date: new Date(nYear, nMouth, day).getTime(),
      weekDay
    })
  }
  return mouthDayList
}
/**
 *获取一周维度的日历
 * @param {*} nYear 当前年
 * @param {*} nMouth 当前月
 * @param {*} nWeek 当天是周几
 * @param {*} nDay 当月几号
 * @returns {Array}
 */
function getWeekDays(nYear, nMouth, nWeek, nDay) {
  let weekDays = []
  for (let i = 0; i < 7; i++) {
    const weekDay = weekStrs[(i + 1) % 7]
    // TODO 这里可以优化
    nWeek = nWeek === 0 ? 7 : nWeek
    // 当月某日 减去 这日周数，  如： 6.12 是星期5   12 - 5  则是上周
    const everyDate = new Date(nYear, nMouth, nDay - (nWeek - 1) + i)
    const day = everyDate.getDate()
    weekDays.push({
      day,
      date: everyDate.getTime(),
      weekDay
    })
  }
  return weekDays
}

export {
  createCalendarDays,
  mergeLabels,
  tableLabels,
  filedMaps,
  mergeLabelsWeek,
  tableLabelsWeek,
  filedMapsWeek
}
