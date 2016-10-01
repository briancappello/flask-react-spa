const path = require('path'),
      webpack = require('webpack');

const APP_ROOT = path.join(__dirname, 'app');
const STYLES_ROOT = path.join(APP_ROOT, 'styles');

let VENDOR = [
    'lodash',
    'history',
    'react',
    'redux',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux-thunk',
    'isomorphic-fetch',
];

const commonConfig = {
    devtool: 'source-map',
    resolve: {
        root: [APP_ROOT, STYLES_ROOT],
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        app: path.join(APP_ROOT, 'index.js'),
        vendor: VENDOR,
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: APP_ROOT,
                exclude: /node_modules/,
            },
            {
                test: /\.(sass|scss)$/,
                loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap'],
            },
            {
                test: /\.png$/,
                loader: 'url?limit=100000',
            },
            {
                test: /\.(jpg|jpeg)$/,
                loader: 'file',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file',
            },
        ],
    },
    sassLoader: {
        includePaths: [STYLES_ROOT],
    },
};

let config;
// adjust config based upon `npm run lifecycle_event_str`
switch (process.env.npm_lifecycle_event) {
case 'build':
case 'build:webpack':
    // production options
    config = Object.assign({}, commonConfig, {
        plugins: [
            new webpack.ProvidePlugin({
                'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': 'production',
                }
            }),
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
            new webpack.optimize.UglifyJsPlugin({
                compressor: { warnings: false },
            }),
        ],
    });
    break;
default:
    // development opt
    config = Object.assign({}, commonConfig, {
        devtool: 'eval-source-map',
        entry: {
            app: [
                'webpack-dev-server/client?http://localhost:8888/',
                'webpack/hot/only-dev-server',
                'react-hot-loader/patch',
                path.join(APP_ROOT, 'index.js'),
            ],
            vendor: ['react-hot-loader/patch'].concat(VENDOR),
        },
        plugins: [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin({
                multiStep: true,
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
            })
        ],
    });
}

module.exports = config;
