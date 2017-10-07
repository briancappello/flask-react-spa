const path = require('path')
const webpack = require('webpack')

const APP_ROOT = path.join(process.cwd(), 'frontend', 'app')
const appConfig = require(path.join(APP_ROOT, 'config'))
const STYLES_ROOT = path.join(APP_ROOT, 'styles')

process.traceDeprecation = true

module.exports = (options) => ({
  devtool: options.devtool,
  target: 'web',
  performance: options.performance || {},
  resolve: {
    modules: [APP_ROOT, STYLES_ROOT, 'node_modules'],
    extensions: ['.js', '.jsx'],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  entry: options.entry,
  output: Object.assign({
    path: path.join(process.cwd(), 'static'),
    filename: '[name].js',
    publicPath: '/static/',
  }, options.output),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
        include: APP_ROOT,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [STYLES_ROOT],
              // automatically import variables into every scss file
              data: `@import "~super-skeleton/scss/base/_variables.scss";
                     @import "${__dirname}/../../app/styles/_variables.scss";
                    `,
            },
          },
        ],
      },
      {
        test: /\.json$/,
        use: [{ loader: 'json-loader' }],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg)$/,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(appConfig.HIGHLIGHT_LANGUAGES.join('|'))
    ),
    new webpack.NamedModulesPlugin(),
  ]),
})
