/**
 * this frontend dev server code is adapted from react-boilerplate:
 * https://github.com/react-boilerplate/react-boilerplate/tree/c28e1539cefb3957fb4cfd848bf1efd34a0725d8/server
 */
const express = require('express')
const proxy = require('express-http-proxy')
const url = require('url')
const logger = require('./logger')

const argv = require('minimist')(process.argv.slice(2))
const addDevMiddlewares = require('./addDevMiddlewares')
const webpackConfig = require('../internals/webpack/webpack.dev.config')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const app = express()

// get the intended host and port number, use localhost and port 8888 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const frontendHost = customHost || 'localhost'
const frontendPort = process.env.PORT || 8888

const backendPort = process.env.API_PORT || 5000
const backendHost = process.env.API_HOST || frontendHost

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use(/^\/api|auth\//, proxy(`http://${backendHost}:${backendPort}`, {
    proxyReqPathResolver: (req) => req.baseUrl + req.url,
}))

addDevMiddlewares(app, webpackConfig)

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

      logger.appStarted(frontendHost, frontendPort, backendHost, backendPort, url)
    })
  } else {
    logger.appStarted(frontendHost, frontendPort, backendHost, backendPort)
  }
})
