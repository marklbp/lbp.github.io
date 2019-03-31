module.exports = function (content) {
    if (this.cacheable) {
        this.cacheable();
    }
    //console.log('\n\n\n\n\n\n', arguments, '\n\n\n', content, '\n\n\n\n\n\n')
    return content;
    /*
      如果需要回调函数返回
      this.callback(err, content, soureMap, ast)
      return;
      如果需要异步处理
      var callback = this.async()
      asyncOperation(function (err, content, sourceMap, ast) {
        callbaxk(err, content, sourceMap, ast)
      })
    */
}