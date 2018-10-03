// webpack-dev-server & nodejs api
module.exports = (complier, config) => {
  var child_process = require('child_process')
  var webpackDevServer = require('webpack-dev-server')
  webpackDevServer.addDevServerEntrypoints(config, config.devServer)
  server = new webpackDevServer(complier, config.devServer)

  server.listen(config.devServer.port, 'localhost', () => {
    var url = "http://localhost:"+ config.devServer.port +"/"
    console.log("please access to "+ url +" in your browser started by webopack-dev-server!")
    var cmd = 'start '
    if (process.platform == 'wind32') {
      cmd = 'start ';
    } else if (process.platform == 'linux') {
      cmd = 'xdg-open ';
    } else if (process.platform == 'darwin') {
      cmd = 'open ';
    }
    if(config.devServer.open){
      child_process.exec(cmd + url)
    }
  })
}