/**
 * The reducer and saga injection code in this directory is taken from
 * the react-boilerplate project (injectSagas is minorly edited):
 * https://github.com/react-boilerplate/react-boilerplate/tree/c28e1539cefb3957fb4cfd848bf1efd34a0725d8/app/utils
 */

// saga injection mode constants
export {
  DAEMON,
  ONCE_TILL_UNMOUNT,
  RESTART_ON_REMOUNT,  // default mode if unspecified
} from './constants'

export { default as injectReducer } from './injectReducer'
export { default as injectSagas } from './injectSagas'
