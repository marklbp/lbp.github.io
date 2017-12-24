function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]"
  }
}

var isObject = function(obj){
  return {}.toString.call(obj) == "[object Object]"
}
var isString = function(obj){
  return {}.toString.call(obj) == "[object String]"
}
var isArray = function(obj){
  return {}.toString.call(obj) == "[object Array]"
}
var isFunction = function(obj){
  return {}.toString.call(obj) == "[object Function]"
}
var isUndefined = function(obj){
  return {}.toString.call(obj) == "[object Undefined]"
}

function cid() {
  return _cid++
}

function realpath(path) {
  // /a/b/./c/./d ==> /a/b/c/d
  path = path.replace(DOT_RE, "/")

  /*
    @author wh1100717
    a//b/c ==> a/b/c
    a///b/////c ==> a/b/c
    DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
  */
  path = path.replace(MULTI_SLASH_RE, "$1/")

  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, "/")
  }

  return path
}

function normalize(path) {
	// Normalize an id
	// normalize("path/to/a") ==> "path/to/a.js"
	// NOTICE: substring is faster than negative slice and RegExp
  var last = path.length - 1
  var lastC = path.charCodeAt(last)

  // If the uri ends with `#`, just return it without '#'
  if (lastC === 35 /* "#" */) {
    return path.substring(0, last)
  }

  return (path.substring(last - 2) === ".js" ||
      path.indexOf("?") > 0 ||
      lastC === 47 /* "/" */) ? path : path + ".js"
}

function parseAlias(id) {
  var alias = data.alias
  return alias && isString(alias[id]) ? alias[id] : id
}

function parsePaths(id) {
  var paths = data.paths
  var m

  if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
    id = paths[m[1]] + m[2]
  }

  return id
}

function parseVars(id) {
  var vars = data.vars

  if (vars && id.indexOf("{") > -1) {
    id = id.replace(VARS_RE, function(m, key) {
      return isString(vars[key]) ? vars[key] : m
    })
  }

  return id
}

function parseMap(uri) {
  var map = data.map
  var ret = uri

  if (map) {
    for (var i = 0, len = map.length; i < len; i++) {
      var rule = map[i]

      ret = isFunction(rule) ?
          (rule(uri) || uri) :
          uri.replace(rule[0], rule[1])

      // Only apply the first matched rule
      if (ret !== uri) break
    }
  }

  return ret
}

function addBase(id, refUri) {
  var ret
  var first = id.charCodeAt(0)

  // Absolute
  if (ABSOLUTE_RE.test(id)) {
    ret = id
  }
  // Relative
  else if (first === 46 /* "." */) {
    ret = (refUri ? dirname(refUri) : data.cwd) + id
  }
  // Root
  else if (first === 47 /* "/" */) {
    var m = data.cwd.match(ROOT_DIR_RE)
    ret = m ? m[0] + id.substring(1) : id
  }
  // Top-level
  else {
    ret = data.base + id
  }

  // Add default protocol when uri begins with "//"
  if (ret.indexOf("//") === 0) {
    ret = location.protocol + ret
  }

  return realpath(ret)
}

function id2Uri(id, refUri) {
  if (!id) return ""

  id = parseAlias(id)
  id = parsePaths(id)
  id = parseAlias(id)
  id = parseVars(id)
  id = parseAlias(id)
  id = normalize(id)
  id = parseAlias(id)

  var uri = addBase(id, refUri)
  uri = parseAlias(uri)
  uri = parseMap(uri)

  return uri
}

function getScriptAbsoluteSrc(node) {
  if (node.hasAttribute) {
  	return node.src
  }else{
  	return node.getAttribute("src", 4)
  }
}

function request(url, callback, charset, crossorigin) {
    var node = doc.createElement("script")

    if (charset) {
      node.charset = charset
    }

    if (!isUndefined(crossorigin)) {
      node.setAttribute("crossorigin", crossorigin)
    }

    addOnload(node, callback, url)

    node.async = true
    node.src = url

    // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
    // the end of the insert execution, so use `currentlyAddingScript` to
    // hold current node, for deriving url in `define` call
    currentlyAddingScript = node

    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ?
        head.insertBefore(node, baseElement) :
        head.appendChild(node)

    currentlyAddingScript = null
}

function addOnload(node, callback, url) {
    var supportOnload = "onload" in node

    if (supportOnload) {
      node.onload = onload
      node.onerror = function() {
        emit("error", { uri: url, node: node })
        onload(true)
      }
    }
    else {
      node.onreadystatechange = function() {
        if (/loaded|complete/.test(node.readyState)) {
          onload()
        }
      }
    }

    function onload(error) {
      // Ensure only run once and handle memory leak in IE
      node.onload = node.onerror = node.onreadystatechange = null

      // Remove the script to reduce memory leak
      if (!data.debug) {
        head.removeChild(node)
      }

      // Dereference the node
      node = null

      callback(error)
    }
}

function getCurrentScript() {
  if (currentlyAddingScript) {
    return currentlyAddingScript
  }

  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW
  if (interactiveScript && interactiveScript.readyState === "interactive") {
    return interactiveScript
  }

  var scripts = head.getElementsByTagName("script")

  for (var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i]
    if (script.readyState === "interactive") {
      interactiveScript = script
      return interactiveScript
    }
  }
}

function parseDependencies(s) {
  /**
 * util-deps.js - The parser for dependencies
 * ref: tests/research/parse-dependencies/test.html
 * ref: https://github.com/seajs/crequire
 */
  if(s.indexOf('require') == -1) {
    return []
  }
  var index = 0, peek, length = s.length, isReg = 1, modName = 0, res = []
  var parentheseState = 0, parentheseStack = []
  var braceState, braceStack = [], isReturn
  while(index < length) {
    readch()
    if(isBlank()) {
      if(isReturn && (peek == '\n' || peek == '\r')) {
        braceState = 0
        isReturn = 0
      }
    }
    else if(isQuote()) {
      dealQuote()
      isReg = 1
      isReturn = 0
      braceState = 0
    }
    else if(peek == '/') {
      readch()
      if(peek == '/') {
        index = s.indexOf('\n', index)
        if(index == -1) {
          index = s.length
        }
      }
      else if(peek == '*') {
        var i = s.indexOf('\n', index)
        index = s.indexOf('*/', index)
        if(index == -1) {
          index = length
        }
        else {
          index += 2
        }
        if(isReturn && i != -1 && i < index) {
          braceState = 0
          isReturn = 0
        }
      }
      else if(isReg) {
        dealReg()
        isReg = 0
        isReturn = 0
        braceState = 0
      }
      else {
        index--
        isReg = 1
        isReturn = 0
        braceState = 1
      }
    }
    else if(isWord()) {
      dealWord()
    }
    else if(isNumber()) {
      dealNumber()
      isReturn = 0
      braceState = 0
    }
    else if(peek == '(') {
      parentheseStack.push(parentheseState)
      isReg = 1
      isReturn = 0
      braceState = 1
    }
    else if(peek == ')') {
      isReg = parentheseStack.pop()
      isReturn = 0
      braceState = 0
    }
    else if(peek == '{') {
      if(isReturn) {
        braceState = 1
      }
      braceStack.push(braceState)
      isReturn = 0
      isReg = 1
    }
    else if(peek == '}') {
      braceState = braceStack.pop()
      isReg = !braceState
      isReturn = 0
    }
    else {
      var next = s.charAt(index)
      if(peek == ';') {
        braceState = 0
      }
      else if(peek == '-' && next == '-'
        || peek == '+' && next == '+'
        || peek == '=' && next == '>') {
        braceState = 0
        index++
      }
      else {
        braceState = 1
      }
      isReg = peek != ']'
      isReturn = 0
    }
  }
  return res
  function readch() {
    peek = s.charAt(index++)
  }
  function isBlank() {
    return /\s/.test(peek)
  }
  function isQuote() {
    return peek == '"' || peek == "'"
  }
  function dealQuote() {
    var start = index
    var c = peek
    var end = s.indexOf(c, start)
    if(end == -1) {
      index = length
    }
    else if(s.charAt(end - 1) != '\\') {
      index = end + 1
    }
    else {
      while(index < length) {
        readch()
        if(peek == '\\') {
          index++
        }
        else if(peek == c) {
          break
        }
      }
    }
    if(modName) {
      //maybe substring is faster  than slice .
      res.push(s.substring(start, index - 1))
      modName = 0
    }
  }
  function dealReg() {
    index--
    while(index < length) {
      readch()
      if(peek == '\\') {
        index++
      }
      else if(peek == '/') {
        break
      }
      else if(peek == '[') {
        while(index < length) {
          readch()
          if(peek == '\\') {
            index++
          }
          else if(peek == ']') {
            break
          }
        }
      }
    }
  }
  function isWord() {
    return /[a-z_$]/i.test(peek)
  }
  function dealWord() {
    var s2 = s.slice(index - 1)
    var r = /^[\w$]+/.exec(s2)[0]
    parentheseState = {
      'if': 1,
      'for': 1,
      'while': 1,
      'with': 1
    }[r]
    isReg = {
      'break': 1,
      'case': 1,
      'continue': 1,
      'debugger': 1,
      'delete': 1,
      'do': 1,
      'else': 1,
      'false': 1,
      'if': 1,
      'in': 1,
      'instanceof': 1,
      'return': 1,
      'typeof': 1,
      'void': 1
    }[r]
    isReturn = r == 'return'
    braceState = {
      'instanceof': 1,
      'delete': 1,
      'void': 1,
      'typeof': 1,
      'return': 1
    }.hasOwnProperty(r)
    modName = /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*(['"]).+?\1\s*[),]/.test(s2)
    if(modName) {
      r = /^require\s*(?:\/\*[\s\S]*?\*\/\s*)?\(\s*['"]/.exec(s2)[0]
      index += r.length - 2
    }
    else {
      index += /^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(s2)[0].length - 1
    }
  }
  function isNumber() {
    return /\d/.test(peek)
      || peek == '.' && /\d/.test(s.charAt(index))
  }
  function dealNumber() {
    var s2 = s.slice(index - 1)
    var r
    if(peek == '.') {
      r = /^\.\d+(?:E[+-]?\d*)?\s*/i.exec(s2)[0]
    }
    else if(/^0x[\da-f]*/i.test(s2)) {
      r = /^0x[\da-f]*\s*/i.exec(s2)[0]
    }
    else {
      r = /^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(s2)[0]
    }
    index += r.length - 1
    isReg = 0
  }
}