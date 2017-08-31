/* eslint consistent-return:0 */

const express = require('express')
const proxy = require('express-http-proxy')
const url = require('url')
const logger = require('./logger')

const argv = require('minimist')(process.argv.slice(2))
const setupFrontendMiddleware = require('./middlewares/frontendMiddleware')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const resolve = require('path').resolve
const app = express()

// get the intended host and port number, use localhost and port 8888 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'

const frontendPort = process.env.PORT || 8888
const backendPort = process.argv[2] || 5000

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', proxy(`http://${prettyHost}:${backendPort}`, {
    proxyReqPathResolver: (req) => req.baseUrl + req.url,
}))

// In production we need to pass these values in instead of relying on webpack
setupFrontendMiddleware(app, {
  outputPath: resolve(process.cwd(), 'static'),
  publicPath: '/',
})

// Start your app.
app.listen(frontendPort, host, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(frontendPort, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr)
      }

      logger.appStarted(prettyHost, frontendPort, backendPort, url)
    })
  } else {
    logger.appStarted(prettyHost, frontendPort, backendPort)
  }
})
