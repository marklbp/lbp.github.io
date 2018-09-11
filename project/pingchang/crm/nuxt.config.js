module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '平常金服ERP系统',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'pragma', content: 'no-cache' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' },
      { content: 'telephone=no', name: 'format-detection' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
   ** Customize the progress bar color
   */
   loading: { color: '#67c23a' },
  //loading: '~/components/layout/loading/loading.vue',
  /*
   ** Build configuration
   */
  build: {
    vendor: ['axios', 'v-distpicker'],
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  css: [
    '~assets/scss/main.scss',
    '~assets/scss/components/vee-validate.scss'
  ],
  plugins: [
    '~plugins/axios',
    '~plugins/element',
    '~plugins/vee-validate',
    '~plugins/global',
    { src: '~/plugins/vue-js-modal', ssr: false },
    { src: '~/plugins/utils', ssr: false }
  ],
  router: {
    middleware: ['check-auth']
    // middleware: ['check-auth','authenticated']
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [
    ['/crm', {
      target: 'http://172.16.0.218:8080', //测试环境
      //target: 'http://172.16.0.211:8080',  //开发
      // target: 'http://erp-staging.pingchang666.com:8080', // 预发布
      // target: 'http://106.75.222.143:8080', //正式
      //target: process.env.NODE_ENV !== 'production'?'http://172.16.0.211:8080':'http://172.16.0.190:8080',
      // target: 'http://172.16.0.19:8080',
      changeOrigin: true,
      pathRewrite: {'^/crm': '/crm-ft1'}
    }]
  ]
}
