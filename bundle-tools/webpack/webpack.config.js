var webpack = require("webpack");
var HtmlwebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  devtool: 'eval-source-map',//配置生成Source Maps
  entry:  {
    index: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    jquery: 'jquery'
    //react: 'react',
    //'react-dom': 'react-dom'
  },
  output: {
    pathinfo: true,
    library: "MyLibrary",
    libraryTarget: "umd",
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "[name].[hash].js"//打包后输出文件的文件名
  },
  module: {//在配置文件里添加JSON loader
    rules: [
      {
        test: /\.json$/,//匹配文件扩展名的正则表达式
        use: {
          loader: "json-loader"//loader模块名
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,//排除在外的文件目录
        use: {
          loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
          query: {
            presets: ['es2015','react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
              limit: 500000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new HtmlwebpackPlugin({
      title: 'Hello Webpack',
      filename: __dirname + '/public/index.html',
      template: "index.tpl"
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: [/*'react-dom', 'react', */'jquery', 'manifest'], // 指定公共 bundle 的名字。
      filename: "[name].js",
      miniChunks: 2
    }),

    new ExtractTextPlugin("css/style.css")
  ],
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    //colors: true, // 终端中输出结果为彩色
    historyApiFallback: true, // 不跳转
    inline: true // 实时刷新
  }
}