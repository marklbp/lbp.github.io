const {createApp} = require('../src/app')
const fs = require('fs')
const Vue = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.html', 'utf-8')
})

server.get('*', (req, res) => {
  const ctx = {
    url: reql.url
  }
  const app = createApp(ctx)
  const context = {
    title: 'hello',
    meta: `
      <meta ...>
      <meta ...>
    `
  }
  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080)