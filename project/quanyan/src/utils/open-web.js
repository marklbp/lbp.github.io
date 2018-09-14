import { WEB_ROOT, MIRAFRA_WEB_ROOT } from '@/constants/index.js'
import { isApp } from '@/utils/common.js'
import { openWebview } from '@/services/native.js'
//  打开别的项目
const webModel = {
  //  积分商城赚积分
  1: `${WEB_ROOT}/mall/#/account/myIntegration/1`,
  //  积分商城查看积分明细
  2: `${WEB_ROOT}/mall/#/account/myIntegration/2`,
  //  世界杯活动主会场
  3: `${MIRAFRA_WEB_ROOT}/worldcup`
}

export function openOwnerH5 (type) {
  let url = webModel[type] || WEB_ROOT
  if (isApp()) {
    openWebview(url)
  } else window.location.href = url
}
