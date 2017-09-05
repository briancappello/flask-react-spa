const express = require('express')
const path = require('path')
const proxy = require('express-http-proxy')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

module.exports = function addDevMiddlewares(app, webpackConfig, options) {
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    silent: true, noInfo: true, stats: 'errors-only',
    // silent: false, noInfo: false, stats: { colors: true },
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem

  // this hackery is so that we get cookies from the backend, but respond
  // with webpack's generated index.html
  app.use(/^(?!\/static\/).*/, proxy(`http://${options.host}:${options.backendPort}`, {
    proxyReqPathResolver: (req) => {
      console.log(`Proxying ${req.baseUrl}`)
      return req.baseUrl
    },
    userResDecorator: (rsp, data, req, res) => {
      return new Promise((resolve, reject) => {
        // if we got a non-html response, return it as-is
        if (res._headers['content-type'].indexOf('html') === -1) {
          console.log('returning backend response.........')
          return resolve(data)
        }

        // if we got a redirect, set the correct port
        if (res.statusCode == 301 || res.statusCode == 302) {
          const location = res._headers.location.replace(options.backendPort, options.frontendPort)
          console.log(`redirecting to ${location} ..........`)
          res.location(location)
        }

        fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
          if (err) {
            console.log(err)
            res.status(404)
            resolve('Not Found')
          } else {
            console.log('returning index.html.........')
            resolve(file.toString())
          }
        })
      })
    }
  }))
}
