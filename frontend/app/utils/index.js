export { default as storage } from './storage'


export function convertDates(keys) {
  return function (obj) {
    keys.forEach((key) => {
      obj[key] = obj[key] && new Date(obj[key]) || null
    })
    return obj
  }
}
