const path = require('path')
const webpack = require('webpack')

module.exports = require('./webpack.base.config.js')({
    entry: {
        app: path.join(__dirname, 'app', 'index.js'),
    },
    plugins: [
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
})
