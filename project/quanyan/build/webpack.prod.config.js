'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin');
const {VueLoaderPlugin} = require('vue-loader');

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

var count = 0;

var domains = process.argv.slice(2).sort((a, b) => a > b)
var asyncBase = domains.join('~') + '/static/'

const webpackConfig = {
  mode: 'production',
  entry: utils.getEntries('./src/domain', 'app.js'),
  stats: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name]/static/js/[name].[chunkhash].js',
    chunkFilename: asyncBase + 'js/[name].[chunkhash].js',
    crossOriginLoading: 'anonymous'
  },
  optimization: {
    namedChunks: true,
    // "noEmitOnErrors": true,
    // 'runtimeChunk': {
    //   name: 'runtime'
    // },
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: config.build.productionSourceMap
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      })
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new CleanWebpackPlugin([domains.join('~')], {
      root: path.resolve(__dirname, '../dist')
    }),
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new VueLoaderPlugin(),
    // extract css into its own file
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]/static/css/[name].[hash].css',
      chunkFilename: asyncBase + 'css/[id].[hash].css'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     to: config.build.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ]),

    // Dll
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '..'),
      manifest: require('../vendor-manifest.json')
    }),

    new ManifestPlugin()
  ]
}

// Upload static to ali oss
if (config.build.uploadToAliOSS) {
  const AliossWebpackPlugin = require('alioss-webpack-plugin')

  webpackConfig.plugins.push(
    new AliossWebpackPlugin({
      ossOptions: config.build.ossOptions,
      prefix: 'assets/',
      exclude: /.*\.html$/,
      enableLog: true,
      deleteMode: false
    })
  )
}

// add crossorigin='anonymous' to <script> tag
if (config.build.addCrossoriginAttr) {
  const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

  webpackConfig.plugins.push(
    new ScriptExtHtmlWebpackPlugin({
      custom: [{
        test: /\.js$/,
        attribute: 'crossorigin',
        value: 'anonymous'
      }]
    })
  )
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

const multiHtmlConfig = utils.setMultipagePlugin('./src/domain/', 'index.ejs', {
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyJS: true,
    minifyCSS: true,
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  },
  // necessary to consistently work with multiple chunks via CommonsChunkPlugin
  chunksSortMode: 'auto',
  env: config.dev.env,
})

module.exports = merge(baseWebpackConfig, multiHtmlConfig, webpackConfig)
