const path = require('path')
const webpack = require('webpack')

const APP_ROOT = path.join(__dirname, 'app');
const STYLES_ROOT = path.join(APP_ROOT, 'styles');

process.traceDeprecation = true

module.exports = (options) => ({
    devtool: 'source-map',
    resolve: {
        modules: [APP_ROOT, STYLES_ROOT, 'node_modules'],
        extensions: ['.js', '.jsx']
    },
    entry: options.entry,
    output: Object.assign({
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/static/',
    }, options.output),
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
                test: /\.json$/,
                use: [
                    { loader: 'json-loader' },
                ]
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
    plugins: options.plugins.concat([
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
    ]),
})
