/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require('path')
const defaults = require('lodash/defaultsDeep')
const webpack = require('webpack')
const pkg = require(join(process.cwd(), 'package.json'))
const dllPlugin = require('../dllConfig').dllPlugin

if (!pkg.dllPlugin) {
  console.error('Please configure dllPlugin setting in package.json to use webpack dll generator')
  process.exit(1)
}

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults)
const outputPath = join(process.cwd(), dllConfig.path)

module.exports = require('./webpack.base.config')({
  context: process.cwd(),
  entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: join(outputPath, '[name].json'),
    }),
  ],
  performance: {
    hints: false,
  },
})
