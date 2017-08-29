const path = require('path')
const webpack = require('webpack')

const PORT = process.env.PORT || 8888

let VENDOR = [
  'lodash',
  'history',
  'react',
  'redux',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux-saga',
  'redbox-react',
  'react-hot-loader',
  'isomorphic-fetch',
  'sockjs-client',
  'events',
  'punycode',
  'querystring-es3',
  'url',
  'babel-polyfill',
]

module.exports = require('./webpack.base.config.js')({
  devtool: 'source-map',
  entry: {
    app: [
      `webpack-dev-server/client?http://localhost:${PORT}/`,
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      path.join(__dirname, 'app', 'index.js'),
    ],
    vendor: ['react-hot-loader/patch'].concat(VENDOR),
  },
  plugins: [
    new webpack.DefinePlugin({
      server: { PORT },
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      names: ['vendor', 'manifest'],
    }),
  ],
})
