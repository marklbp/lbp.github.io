var preview = KindEditor.plugin('preview')
KindEditor.plugin('preview', function(K) {
  var self = this
  var name = 'preview'
  self.clickToolbar(name, function() {
    var win = window.open('about:blank')
    win.document.write(self.fullHtml())
  })
})
