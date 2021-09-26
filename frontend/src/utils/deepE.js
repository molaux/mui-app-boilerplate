/* eslint-disable no-console */
export const isObject = (A) => (typeof A === 'object' || typeof A === 'function') && (A !== null)
const DEBUG = true
const deepE = (a, b) => {
  DEBUG && console.log(a, b)
  if (Object.keys(a).length !== Object.keys(b).length) {
    console.log('keys', Object.keys(a), Object.keys(b))
    return false
  }
  for (const k in a) {
    DEBUG && console.log(k)
    if ((typeof a[k]) !== (typeof b[k])) {
      DEBUG && console.log('type', k, typeof a[k], typeof b[k])
      DEBUG && console.log('value', k, a[k], b[k], a[k] !== b[k])
      return false
    }

    if (isObject(a[k]) || Array.isArray(a[k])) {
      if (!deepE(a[k], b[k])) {
        DEBUG && console.log('recursion not equal', k, a[k], b[k])
        return false
      }
    } else if (a[k] !== b[k]) {
      DEBUG && console.log('value', k, a[k], b[k], a[k] !== b[k])
      return false
    }
  }
  DEBUG && console.log('equal')
  return true
}

export default deepE
