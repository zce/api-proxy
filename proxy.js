const url = require('url')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  target: 'http://api.douban.com',
  changeOrigin: true,
  secure: false
})

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  // append apikey
  let { query, pathname } = url.parse(proxyReq.path, true, true)
  query.apikey = query.apikey || process.env.API_KEY
  // trim trailing slash #19
  pathname = pathname.replace(/\/$/, '')
  proxyReq.path = url.format({ query, pathname })

  // change referer
  proxyReq.setHeader('referer', 'https://developers.douban.com')
})

// proxy.on('proxyRes', (proxyRes, req, res) => {
//   proxyRes.set('Access-Control-Allow-Origin', '*');
//   proxyRes.set('Access-Control-Allow-Methods', 'GET');
//   proxyRes.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
// })

proxy.on('error', (err, req, res) => {
  console.error(err)

  res.writeHead(500, { 'Content-Type': 'text/plain' })

  res.end('Something went wrong. And we are reporting a custom error message.')
})

module.exports = (req, res) => {
  proxy.web(req, res)
}
