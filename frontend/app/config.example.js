//-------------------------------------
// config.example.js
//
// 1. copy this file to config.js
// 2. adjust settings as necessary
//-------------------------------------

const {
  // debug levels in vertical order from least verbose to most
  CRITICAL,
  ERROR,
  WARNING,
  INFO,
  DEBUG,
} = require('constants')

const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isDev = !(isProd || isTest)

const LOGGING_ENABLED = isDev
const LOG_LEVEL = DEBUG

const PORT = process.env.PORT || 8888
const SERVER_URL = isProd
  ? '' // FIXME
  : `http://localhost:${PORT}`

const SITE_NAME = 'Flask React SPA'
const COPYRIGHT = 'Company Name'

const HIGHLIGHT_LANGUAGES = [
  'javascript',
  'json',
  'python',
  'scss',
  'yaml',
]

module.exports = {
  LOGGING_ENABLED,
  LOG_LEVEL,
  PORT,
  SERVER_URL,
  SITE_NAME,
  COPYRIGHT,
  HIGHLIGHT_LANGUAGES,
}
