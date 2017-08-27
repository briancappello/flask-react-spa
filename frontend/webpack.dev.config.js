const path = require('path')
const webpack = require('webpack')

const APP_ROOT = path.join(__dirname, 'app');
const PORT = process.env.PORT || 8888;

let VENDOR = [
    'lodash-es',
    'history',
    'react',
    'redux',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux-thunk',
    'redux-logger',
    'redbox-react',
    'react-hot-loader',
    'isomorphic-fetch',
    'sockjs-client',
    'events',
    'punycode',
    'querystring-es3',
    'url',
    'babel-polyfill',
];

module.exports = require('./webpack.base.config.js')({
    devtool: 'source-map',
        entry: {
            app: [
                `webpack-dev-server/client?http://localhost:${PORT}/`,
                'webpack/hot/only-dev-server',
                'react-hot-loader/patch',
                path.join(APP_ROOT, 'index.js'),
            ],
            vendor: ['react-hot-loader/patch'].concat(VENDOR),
        },
        plugins: [
            new webpack.DefinePlugin({
                'server': {
                    PORT,
                }
            }),
            new webpack.HotModuleReplacementPlugin({
                multiStep: true,
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                minChunks: Infinity,
                names: ['vendor', 'manifest'],
            })
        ],
})
