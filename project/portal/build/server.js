var once
var path = require('path')
var fs = require('fs')
var md5 = require('md5')
var CFG = require('./config')
var webpack = require('webpack')
var config = require('./webpack.dev.config.js')
var compiler = webpack(config)
var child_process = require('child_process')
var webpackDevServer = require('webpack-dev-server')
var portfinder = require('portfinder')
var host = CFG.host
var {createSrcFiles, createDestFiles, getIPAdress} = require('./prepare')

boot()

function boot () {
  createDestFiles(_ => createSrcFiles(startWebpackDevServer))
}

function startWebpackDevServer () {
  config.entry.unshift('webpack-dev-server/client', 'webpack/hot/dev-server')
  webpackDevServer.addDevServerEntrypoints(config, config.devServer)
  portfinder.basePort = config.devServer.port
  portfinder.getPortPromise().then(port => {
    config.devServer.port = port
    new webpackDevServer(compiler, config.devServer).listen(config.devServer.port, config.devServer.host, (err) => {
      if (err) return console.log('\33[31m' + err + '\33[0m')
      if (compiler.hooks) {
        compiler.hooks.done.tap({name: 'FriendlyErrorsWebpackPlugin'}, open);
      } else {
        compiler.plugin('done', open);
      }
      if (config.watch) {
        watchStatic()
        watchSrcViews()
      }
    })  
  }).catch(e => console.log(e))
}

function open (stats) {
  var url = "http" + (config.devServer.https ? "s" : "") + "://" + host + ":"+ config.devServer.port +"/"
  var external = "http" + (config.devServer.https ? "s" : "") + "://" + getIPAdress() + ":"+ config.devServer.port +"/"
  if (once) return console.log('\33[32m\nCompiled successfully\nPlease access to '+ url +' in your browser started by webopack-dev-server or ' + external + ' with your ip address!\33[0m')
  once = true
  var cmd = 'start '
  if (process.platform == 'wind32') {
    cmd = 'start ';
  } else if (process.platform == 'linux') {
    cmd = 'xdg-open ';
  } else if (process.platform == 'darwin') {
    cmd = 'open ';
  }
  if (config.devServer.open) child_process.exec(cmd + url)
  console.log("\33[32mPlease access to "+ url +" in your browser started by webopack-dev-server or "+ external +" with your ip address!\33[0m")
}

function watchStatic () {
  var fswait = {}
  var srcStacticPath = CFG.srcStatic
  var desStacticPath = CFG.desStatic

  fs.watch(srcStacticPath, {
    recursive: true
  }, function (event, filename) {
    if (filename) {
      try {
        if (fswait[filename] && fswait[filename].time) return
        if (!fswait[filename]) fswait[filename] = {}
        if (fswait[filename].time)clearTimeout(fswait[filename].time)
        fswait[filename].time = setTimeout(_ => {
          fswait[filename].time = null
        }, 100)
        var fromPath = path.join(srcStacticPath, filename)
        var toPath = path.join(desStacticPath, filename)
        var md5Current = md5(fs.readFileSync(fromPath))
        if (md5Current === fswait[filename].md5) return
        fswait[filename].md5 = md5Current
        console.log(filename, 'is changed')
        if (fs.existsSync(fromPath)) {
          fs.copyFileSync(fromPath, toPath)
        }
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error.message);
      }
    }
  })
}

function watchSrcViews () {
  var fswait = {}
  fs.watch(CFG.srcView, function (event, filename) {
    if (filename) {
      if (event === 'rename') {
        if (fswait[filename] && fswait[filename].time) {
          clearTimeout(fswait[filename].time)
          delete fswait[filename]
        }
        // 删除、新建、重命名src/views下的目录时，直接重建路由、api、状态文件
        return createSrcFiles()
      }

      if (fswait[filename] && fswait[filename].time) return
      if (!fswait[filename]) fswait[filename] = {}
      if (fswait[filename].time)clearTimeout(fswait[filename].time)
      fswait[filename].time = setTimeout(_ => {
        fswait[filename].time = null
        createSrcFiles()
      }, 1000)
    }
  })
}