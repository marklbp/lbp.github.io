var webpack = require('webpack')
var configOpts = require('./webpack.pro.config.js')
// console.log(configOpts)
webpack(configOpts, (err, a, b)=>console.log(err, a, b))