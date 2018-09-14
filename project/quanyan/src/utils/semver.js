const delimiter = '.'

function compare (v1, v2, complete) {
  v1 = String(v1)
  v2 = String(v2)
  if (v1 === v2) { return 0 }
  var v1s = v1.split(delimiter)
  var v2s = v2.split(delimiter)
  var len = Math[complete ? 'max' : 'min'](v1s.length, v2s.length)
  for (var i = 0; i < len; i++) {
    v1s[i] = typeof v1s[i] === 'undefined' ? 0 : parseInt(v1s[i], 10)
    v2s[i] = typeof v2s[i] === 'undefined' ? 0 : parseInt(v2s[i], 10)
    if (v1s[i] > v2s[i]) { return 1 }
    if (v1s[i] < v2s[i]) { return -1 }
  }
  return 0
}

const compareVersion = {
  eq (v1, v2) {
    return compare(v1, v2, false) === 0
  },
  gt (v1, v2) {
    return compare(v1, v2, true) > 0
  },
  gte (v1, v2) {
    return compare(v1, v2, true) >= 0
  },
  lt (v1, v2) {
    return compare(v1, v2, true) < 0
  },
  lte (v1, v2) {
    return compare(v1, v2, true) <= 0
  }
}

export default compareVersion
