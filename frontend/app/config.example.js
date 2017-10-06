//-------------------------------------
// config.example.js
//
// 1. copy this file to config.js
// 2. adjust settings as necessary
//-------------------------------------

import {
  // debug levels in vertical order from least verbose to most
  CRITICAL,
  ERROR,
  WARNING,
  INFO,
  DEBUG,
} from 'constants.js'

// FIXME: setting process.env.PORT with webpack.DefinePlugin errors in dev mode
// (it sets server.PORT fine, so we use that as a workaround)
if (process.env.NODE_ENV != 'production') {
  process.env.PORT = server.PORT
}

// set LOGGING_ENABLED to true in dev, false in prod
export const LOGGING_ENABLED = process.env.NODE_ENV != 'production'
export const LOG_LEVEL = DEBUG

export const PORT = process.env.PORT || 8888
export const SERVER_URL = process.env.NODE_ENV == 'production'
    ? ''  // FIXME
    : `http://localhost:${PORT}`

export const SITE_NAME = 'Flask React SPA'
export const COPYRIGHT = 'Company Name'
