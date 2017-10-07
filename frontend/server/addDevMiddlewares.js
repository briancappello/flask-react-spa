const express = require('express')
const path = require('path')
const proxy = require('express-http-proxy')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

module.exports = function addDevMiddlewares(app, webpackConfig) {
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    silent: true, noInfo: true, stats: 'errors-only',
    // silent: false, noInfo: false, stats: { colors: true },
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.use('/static/articles', express.static(path.join(process.cwd(), 'articles')))

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem

  // serve webpack's generated index.html for all remaining requests
  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404)
      } else {
        res.send(file.toString())
      }
    })
  })
}
