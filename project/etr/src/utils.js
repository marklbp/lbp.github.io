export function classnames (...rest) {
  let classn = ''
  for (let c of rest) {
    if (typeof c === 'boolean' || !c) {
      classn += ''
    } else if (c instanceof Array) {
      classn += ' ' + classnames(...c)
    } else if (typeof c === 'object') {
      for (let k in c) {
        classn += c[k] ? ' ' + String(k) : ''
      }
    } else {
      classn += ' ' + String(c)
    }
  }
  return classn.substring(1)
}