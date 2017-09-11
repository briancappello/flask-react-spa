export function inArray(val, arr) {
  return arr.indexOf(val) !== -1
}

export const isArray = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Array]'
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function isString(str) {
  return typeof str === 'string' || str instanceof String
}
