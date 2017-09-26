const path = require('path')
const pullAll = require('lodash/pullAll')
const uniq = require('lodash/uniq')

const dllConfig = {
  dllPlugin: {
    defaults: {
      exclude: [
        'chalk',
        'compression',
        'express',
        'ip',
        'normalize.css',
        'super-skeleton',
        'skeleton-scss',
      ],
      include: [
        'babel-polyfill',
        'core-js',
        'history',
        'isomorphic-fetch',
        'lodash',
        'react',
        'react-dom',
        'react-helmet',
        'react-redux',
        'react-router-dom',
        'react-router-redux',
        'redux',
        'redux-form',
        'redux-saga',
      ],
    },
    entry(pkg) {
      const dependencyNames = Object.keys(pkg.dependencies)
      const exclude = pkg.dllPlugin && pkg.dllPlugin.exclude || dllConfig.dllPlugin.defaults.exclude
      const include = pkg.dllPlugin && pkg.dllPlugin.include || dllConfig.dllPlugin.defaults.include
      const includeDependencies = uniq(dependencyNames.concat(include))
      return {
        flaskApiDeps: pullAll(includeDependencies, exclude),
      }
    },
  },
}

module.exports = dllConfig
