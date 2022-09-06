var startTime = +new Date()
var webpack = require('webpack')
var configOpts = require('./webpack.pro.config.js')
var {createSrcFiles, createDestFiles} = require('./prepare')

boot ()

function boot () {
  createDestFiles(_ => createSrcFiles(build))
}

function build () {
  webpack(configOpts, (err, stats) => {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    if (stats.hasErrors()) {
      console.log('\33[31m Build failed with errors.\n\33[0m')
      process.exit(1)
    }
    console.log('\33[36m Build complete with taking ' + (+new Date() - startTime) + 'ms\n\33[0m')
  })
}