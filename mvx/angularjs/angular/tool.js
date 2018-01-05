var _undefined        = undefined,
    _null             = null,
    $$scope           = '$scope',
    $$validate        = '$validate',
    $array            = 'array',
    $boolean          = 'boolean',
    $console          = 'console',
    $date             = 'date',
    $length           = 'length',
    $name             = 'name',
    $noop             = 'noop',
    $null             = 'null',
    $number           = 'number',
    $object           = 'object',
    $string           = 'string',
    $value            = 'value',
    $selected         = 'selected',
    $undefined        = 'undefined',
    NOOP              = 'noop',
    Error             = window.Error,
    lowercase         = function (string){ return isString(string) ? string.toLowerCase() : string; },
    uppercase         = function (string){ return isString(string) ? string.toUpperCase() : string; },
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),
    jqLite,           
    jQuery,           
    slice             = [].slice,
    push              = [].push,
    error             = window[$console] ? bind(window[$console], window[$console]['error'] || noop) : noop,
    nodeName_,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/,
    uid               = ['0', '0', '0'],
    DATE_ISOSTRING_LN = 24,
    version = {
      full: '0.10.0',    // all of these placeholder strings will be replaced by rake's
      major: 0,    // compile task
      minor: 10,
      dot: 0,
      codeName: 'chicken-hands'
    },
    array = [].constructor;
    
    $angular          = 'angular',
    
    NG_EXCEPTION      = 'ng-exception',

    NG_VALIDATION_ERROR = 'ng-validation-error',
    /** @name angular */
    angular           = window[$angular] || (window[$angular] = {}),
    /** @name angular.markup */
    angularTextMarkup = extensionMap(angular, 'markup'),
    /** @name angular.attrMarkup */
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    /** @name angular.directive */
    angularDirective  = extensionMap(angular, 'directive'),
    /** @name angular.widget */
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    /** @name angular.validator */
    angularValidator  = extensionMap(angular, 'validator'),
    /** @name angular.fileter */
    angularFilter     = extensionMap(angular, 'filter'),
    /** @name angular.formatter */
    angularFormatter  = extensionMap(angular, 'formatter'),
    /** @name angular.service */
    angularService    = extensionMap(angular, 'service'),

    angularCallbacks  = extensionMap(angular, 'callbacks');


if (typeof document.getAttribute == $undefined)document.getAttribute = function() {};




var manualLowercase = function (s) {
  return isString(s)
      ? s.replace(/[A-Z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); })
      : s;
};

var manualUppercase = function (s) {
  return isString(s)
      ? s.replace(/[a-z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) & ~32); })
      : s;
};

if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }

function forEach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != $length && key != $name && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (isObject(obj) && isNumber(obj.length)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj)
        iterator.call(context, obj[key], key);
    }
  }
  return obj;
}

function forEachSorted(obj, iterator, context) {
  var keys = [];
  for (var key in obj) keys.push(key);
  keys.sort();
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}

function formatError(arg) {
  if (arg instanceof Error) {
    if (arg.stack) {
      arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ?
            'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
    } else if (arg.sourceURL) {
      arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
    }
  }
  return arg;
}

function nextUid() {
  var index = uid.length;
  var digit;

  while(index) {
    index--;
    digit = uid[index].charCodeAt(0);
    if (digit == 57 /*'9'*/) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit == 90  /*'Z'*/) {
      uid[index] = '0';
    } else {
      uid[index] = String.fromCharCode(digit + 1);
      return uid.join('');
    }
  }
  uid.unshift('0');
  return uid.join('');
}

function extend(dst) {
  forEach(arguments, function(obj){
    if (obj !== dst) {
      forEach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });
  return dst;
}

function inherit(parent, extra) {
  var Fn = function(){};
  extend(Fn,{prototype:parent});
  var fn = new Fn();
  extend(fn,extra);
  return fn;
  //return extend(new (extend(function(){}, {prototype:parent}))(), extra);
}

function noop() {}

function identity($) {return $;}

function valueFn(value) {return function(){ return value; };}

function extensionMap(angular, name, transform) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    name = (transform || identity)(name);
    if (isDefined(fn)) {
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

function isUndefined(value){ return typeof value == $undefined; }

function isDefined(value){ return typeof value != $undefined; }

function isObject(value){ return value!=null && typeof value == $object;}

function isString(value){ return typeof value == $string;}

function isNumber(value){ return typeof value == $number;}

function isDate(value){ return value instanceof Date; }

function isArray(value) { return value instanceof Array; }

function isFunction(value){ return typeof value == 'function';}

function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

function isBoolean(value) { return typeof value == $boolean; }

function isTextNode(node) { return nodeName_(node) == '#text'; }

function trim(value) {
  return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
}

function isElement(node) {
  return node &&
    (node.nodeName  // we are a direct element
    || (node.bind && node.find));  // we have a bind and find method part of jQuery API
}

function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}

function HTML(html, option) {
  this.html = html;
  this.get = lowercase(option) == 'unsafe'
    ? valueFn(html)
    : function htmlSanitize() {
        var buf = [];
        htmlParser(html, htmlSanitizeWriter(buf));
        return buf.join('');
      };
}

if (msie < 9) {
  nodeName_ = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML')
      ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName_ = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect(),
      width = (rect.width || (rect.right||0 - rect.left||0)),
      height = (rect.height || (rect.bottom||0 - rect.top||0));
  return width>0 && height>0;
}

function map(obj, iterator, context) {
  var results = [];
  forEach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}

function size(obj, ownPropsOnly) {
  var size = 0, key;

  if (isArray(obj) || isString(obj)) {
    return obj.length;
  } else if (isObject(obj)){
    for (key in obj)
      if (!ownPropsOnly || obj.hasOwnProperty(key))
        size++;
  }

  return size;
}

function includes(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return true;
  }
  return false;
}

function indexOf(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

function copy(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      forEach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
}

function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (o1 instanceof Array) {
      if ((length = o1.length) == o2.length) {
        for(key=0; key<length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      keySet = {};
      for(key in o1) {
        if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) {
          return false;
        }
        keySet[key] = true;
      }
      for(key in o2) {
        if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

function setHtml(node, html) {
  if (isLeafNode(node)) {
    if (msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
}

function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}

function elementError(element, type, error) {
  var parent;

  while (!isRenderableElement(element)) {
    parent = element.parent();
    if (parent.length) {
      element = element.parent();
    } else {
      return;
    }
  }

  if (element[0]['$NG_ERROR'] !== error) {
    element[0]['$NG_ERROR'] = error;
    if (error) {
      element.addClass(type);
      element.attr(type, error.message || error);
    } else {
      element.removeClass(type);
      element.removeAttr(type);
    }
  }
}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
  return slice.call(args, startIndex || 0);
}

function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
    return fn;
  }
}

function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  forEach((keyValue || "").split('&'), function(keyValue){
    if (keyValue) {
      key_value = keyValue.split('=');
      key = unescape(key_value[0]);
      obj[key] = isDefined(key_value[1]) ? unescape(key_value[1]) : true;
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  forEach(obj, function(value, key) {
    parts.push(escape(key) + (value === true ? '' : '=' + escape(value)));
  });
  return parts.length ? parts.join('&') : '';
}

function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}

function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace((pctEncodeSpaces ? null : /%20/g), '+');
}

function toJson(obj, pretty) {
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : null, []);
  return buf.join('');
}

function fromJson(json, useNative) {
  if (!isString(json)) return json;

  var obj;

  try {
    if (useNative && window.JSON && window.JSON.parse) {
      obj = JSON.parse(json);
      return transformDates(obj);
    }
    return parser(json, true).primary()();
  } catch (e) {
    error("fromJson error: ", json, e);
    throw e;
  }

  // TODO make forEach optionally recursive and remove this function
  function transformDates(obj) {
    if (isString(obj) && obj.length === DATE_ISOSTRING_LN) {
      return angularString.toDate(obj);
    } else if (isArray(obj) || isObject(obj)) {
      forEach(obj, function(val, name) {
        obj[name] = transformDates(val);
      });
    }
    return obj;
  }
}

function toJsonArray(buf, obj, pretty, stack) {
  if (isObject(obj)) {
    if (obj === window) {
      buf.push('WINDOW');
      return;
    }

    if (obj === document) {
      buf.push('DOCUMENT');
      return;
    }

    if (includes(stack, obj)) {
      buf.push('RECURSION');
      return;
    }
    stack.push(obj);
  }
  if (obj === null) {
    buf.push($null);
  } else if (obj instanceof RegExp) {
    buf.push(angularString.quoteUnicode(obj.toString()));
  } else if (isFunction(obj)) {
    return;
  } else if (isBoolean(obj)) {
    buf.push('' + obj);
  } else if (isNumber(obj)) {
    if (isNaN(obj)) {
      buf.push($null);
    } else {
      buf.push('' + obj);
    }
  } else if (isString(obj)) {
    return buf.push(angularString.quoteUnicode(obj));
  } else if (isObject(obj)) {
    if (isArray(obj)) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (!(item instanceof RegExp) && (isFunction(item) || isUndefined(item))) {
          buf.push($null);
        } else {
          toJsonArray(buf, item, pretty, stack);
        }
        sep = true;
      }
      buf.push("]");
    } else if (isElement(obj)) {
      // TODO(misko): maybe in dev mode have a better error reporting?
      buf.push('DOM_ELEMENT');
    } else if (isDate(obj)) {
      buf.push(angularString.quoteUnicode(angular.Date.toString(obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (obj.hasOwnProperty(k) && obj[k] !== undefined) {
          keys.push(k);
        }
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        var value = obj[key];
        if (!isFunction(value)) {
          if (comma) {
            buf.push(",");
            if (pretty) buf.push(pretty);
          }
          buf.push(angularString.quote(key));
          buf.push(":");
          toJsonArray(buf, value, childPretty, stack);
          comma = true;
        }
      }
      buf.push("}");
    }
  }
  if (isObject(obj)) {
    stack.pop();
  }
}

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld,textNode,$chld;
  for (i = 0; i < chldNodes.length; i++) {
    chld = chldNodes[i];
    textNode = isTextNode(chld);
    if(!textNode) {
      $chld = jqLite(chld);
      fn($chld, i);
    }
  }
}

function eachAttribute(element, fn){
  var i
      ,chld
      ,attr
      ,name
      ,value
      ,attrs     = element[0].attributes || []
      ,attrValue = {};
  if(attrs.length <= 0 )return;
  for (i = 0; i < attrs.length; i++) {
    attr = attrs[i];
    name = attr.name;
    value = attr.value;
    if (msie && name == 'href') {
      value = decodeURIComponent(element[0].getAttribute(name, 2));
    }
    attrValue[name] = value;
  }
  forEachSorted(attrValue, fn);
}

function assertArg(arg, name, reason) {
  if (!arg) {
    name = name||'?';
    reason = reason || "required";
    var error = new Error("Argument '" + name + "' is " + reason);
    throw error;
  }
}

function assertArgFn(arg, name) {
  var argType = typeof arg;
  var argIsFn = isFunction(arg);
  var argTypeName = argType == 'object' ? arg.constructor.name : argType;
  assertArg(argIsFn, name, 'not a function, got  ' + argTypeName);
}

function annotate(services, fn) {
  if (services instanceof Array) {
    fn.$inject = services;
    return fn;
  } else {
    var i = 0,
        length = arguments.length - 1, // last one is the destination function
        $inject = arguments[length].$inject = [];
    for (; i < length; i++) {
      $inject.push(arguments[i]);
    }
    return arguments[length]; // return the last one
  }
}

var FN_ARGS = /^function\s*[^\(]*\(([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(.+?)\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function injectionArgs(fn) {
  assertArgFn(fn);
  if (!fn.$inject) {
    var args = fn.$inject = [];
    var fnText = fn.toString().replace(STRIP_COMMENTS, '');
    var argDecl = fnText.match(FN_ARGS);
    forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
      arg.replace(FN_ARG, function(all, name){
        args.push(name);
      });
    });
  }
  return fn.$inject;
}

function formatter(format, parse) {
  return {'format':format, 'parse':parse || format};
}

function toString(obj) {
  return (isDefined(obj) && obj !== null) ? "" + obj : obj;
}

function parseBindings(string) {
  var results = [];
  var lastIndex = 0;
  var index;
  while((index = string.indexOf('{{', lastIndex)) > -1) {
    if (lastIndex < index)
      results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;

    index = string.indexOf('}}', index);
    index = index < 0 ? string.length : index + 2;

    results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;
  }
  if (lastIndex != string.length)
    results.push(string.substr(lastIndex, string.length - lastIndex));
  return results.length === 0 ? [ string ] : results;
}

function binding(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : null;
}

function hasBindings(bindings) {
  return bindings.length > 1 || binding(bindings[0]) !== null;
}

var bindTemplateCache = {};

function compileBindTemplate(template){
  var fn = bindTemplateCache[template];
  if (!fn) {
    var bindings = [];
    forEach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp
        ? function(scope, element) {
            var error, value;
            try {
              value = scope.$eval(exp);
            } catch(e) {
              scope.$service('$exceptionHandler')(e);
              error = toJson(e);
            }
            elementError(element, NG_EXCEPTION, error);
            return error ? error : value;
          }
        : function() {
            return text;
          });
    });
    bindTemplateCache[template] = fn = function(scope, element, prettyPrintJson) {
      var parts = [],
          hadOwnElement = scope.hasOwnProperty('$element'),
          oldElement = scope.$element;

      // TODO(misko): get rid of $element
      scope.$element = element;
      try {
        for (var i = 0; i < bindings.length; i++) {
          var value = bindings[i](scope, element);
          if (isElement(value))
            value = '';
          else if (isObject(value))
            value = toJson(value, prettyPrintJson);
          parts.push(value);
        }
        return parts.join('');
      } finally {
        if (hadOwnElement) {
          scope.$element = oldElement;
        } else {
          delete scope.$element;
        }
      }
    };
  }
  return fn;
}

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $eager:eager});
}

function createInjector(factoryScope, factories, instanceCache) {

  factories = factories || angularService;
  instanceCache = instanceCache || {};
  factoryScope = factoryScope || {};
  injector.invoke = invoke;

  injector.eager = function(){
    forEach(factories, function(factory, name){
      if (factory.$eager)
        injector(name);

      if (factory.$creation)
        throw new Error("Failed to register service '" + name +
        "': $creation property is unsupported. Use $eager:true or see release notes.");
    });
  };

  return injector;

  function injector(value){
    if (!(value in instanceCache)) {
      var factory = factories[value];
      if (!factory) throw Error("Unknown provider for '"+value+"'.");
      instanceCache[value] = invoke(factoryScope, factory);
    }
    return instanceCache[value];
  }

  function invoke(self, fn, args){
    args = args || [];
    var injectNames = injectionArgs(fn);
    var i = injectNames.length;
    while(i--) {
      args.unshift(injector(injectNames[i]));
    }
    return fn.apply(self, args);
  }
}

function compileToFn(exp, name) {
  var fn = isString(exp) ? expressionCompile(exp) : exp;
  assertArgFn(fn, name);
  return fn;
}

var compileCache = {};

function expressionCompile(exp) {
  if (isFunction(exp)) return exp;
  var fn = compileCache[exp];
  if (!fn) {
    fn = compileCache[exp] =  parser(exp).statements();
  }
  return fn;
}

function htmlParser( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function(){ return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        index = html.indexOf("-->");

        if ( index >= 0 ) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }

      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( START_TAG_REGEXP, parseStartTag );
          chars = false;
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        var text = index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text){
        text = text.
          replace(COMMENT_REGEXP, "$1").
          replace(CDATA_REGEXP, "$1");

        if (handler.chars) handler.chars( decodeEntities(text) );

        return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw "Parse Error: " + html;
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( closeSelfElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = emptyElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP, function(match, name, doubleQuotedValue, singleQoutedValue, unqoutedValue) {
      var value = doubleQuotedValue
        || singleQoutedValue
        || unqoutedValue
        || '';

      attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
function decodeEntities(value) {
  hiddenPre.innerHTML=value.replace(/</g,"&lt;");
  return hiddenPre.innerText || hiddenPre.textContent || '';
}
var NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

function htmlSanitizeWriter(buf){
  var ignore = false;
  var out = bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] == true) {
        out('<');
        out(tag);
        forEach(attrs, function(value, key){
          var lkey=lowercase(key);
          if (validAttrs[lkey]==true && (uriAttrs[lkey]!==true || value.match(URI_REGEXP))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = lowercase(tag);
        if (!ignore && validElements[tag] == true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}