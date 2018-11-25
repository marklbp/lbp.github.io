// webpack-dev-server & nodejs api
module.exports = (complier, config) => {
  var child_process = require('child_process')
  var open = require('./openBrowser')
  var webpackDevServer = require('webpack-dev-server')
  /*此为配合热更新插件作用，利用webpack-dev-server时，须追加到（entry）入口的两个选项
  前者实现热更新消息publish， 后者实现热更新消息的接受处理receive and handle*/
  config.entry.unshift('webpack-dev-server/client', 'webpack/hot/dev-server')
  webpackDevServer.addDevServerEntrypoints(config, config.devServer)

  server = new webpackDevServer(complier, config.devServer)

  var url = "http://localhost:"+ config.devServer.port +"/"
  console.log("please access to "+ url +" in your browser started by webopack-dev-server!")

  server.listen(config.devServer.port, 'localhost', () => {
    // open(child_process, url)
  })
}