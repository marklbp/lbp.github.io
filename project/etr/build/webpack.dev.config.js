var path = require('path')
var merge = require('webpack-merge')
var webpack = require('webpack')
var config = require('./webpack.config.js')
var devServer = {
  // 用于提供静态文件的目录
  contentBase: path.resolve(__dirname, '../dist'),
  hot: true, // open or close hot module replacement
  // hotOnly: true // 启动热更新时不刷新页面
  host: 'localhost',
  open: true, // 自动开启浏览器访问
  port: 8000, // 指定要监听请求的端口号
  /**
   * proxy: { // proxy URLs to backend server
   *   '/api': 'http://xxx.com'
   * }
   */
  /**
   * 用于提供bundle文件的目录，优先于contentBase
   * publicPath: '/'
   */
  /**
   * // 优先于所有其他中间件前执行某些特定操作的功能
   * before: function(app){app.get('/xxx/yyy', function(req, res){...})}
   */
  /**
   * // 在所有其他中间件处理后执行某些特定操作的功能
   * after: function(app){app.get('/xxx/yyy', function(req, res){...})}
   */
}

// else use webpakck-dev-middleware & webpack-hot-middleware
// config.plugins.push(new webpack.HotModuleReplacementPlugin())
config = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    publicPath: '/', // for development server address
  },
  devServer: devServer,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  watch: true, // 启用监听文件变化
  watchOptions: {
    // 延迟构建响应，即将多个文件更改的多次构建合成到一次重构建(rebuild)
    aggregateTimeout: 1000, // in ms
    // poll: true,
    poll: 500, // 间隔单位 ms
    // 启用轮询观察模式
    // 必须用在不通知更改的文件系统中
    // 即 nfs shares（Network FileSystem，最大的功能就是可以透过网络，让不同的机器、不同的作业系统、可以彼此分享个別的档案 ( share file )）
    // 忽略指定目录的监听
    ignored: ['node_modules']
  }
})
// console.log(config)
module.exports = config