const url = require('url')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  target: 'https://api.douban.com',
  changeOrigin: true,
  secure: false
})

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  /* eslint-disable node/no-deprecated-api */
  // append apikey
  let { query, pathname } = url.parse(proxyReq.path, true, true)
  query.apikey = query.apikey || process.env.API_KEY
  // trim trailing slash #19
  pathname = pathname.replace(/\/$/, '')
  proxyReq.path = url.format({ query, pathname })
  /* eslint-enable */

  // change referer
  proxyReq.setHeader('referer', 'https://developers.douban.com')
})

proxy.on('proxyRes', (proxyRes, req, res) => {
  // CORS Support
  if (req.headers.origin) {
    res.setHeader('access-control-allow-credentials', true)
    res.setHeader('access-control-allow-origin', req.headers.origin)
    res.setHeader('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('access-control-allow-headers', 'Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, X-Requested-With')
    res.setHeader('access-control-max-age', 86400)
  }
})

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' })
  res.end('Something went wrong. And we are reporting a custom error message: ' + err.message)
})

module.exports = proxy.web.bind(proxy)
