var CFG = require('./config')
module.exports = {
  '/__proxy__': {
    target: CFG.API_PROXY/*'http://10.45.70.11:8081'*/,
    pathRewrite: {
      '^/__proxy__': ''
    },
    changeOrigin: true,
    // secure: false,
    logLevel: 'debug'
  },
  '/__login__': {
    target: CFG.LOGIN_PROXY,
    pathRewrite: {
      '^/__login__': ''
    },
    changeOrigin: true,
    logLevel: 'debug'
  }
}