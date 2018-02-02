var seajs = window.seajs = { version: "3.0.1" }
var data = seajs.data = {}
var events = data.events = {}
var _cid = 0
var loaderDir
var loaderPath


var DIRNAME_RE = /[^?#]*\//
var DOT_RE = /\/\.\//g
var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
var MULTI_SLASH_RE = /([^:/])\/+\//g
var PATHS_RE = /^([^/:]+)(\/.+)$/
var VARS_RE = /{([^{]+)}/g
var ABSOLUTE_RE = /^\/\/.|:\//
var ROOT_DIR_RE = /^.*?\/\/.*?\//
var IGNORE_LOCATION_RE = /^(about|blob):/

var dirname=function(path) {
  return path.match(DIRNAME_RE)[0]
}

var cwd = (!location.href || IGNORE_LOCATION_RE.test(location.href)) ? '' : dirname(location.href)

var doc = document
var scripts = doc.scripts
var loaderScript = doc.getElementById("seajsnode") || scripts[scripts.length - 1]
var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement
var baseElement = head.getElementsByTagName("base")[0]
var currentlyAddingScript
var interactiveScript



