'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const utils = require('./utils')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const {VueLoaderPlugin} = require('vue-loader');
const WebpackBar = require('webpackbar');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// TODO: favicon plugin is supper slow and have config bugs, add a single task to handle it
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const  entry = utils.getEntries('./src/domain', 'app.js', ['webpack/hot/dev-server', 'webpack-hot-middleware/client']);
//console.log(entry);
const devWebpackConfig = {
  mode: 'development',
  stats: false,
  entry,
  output: {
    path: config.dev.assetsRoot,
    publicPath: config.dev.assetsPublicPath,
    filename: '[name]/static/js/[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new VueLoaderPlugin(),
    new WebpackBar(),
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.dev.assetsSubDirectory
    //     // ignore: ['.*']
    //   }
    // ]),

    // add dll if you want to speed up build process (5% ~ 10%), but will lose vue devtool
    // new webpack.DllReferencePlugin({
    //   context: path.resolve(__dirname, '..'),
    //   manifest: require('../vendor-manifest.json')
    // }),

    // TODO: favicon plugin
    // new FaviconsWebpackPlugin(path.join(__dirname, '../logo.png')),

    // this can improve build speed 70%
    // new HardSourceWebpackPlugin()
  ]
};

var multiHtmlConfig = utils.setMultipagePlugin('./src/domain/', 'index.ejs');

module.exports = merge(baseWebpackConfig, multiHtmlConfig, devWebpackConfig)
