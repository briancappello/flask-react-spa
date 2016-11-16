const path = require('path'),
      webpack = require('webpack');

const PORT = process.env.PORT || 8888;

const APP_ROOT = path.join(__dirname, 'app');
const STYLES_ROOT = path.join(APP_ROOT, 'styles');

let VENDOR = [
    'lodash',
    'lodash-es',
    'history',
    'react',
    'redux',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux-thunk',
    'redux-form',
    'isomorphic-fetch',
    'babel-polyfill',
];

const commonConfig = {
    devtool: 'source-map',
    resolve: {
        modules: [APP_ROOT, STYLES_ROOT, 'node_modules'],
        extensions: ['.js', '.jsx']
    },
    entry: {
        app: path.join(APP_ROOT, 'index.js'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    { loader: 'babel-loader' },
                ],
                include: APP_ROOT,
                exclude: /node_modules/,
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader', options: {
                        sourceMap: true,
                        includePaths: [STYLES_ROOT],
                    }},
                ],
            },
            {
                test: /\.png$/,
                use: [
                    { loader: 'url-loader', options: {
                        limit: 100000
                    }},
                ],
            },
            {
                test: /\.(jpg|jpeg)$/,
                use: [
                    { loader: 'file-loader' },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    { loader: 'file-loader' },
                ],
            },
        ],
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
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production'),
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                },
            }),
        ],
    });
    break;
default:
    // development options
    config = Object.assign({}, commonConfig, {
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
            new webpack.HotModuleReplacementPlugin({
                multiStep: true,
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                minChunks: Infinity,
                names: ['vendor', 'manifest'],
            })
        ],
    });
}

module.exports = config;
