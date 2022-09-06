if (!KindEditor.plugin('portal-add-relation-content')) {
  KindEditor.lang({ 'portal-add-relation-content': '插入关联内容' })
  KindEditor.plugin('portal-add-relation-content', function(K) {
    var self = this
    var name = 'portal-add-relation-content'
    var plugins
    this.clickToolbar(name, function() {
      if (window.Vue && !Vue.prototype.$RichText) {
        plugins = Vue.prototype.$RichText = {}
      } else {
        plugins = Vue.prototype.$RichText
      }
      if (window.Vue && typeof plugins.addRelationContent == 'function') {
        plugins.addRelationContent(function(content) {
          self.insertHtml(content)
        })
      } else {
        window.Vue && Vue.prototype.$message.warning('功能暂不可用')
      }
    })
  })
}
