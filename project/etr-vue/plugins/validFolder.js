class validFolder {

  constructor(opts) {
  }

  apply(compiler) {
    compiler.plugin('watch-run', function (watching, callback){
        var changeFileObj = watching.watchFileSystem.watcher.mtimes
        console.log(changeFileObj)
        Object.keys(changeFileObj).forEach(filePath => {
          var arr = filePath.split('/src/')[1].split('/')
          if(arr.every(f => !/[A-Z\s]/.test(f))) {
            
          } else {
            throw new Error('文件名不合法')
          }
        })
        callback()
    })
  }
}
// 导出插件 
module.exports = validFolder;