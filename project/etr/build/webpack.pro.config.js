var merge = require('webpack-merge')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.HashedModuleIdsPlugin() // 防止解析顺序变化引起公用库重复编译
  ]
})