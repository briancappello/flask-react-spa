import { LOGGING_ENABLED, LOG_LEVEL } from 'config'

import { CRITICAL, ERROR, WARNING, INFO, DEBUG } from 'constants.js'


const LOG_LEVELS = {
  [CRITICAL]: 4,
  [ERROR]: 3,
  [WARNING]: 2,
  [INFO]: 1,
  [DEBUG]: 0,
}

export function log_critical(/* arguments */) {
  _log(CRITICAL, ...arguments)
}

export function log_error(/* arguments */) {
  _log(ERROR, ...arguments)
}

export function log_warning(/* arguments */) {
  _log(WARNING, ...arguments)
}

export function log_info(/* arguments */) {
  _log(INFO, ...arguments)
}

export function log_debug(/* arguments */) {
  _log(DEBUG, ...arguments)
}

export function _log(/* arguments */) {
  let level = arguments[0]

  if (level == CRITICAL || (LOGGING_ENABLED && _show_level(level))) {
    console.log(`${level}: `, ...Array.prototype.slice.call(arguments, 1))
  }
}

function _show_level(level) {
  try {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
  } catch (error) {
    throw new Error(`${level} is not a valid debug level.`)
  }
}

export default log_debug
