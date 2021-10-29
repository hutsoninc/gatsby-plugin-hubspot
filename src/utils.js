exports.oneline = (...args) => {
  return args
    .reduce((acc, arg) => {
      return `${acc}${Array.isArray(arg) ? arg.join('') : arg}`
    }, '')
    .replace(/\s\s+/g, '')
}

exports.isDefined = val => {
  return typeof val !== 'undefined' && val !== null
}
