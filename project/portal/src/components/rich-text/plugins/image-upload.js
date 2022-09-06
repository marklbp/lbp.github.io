var oldImagePlugin = KindEditor.plugin('image')
if (!KindEditor.plugin('image_old')) {
  KindEditor.plugin('image_old', oldImagePlugin)
}
KindEditor.plugin('image', function(K) {
  Object.assign(this, {
    allowImageUpload: false
  })
  KindEditor.plugin('image_old').call(this, K)
  this._handlers['clickToolbarimage'] &&
    this._handlers['clickToolbarimage'].shift()
})

if (!KindEditor.plugin('portal-image-upload')) {
  KindEditor.lang({ 'portal-image-upload': '上传文件' })
  KindEditor.plugin('portal-image-upload', function(K) {
    var self = this
    var name = 'portal-image-upload'
    var plugins
    this.clickToolbar(name, function() {
      if (window.Vue && !Vue.prototype.$RichText) {
        plugins = Vue.prototype.$RichText = {}
      } else {
        plugins = Vue.prototype.$RichText
      }
      if (window.Vue && typeof plugins.addImage == 'function') {
        plugins.addImage(function(content) {
          self.insertHtml(content)
        })
      } else {
        window.Vue && Vue.prototype.$message.warning('功能暂不可用')
      }
    })
  })
}
