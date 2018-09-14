const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const del = require('del');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const utils = require('./utils')
var config = require('../config');
var webpackConfig = require('./webpack.dev.config.js');

// true it to see generated dist files
var writeToDisk = false;

const spinner = ora('building for development...');

const app = express();

portfinder.basePort = process.env.PORT || config.dev.port

var assetPaths = Object.keys(webpackConfig.entry).map(e => path.join(config.dev.assetsRoot, e))

var promises = [portfinder.getPortPromise()]
writeToDisk && promises.push(del(assetPaths))

Promise.all(promises).then(values => {
  var port = values[0], paths = values[1];

  if (paths && paths.length) {
    console.log(chalk.cyan('  Deleted files and folders:\n'))
    console.log(chalk.yellow('  ' + paths.join('\n  ')))
    console.log('\n')
  }

  webpackConfig.plugins.push(new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [`Your application is running here: http://${config.dev.host}:${port}`],
    },
    onErrors: config.dev.notifyOnErrors
    ? utils.createNotifierCallback()
    : undefined
  }))

  var devMiddelOptions = {
    publishPath: config.dev.assetsPublicPath,
    stats: false,
    writeToDisk,
    logLevel: 'silent'
  }

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, devMiddelOptions));

  app.use(hotMiddleware(compiler, {
    log: false,
    heartbeat: 2000
  }))

  app.listen(port, () => console.log(`listening on port ${port}`));
})
