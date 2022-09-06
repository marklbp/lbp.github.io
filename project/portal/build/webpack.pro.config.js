var CFG = require('./config')
var path = require('path')
var merge = require('webpack-merge')
var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var config = require('./webpack.config.js')

module.exports = merge(config, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: CFG.dest,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      // chunks: 'all',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`
      // minSize: 30000,//合并前模块文件的体积
      // minChunks: 1,//最少被引用次数
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // automaticNameDelimiter: '~',//自动命名连接符
      cacheGroups: {
        vendors: {
          name: 'vendor', //文件名
          chunks: 'initial', //对同步模块有效
          test: /[\\/]node_modules[\\/]/,
          // minChunks: 1,
          priority: 10//优先级更高
        }
      }
    },
    runtimeChunk: 'single', // 分离webpack启动代码

    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        uglifyOptions: {
          compress: {
            warnings: true,
            drop_debugger: true,
            drop_console: true
          },
          output: {
            comments: false
          }
        },
        sourceMap: CFG.RUN_ENV && CFG.RUN_ENV.env != 'prod' ? true : false,
        parallel: true
      })
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin() // 防止解析顺序变化引起公用库重复编译
  ]
})