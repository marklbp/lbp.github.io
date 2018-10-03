// webpakck-dev-middleware & webpack-hot-middleware
module.exports = (complier, config) => {
  var child_process = require('child_process')
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var express = require('express')
  var app = express()
  app.use(webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
  }))

  app.listen(config.devServer.port, () => {
    var url = "http://localhost:"+ config.devServer.port +"/"
    console.log("please access to "+ url +" in your browser started by express and webpack-dev-middleware!")
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