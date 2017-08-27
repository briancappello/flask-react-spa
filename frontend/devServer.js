const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config.js')
const compiler = webpack(config)

const FRONTEND_PORT = process.env.PORT || 8888
const BACKEND_PORT = process.argv[2] || 5000

const server = new WebpackDevServer(compiler, {
  hot: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  stats: { colors: true, chunks: false },
  proxy: {
    '*': {
      target: `http://localhost:${BACKEND_PORT}`,
      secure: false,
      changeOrigin: true,
      cookieDomainRewrite: true,
    },
  },
})

server.listen(FRONTEND_PORT, 'localhost', function(error) {
  if (error) {
    return console.log(error)
  }

  console.log(`Listening at http://localhost:${FRONTEND_PORT}/`)
  console.log(`Proxying requests to http://localhost:${BACKEND_PORT}/`)
})
