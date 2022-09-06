var path = require('path')
var resolve = _ => path.resolve(__dirname, _)
var NODE_ENV = process.argv[1].indexOf('server.js') < 0 ? 'production' : 'development'
var RUN_ENV = process.argv.slice(2).reduce((arg, v) => {
  v.replace(/([^=]+)=(.+)/g, (s, a, b) => arg[a] = b)
  return arg
}, {})
process.env.NODE_ENV = NODE_ENV
process.env.RUN_ENV = RUN_ENV
var vueAll = RUN_ENV.env != 'prod' ? `<script src=/static/js/vue.js></script><script src=/static/js/vue-router.js></script><script src=/static/js/vuex.js></script>` : `<script src=/static/js/vue.all.js></script>`
var promisePolyfill = `<script src='/static/js/promise.js'></script>`
var preloadCss = `<link rel="stylesheet" href="/static/editor/themes/default/default.css" />`
var preloadScript = `<script src="/static/mxgraph/editor/js/Init.js"></script>
<script src="/static/mxgraph/mxclient${RUN_ENV.env != 'prod' ? '' : '.min'}.js"></script>
<script src="/static/editor/kindeditor${RUN_ENV.env != 'prod' ? '' : '.min'}.js"></script>
<script src="/static/editor/zh-CN.js"></script>${promisePolyfill}${vueAll}
`
module.exports = {
  node_modules: resolve('../node_modules'),
  dest: resolve('../dist'),
  src: resolve('../src'),
  srcStatic: resolve('../static'),
  desStatic: resolve('../dist/static'),
  js: resolve('../dist/js'),
  img: resolve('../dist/img'),
  css: resolve('../dist/css'),
  srcView: resolve('../src/views'),
  template: resolve('../build/index.html'),
  srcSCSSVars: resolve('../src/assets/css/var.scss'),
  favicon: resolve('../static/favicon.ico'),
  title: 'ROSS 智能运营服务平台',
  processEnv: {
    'process.env': JSON.stringify({NODE_ENV, RUN_ENV})
  },
  NODE_ENV,
  RUN_ENV,
  preloadCss,
  preloadScript,
  host: RUN_ENV.host || 'localhost',
  LOGIN_PROXY: RUN_ENV.login || 'https://ross-auth-sit.baozun.com',
  API_PROXY: RUN_ENV.api || 'http://ross-bpm-sit.baozun.com'
}
