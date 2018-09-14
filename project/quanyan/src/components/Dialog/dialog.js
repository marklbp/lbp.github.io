import Vue from 'vue'
import CustomDialog from './dialog.vue'

const instance = Vue.extend({
  components: {
    CustomDialog
  },
  data () {
    return {
      //  是否显示dialog
      showDialog: false
    }
  },
  template: `<div><custom-dialog :showDialog="showDialog"></custom-dialog></div>`
})

//  Vue实例
class VueIntance {
  constructor () {
    //  Vue实例是否已经挂载到DOM树
    this.$mounted = false
  }
  $show (options = {}) {
    //  挂载实例
    if (!this.$mounted) {
      this.$mounted = true
      let div = document.createElement('div')
      document.body.appendChild(div)
      instance.$mounted(div)
    }
    for (let item in options) {
      instance[item] = options[item]
    }
    instance.showDialog = true
  }
}
//  弹窗
class Cdialog extends VueIntance {
  constructor (options = {}) {
    super()
  }
  //  确定弹窗
  confirm (options = {}) {
    /*   字段    类型    默认值  说明
    options: {
      title:    String,     (不传不显示标题)
      content： String||HTMLString (要显示的内容，可以是html字符串)
      cancelText： String   (左边按钮文案)
      confirmText: String   (右边按钮文案)
      isHtml: Boolean (内容是否支持html)
    } */
    let { content = '' } = options
    if (content === '') return false
    this.$show(options)
  }
}

export const Dialog = new Cdialog()

export default Dialog
