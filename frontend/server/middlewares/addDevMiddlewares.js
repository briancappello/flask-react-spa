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
  app.use('*', proxy(`http://${options.host}:${options.backendPort}`, {
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
          if (err) {
            console.log(err)
            userRes.status(404)
            resolve('Not Found')
          } else {
            resolve(file.toString())
          }
        })
      })
    }
  }))
}
