import AlloyLever from '@/utils/alloy-lever'

export default {
  install (vue) {
    if (window.location.href.indexOf('h5.yingheying.com') !== -1) {
      // TODO: find a way to trigger vConsole in prod
      AlloyLever.config({
        cdn: '//shadow.yingheying.com/lib/vconsole@3.1.1/vconsole.min.js',
        reportUrl: '//yhy-h5-prod.cn-beijing.log.aliyuncs.com/logstores/yhy-h5-prod/track_ua.gif?APIVersion=0.6.0',
        reportPrefix: 'alauda',
        reportKey: 'msg',
        otherReport: {
          route: encodeURIComponent(window.location.hash)
          // TODO: add userid back when common ready
          // uid: getUserId()
        }
      })
    } else {
      AlloyLever.config({
        cdn: '//shadow.yingheying.com/lib/vconsole@3.1.1/vconsole.min.js'
      })
      AlloyLever.vConsole(false)
    }
  }
}
