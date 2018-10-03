var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  /**
   * // 基础目录，用于从配置中解析入口起点(entry)和loader
   * context: path.resolve(__dirname, directory)
   */

  entry: path.resolve(__dirname, '../src/app.js'),

  /**
   * // 提取第三方库文件单独打包
   * entry: {
   *   vendor: ['react', 'react-dom'],
   *   app: './src/app.js'
   * }
   */

  /**
   * // 引入polyfill
   * // src/polyfills.js
   * // import 'babel-polyfill';
   * // 在dist/index.html判断在不支持前提下引入script(src=polyfills.bundle.js)
   * entry: {
   *   polyfills: './src/polyfills.js',
   *   app: './src/app.js'
   * }
   */

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
    /**
     * ,chunkFilename: '[name].buddle.js' // for dynamic imports
     */
    /**
     * ,pathinfo: false // 输出文件不携带文件路径信息
     */
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.less', '.stylus']
  },
  /**
   * for split code from bunddle by SplitChunksPlugin instead of CommonsChunkPlugin
   * prevent duplication code
   */
  optimization: {
    splitChunks: {
      // chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single' // 分离webpack启动代码
  },
  module: {
    rules: [
      /**
       * 细粒度shimming
       * // 覆盖业务脚本里this的指向
       * // old.js
       * // this.alert('rewrite this to window')
       * {
       *   test: require.resolve('old.js'),
       *   use: 'imports-loader?this=>window'
       * },
       */

      /**
       * 全局exports
       * // 用于老旧第三方库改写成规范模块导出形式,便于其他脚本使用require/import导入
       * // old.js
       * // var file = 'blah.txt';
       * // var helpers = {
       * //    test: function() { console.log('test something'); },
       * //    parse: function() { console.log('parse something'); }
       * // };
       * // index.js
       * // import {file, parse} from 'old.js'
       * {
       *   test: require.resolve('old.js'),
       *   use: 'exports-loader?file,parse=helpers.parse'
       * }
       */
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        /**
         * 当babelrc文件未配置时
         * query: {presets:['es2015', 'react']}
         * @type {[type]}
         */
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'ETR',
      // filename: 'a/c.html', // 相对于访问目录（localhost:3000/a/c.html）
      // templateContent: '<div id="app"></div>'
      template: path.resolve(__dirname, '../src/assets/index.html')
    })

    /**
     * ,new webpack.optimize.CommonsChunkPlugin({
     *   name: 'vendor',
     *   minChunks: Infinity // 确保无其他模块打进去 vendor chunk
     * })
     */

    /**
     * shimming全局变量
     * 提供全局变量/全局方法
     *,new webpack.ProvidePlugin({
     *  globalVarName: 'third-package-name',
     *  someExportedMethodName: ['third-package-name', 'third-package-export-method-name']
     *})
     */

    /**
     * // 利用workbox支持离线浏览
     * // WorkboxPlugin = require('workbox-webpack-plugin')
     * // 'serviceWorker' in navigator && window.addEventListener('load', ()=>{
     * //   navigator.serviceWorker.register('/sw.js').then(r=>r).catch(err=>err)
     * // })
     * ,new WorkboxPlugin.GenerateSW({
     *   clientsClaim: true,
     *   skipWaiting: true
     * })
     */
  ]
}
