// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill'

let localStorageMock = (function() {
  let store = {}
  return {
    getItem: function(key) {
      return store[key]
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    clear: function() {
      store = {}
    },
    removeItem: function(key) {
      delete store[key]
    },
  }
})
Object.defineProperty(window, 'localStorage', { value: localStorageMock() })
