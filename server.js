const express = require('express')
const proxy = require('./api/proxy')

const app = express()

app.use((req, res, next) => {
  switch (req.path) {
    case '/':
      return res.sendFile('public/index.html', { root: __dirname })
    case '/favicon.ico':
      return res.sendFile('public/favicon.ico', { root: __dirname })
    case '/index.html':
      return res.redirect('/', 301)
  }
  next()
})

app.use(proxy)

app.listen(2080, () => {
  console.log('> http://localhost:2080')
})
