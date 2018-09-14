'use strict'
const utils = require('./utils.js');
const del = require('del')
const portfinder = require('portfinder');
var webpackConfig = require('./webpack.dev.config.js');

// console.log('webpack.dev.config: ', webpackConfig)

// console.log('args: ', process.argv)
// var entry = utils.getEntries('./src/domain', 'app.js');
// console.log('webpack.entry: ', entry)

// console.log('promise.all: ', Promise.all)
// console.log('del: ', del)
//
// console.log('find port: ', portfinder.getPortPromise().then)
// console.log('del: ', del('/Users/xiad/work/gitlab2/owl/dist/hello').then)

// test configures


    // rules: [
    //   {
    //     test: /\.s?[ac]ss$/,
    //     use: [
    //       MiniCssExtractPlugin.loader,
    //       'css-loader',
    //       'postcss-loader',
    //       'sass-loader', {
    //         loader: 'sass-resources-loader',
    //         options: {
    //           resources: [path.join(__dirname, '../src/styles/vars.scss')]
    //         }
    //       }
    //     ]
    //   }
    // ]

// rules: [{
//   test: /\.css$/,
//   use: [
//     // MiniCssExtractPlugin.loader,
//     'vue-style-loader',
//     {
//       loader: 'css-loader',
//       options: {
//         sourceMap: true
//       }
//     },
//     {
//       loader: 'postcss-loader',
//       options: {
//         sourceMap: true
//       }
//     }
//   ]
// }, {
//   test: /\.postcss$/,
//   use: [
//     // MiniCssExtractPlugin.loader,
//     'vue-style-loader',
//     {
//       loader: 'css-loader',
//       options: {
//         sourceMap: true
//       }
//     },
//     {
//       loader: 'postcss-loader',
//       options: {
//         sourceMap: true
//       }
//     }
//   ]
// }]


      // cacheGroups: {
      //
      //   // Create a commons chunk, which includes all code shared between entry points.
      //   // This configuration can enlarge your initial bundles, it is recommended to use dynamic imports when a module is not immediately needed.
      //   commons: {
      //     name: "commons",
      //     chunks: "initial",
      //     minChunks: 2
      //   },
      //
      //   // Create a vendors chunk, which includes all code from node_modules in the whole application.
      //   // This might result in a large chunk containing all external packages. It is recommended to only include your core frameworks and utilities and dynamically load the rest of the dependencies.
      //   commons: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: "vendors",
      //     chunks: "all"
      //   },
      //
      //   async: {
      //     name: function (arg0, arg1, arg2) {
      //       count++ === 0 && console.log('args: ', (arg1));
      //       // console.log('args: ', (arg2));
      //       // console.log('args.index: ', arg0.index)
      //       // console.log('args.context: ', arg0.context)
      //       // arguments[0].context
      //       // console.log('arg.length: ', arguments.length)
      //
      //       return arg0.index;
      //     },
      //     // name: '__async__',
      //     minChunks: 1,
      //     minSize: 10,
      //     chunks: 'async',
      //     priority: -30
      //   },
      //
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     // name: config.dev.chunksPath,
      //     name: true,
      //     enforce: true,
      //     chunks: 'all'
      //   },
      //
      //   // Don't generate automatic common chunks
      //   default: false,
      //   // Don't generate automatic vendor chunks
      //   vendors: false,
      //   // Custom common chunk
      //   bundle: {
      //     name: 'commons',
      //     chunks: 'all',
      //     minChunks: 3,
      //     reuseExistingChunk: false,
      //   },
      //   // Custom vendor chunk by name
      //   vendor: {
      //     chunks: 'initial',
      //     name: 'vendor',
      //     test: 'vendor',
      //   },
      //
      //   // extract css into one file, not work for vue, make have problems
      //   styles: {
      //     name: 'styles',
      //     test: /\.css$/,
      //     minChunks: 1,
      //     chunks: 'all',
      //     enforce: true
      //   },
      //   // extract vue styles into one file
      //   extractVueStyles: {
      //     test: m => {
      //       return /\.vue\?vue&type=style/.test(m.identifier());
      //     },
      //     name: "vue-styles",
      //     chunks: "all",
      //
      //     // enforce: false
      //     // results in no vue-styles chunk
      //     // Only a bundle.css file
      //     enforce: true
      //   },
      //
      //   extractOtherStyles: {
      //     test: m => {
      //       return m.constructor.name == "CssModule";
      //     },
      //
      //     // enforce: false
      //     // results in no other-styles chunk
      //     // Only a bundle.css file
      //     name: "other-styles",
      //     chunks: "all",
      //     enforce: true
      //   }
      // }
