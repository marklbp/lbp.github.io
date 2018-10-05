var webpack = require('webpack')
var config = require('./webpack.dev.config.js')
var complier = webpack(config)
// console.log(JSON.stringify(config, null, 4))

var server = process.argv.slice(2);
server = './' + (server[0] ? server : 'server.webpackDevMiddleware.express')

var createServer = require(server)

createServer(complier, config)