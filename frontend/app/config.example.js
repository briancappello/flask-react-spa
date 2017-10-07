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

const SERVER_URL = '' // set this if your API server is different from the frontend server

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
  SERVER_URL,
  SITE_NAME,
  COPYRIGHT,
  HIGHLIGHT_LANGUAGES,
}
