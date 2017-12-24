'use strict';
(function(window, document, undefined){
if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

var lowercase = function (string){ return isString(string) ? string.toLowerCase() : string; };

var uppercase = function (string){ return isString(string) ? string.toUpperCase() : string; };

var manualLowercase = function (s) {
  return isString(s)
      ? s.replace(/[A-Z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); })
      : s;
};
var manualUppercase = function (s) {
  return isString(s)
      ? s.replace(/[a-z]/g, function (ch) {return fromCharCode(ch.charCodeAt(0) | ~32); })
      : s;
};

if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }

var _undefined        = undefined,
    _null             = null,
    $$scope           = '$scope',
    $$validate        = '$validate',
    $angular          = 'angular',
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
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    NOOP              = 'noop',
    Error             = window.Error,
    
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),
    jqLite,          
    jQuery,          
    slice             = [].slice,
    push              = [].push,
    error             = window[$console]
                           ? bind(window[$console], window[$console]['error'] || noop)
                           : noop,

    
    angular           = window[$angular] || (window[$angular] = {}),
    
    angularTextMarkup = extensionMap(angular, 'markup'),
    
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    
    angularDirective  = extensionMap(angular, 'directive'),
    
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    
    angularValidator  = extensionMap(angular, 'validator'),
    
    angularFilter     = extensionMap(angular, 'filter'),
    
    angularFormatter  = extensionMap(angular, 'formatter'),
    
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    nodeName_,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/,
    uid               = ['0', '0', '0'],
    DATE_ISOSTRING_LN = 24;

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
    if (digit == 57 ) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit == 90  ) {
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
  return extend(new (extend(function(){}, {prototype:parent}))(), extra);
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
    (node.nodeName 
    || (node.bind && node.find)); 
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

function compile(element) {
  return new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget)
    .compile(element);
}

function parseKeyValue(keyValue) {
  var obj = {}, key_value, key;
  forEach((keyValue || "").split('&amp;'), function(keyValue){
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
  return parts.length ? parts.join('&amp;') : '';
}

function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&amp;').
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

function angularInit(config, document){
  var autobind = config.autobind;

  if (autobind) {
    var element = isString(autobind) ? document.getElementById(autobind) : document,
        scope = compile(element)(createScope()),
        $browser = scope.$service('$browser');

    if (config.css)
      $browser.addCss(config.base_url + config.css);
    else if(msie<8)
      $browser.addJs(config.ie_compat, config.ie_compat_id);
    scope.$apply();
  }
}

function angularJsConfig(document, config) {
  bindJQuery();
  var scripts = document.getElementsByTagName("script"),
      match;
  config = extend({
    ie_compat_id: 'ng-ie-compat'
  }, config);
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(rngScript);
    if (match) {
      config.base_url = match[1];
      config.ie_compat = match[1] + 'angular-ie-compat' + (match[2] || '') + '.js';
      extend(config, parseKeyValue(match[6]));
      eachAttribute(jqLite(scripts[j]), function(value, name){
        if (/^ng:/.exec(name)) {
          name = name.substring(3).replace(/-/g, '_');
          value = value || true;
          config[name] = value;
        }
      });
    }
  }
  return config;
}

function bindJQuery(){
 
  jQuery = window.jQuery;
 
  if (jQuery) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope
    });
  } else {
    jqLite = jqLiteWrap;
  }
  angular.element = jqLite;
}

function assertArg(arg, name, reason) {
  if (!arg) {
    var error = new Error("Argument '" + (name||'?') + "' is " +
        (reason || "required"));
    throw error;
  }
}

function assertArgFn(arg, name) {
  assertArg(isFunction(arg), name, 'not a function, got  ' +
      (typeof arg == 'object' ? arg.constructor.name : typeof arg));
}

var version = {
  full: '0.10.0',   
  major: 0,   
  minor: 10,
  dot: 0,
  codeName: 'chicken-hands'
};

var array = [].constructor;

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

angular.toJson = toJson;
angular.fromJson = fromJson;

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

function Template() {
  this.paths = [];
  this.children = [];
  this.linkFns = [];
  this.newScope = false;
}

Template.prototype = {
  link: function(element, scope) {
    var childScope = scope;
    if (this.newScope) {
      childScope = isFunction(this.newScope) ? scope.$new(this.newScope(scope)) : scope.$new();
      element.data($$scope, childScope);
    }
    forEach(this.linkFns, function(fn) {
      try {
        childScope.$service.invoke(childScope, fn, [element]);
      } catch (e) {
        childScope.$service('$exceptionHandler')(e);
      }
    });
    var i,
        childNodes = element[0].childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].link(jqLite(childNodes[paths[i]]), childScope);
    }
  },

  addLinkFn:function(linkingFn) {
    if (linkingFn) {
      if (!linkingFn.$inject)
        linkingFn.$inject = [];
      this.linkFns.push(linkingFn);
    }
  },

  addChild: function(index, template) {
    if (template) {
      this.paths.push(index);
      this.children.push(template);
    }
  },

  empty: function() {
    return this.linkFns.length === 0 && this.paths.length === 0;
  }
};

function Compiler(markup, attrMarkup, directives, widgets){
  this.markup = markup;
  this.attrMarkup = attrMarkup;
  this.directives = directives;
  this.widgets = widgets;
}

Compiler.prototype = {
  compile: function(templateElement) {
    templateElement = jqLite(templateElement);
    var index = 0,
        template,
        parent = templateElement.parent();
    if (templateElement.length > 1) {
     
      throw Error("Cannot compile multiple element roots: " +
          jqLite('<div>').append(templateElement.clone()).html());
    }
    if (parent && parent[0]) {
      parent = parent[0];
      for(var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == templateElement[0]) {
          index = i;
        }
      }
    }
    template = this.templatize(templateElement, index) || new Template();
    return function(scope, cloneConnectFn){
     
     
      var element = cloneConnectFn
        ? JQLitePrototype.clone.call(templateElement)
        : templateElement;
        scope = scope || createScope();
      element.data($$scope, scope);
      scope.$element = element;
      (cloneConnectFn||noop)(element, scope);
      template.link(element, scope);
      return scope;
    };
  },

  templatize: function(element, elementIndex){
    var self = this,
        widget,
        fn,
        directiveFns = self.directives,
        descend = true,
        directives = true,
        elementName = nodeName_(element),
        elementNamespace = elementName.indexOf(':') > 0 ? lowercase(elementName).replace(':', '-') : '',
        template,
        selfApi = {
          compile: bind(self, self.compile),
          descend: function(value){ if(isDefined(value)) descend = value; return descend;},
          directives: function(value){ if(isDefined(value)) directives = value; return directives;},
          scope: function(value){ if(isDefined(value)) template.newScope = template.newScope || value; return template.newScope;}
        };
    element.addClass(elementNamespace);
    template = new Template();
    eachAttribute(element, function(value, name){
      if (!widget) {
        if ((widget = self.widgets('@' + name))) {
          element.addClass('ng-attr-widget');
          widget = bind(selfApi, widget, value, element);
        }
      }
    });
    if (!widget) {
      if ((widget = self.widgets(elementName))) {
        if (elementNamespace)
          element.addClass('ng-widget');
        widget = bind(selfApi, widget, element);
      }
    }
    if (widget) {
      descend = false;
      directives = false;
      var parent = element.parent();
      template.addLinkFn(widget.call(selfApi, element));
      if (parent && parent[0]) {
        element = jqLite(parent[0].childNodes[elementIndex]);
      }
    }
    if (descend){
     
      for(var i=0, child=element[0].childNodes;
          i<child.length; i++) {
        if (isTextNode(child[i])) {
          forEach(self.markup, function(markup){
            if (i<child.length) {
              var textNode = jqLite(child[i]);
              markup.call(selfApi, textNode.text(), textNode, element);
            }
          });
        }
      }
    }

    if (directives) {
     
      eachAttribute(element, function(value, name){
        forEach(self.attrMarkup, function(markup){
          markup.call(selfApi, value, name, element);
        });
      });
      eachAttribute(element, function(value, name){
        fn = directiveFns[name];
        if (fn) {
          element.addClass('ng-directive');
          template.addLinkFn((directiveFns[name]).call(selfApi, value, element));
        }
      });
    }
   
    if (descend) {
      eachNode(element, function(child, i){
        template.addChild(i, self.templatize(child, i));
      });
    }
    return template.empty() ? null : template;
  }
};

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld;
  for (i = 0; i < chldNodes.length; i++) {
    if(!isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachAttribute(element, fn){
  var i, attrs = element[0].attributes || [], chld, attr, name, value, attrValue = {};
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

function createScope(providers, instanceCache) {
  var scope = new Scope();
  (scope.$service = createInjector(scope, providers, instanceCache)).eager();
  return scope;
}

function Scope() {
  this.$id = nextUid();
  this.$$phase = this.$parent = this.$$watchers =
                 this.$$nextSibling = this.$$prevSibling =
                 this.$$childHead = this.$$childTail = null;
  this.$destructor = noop;
  this['this'] = this.$root =  this;
  this.$$asyncQueue = [];
  this.$$listeners = {};
}

Scope.prototype = {
  
  $new: function(Class, curryArguments) {
    var Child = function() {};
     
     
    var child;
    Child.prototype = this;
    child = new Child();
    child['this'] = child;
    child.$$listeners = {};
    child.$parent = this;
    child.$id = nextUid();
    child.$$asyncQueue = [];
    child.$$phase = child.$$watchers =
      child.$$nextSibling = child.$$childHead = child.$$childTail = null;
    child.$$prevSibling = this.$$childTail;
    if (this.$$childHead) {
      this.$$childTail.$$nextSibling = child;
      this.$$childTail = child;
    } else {
      this.$$childHead = this.$$childTail = child;
    }
   
    if (Class) {
     
      var ClassPrototype = Class.prototype;
      for(var key in ClassPrototype) {
        child[key] = bind(child, ClassPrototype[key]);
      }
      this.$service.invoke(child, Class, curryArguments);
    }
    return child;
  },

  
  $watch: function(watchExp, listener) {
    var scope = this,
        get = compileToFn(watchExp, 'watch'),
        listenFn = compileToFn(listener || noop, 'listener'),
        array = scope.$$watchers,
        watcher = {
          fn: listenFn,
          last: Number.NaN,
          get: get
        };

    if (!array) {
      array = scope.$$watchers = [];
    }
   
   
    array.unshift(watcher);

    return function() {
      angularArray.remove(array, watcher);
    };
  },

  
  $digest: function() {
    var watch, value, last,
        watchers,
        asyncQueue,
        length,
        dirty, ttl = 100,
        next, current, target = this;

    if (target.$$phase) {
      throw Error(target.$$phase + ' already in progress');
    }
    do {

      dirty = false;
      current = target;
      do {
        current.$$phase = '$digest';
        asyncQueue = current.$$asyncQueue;
        while(asyncQueue.length) {
          try {
            current.$eval(asyncQueue.shift());
          } catch (e) {
            current.$service('$exceptionHandler')(e);
          }
        }
        if ((watchers = current.$$watchers)) {
         
          length = watchers.length;
          while (length--) {
            try {
              watch = watchers[length];
             
             
              if ((value = watch.get(current)) !== (last = watch.last) && !equals(value, last)) {
                dirty = true;
                watch.fn(current, watch.last = copy(value), last);
              }
            } catch (e) {
              current.$service('$exceptionHandler')(e);
            }
          }
        }

        current.$$phase = null;

       
       
       
        if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
          while(current !== target && !(next = current.$$nextSibling)) {
            current = current.$parent;
          }
        }
      } while ((current = next));

      if(!(ttl--)) {
        throw Error('100 $digest() iterations reached. Aborting!');
      }
    } while (dirty);
  },

  
  $destroy: function() {
    if (this.$root == this) return;
    this.$emit('$destroy');
    var parent = this.$parent;

    if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
    if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
    if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
    if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;
  },

  
  $eval: function(expr) {
    var fn = isString(expr)
      ? expressionCompile(expr)
      : expr || noop;
    return fn(this);
  },

  
  $evalAsync: function(expr) {
    this.$$asyncQueue.push(expr);
  },

  
  $apply: function(expr) {
    try {
      return this.$eval(expr);
    } catch (e) {
      this.$service('$exceptionHandler')(e);
    } finally {
      this.$root.$digest();
    }
  },

  
  $on: function(name, listener) {
    var namedListeners = this.$$listeners[name];
    if (!namedListeners) {
      this.$$listeners[name] = namedListeners = [];
    }
    namedListeners.push(listener);

    return function() {
      angularArray.remove(namedListeners, listener);
    };
  },

  
  $emit: function(name, args) {
    var empty = [],
        namedListeners,
        canceled = false,
        scope = this,
        event = {
          name: name,
          targetScope: scope,
          cancel: function(){canceled = true;}
        },
        listenerArgs = concat([event], arguments, 1),
        i, length;

    do {
      namedListeners = scope.$$listeners[name] || empty;
      event.currentScope = scope;
      for (i=0, length=namedListeners.length; i<length; i++) {
        try {
          namedListeners[i].apply(null, listenerArgs);
          if (canceled) return;
        } catch (e) {
          scope.$service('$exceptionHandler')(e);
        }
      }
     
      scope = scope.$parent;
    } while (scope);
  },

  
  $broadcast: function(name, args) {
    var target = this,
        current = target,
        next = target,
        event = { name: name,
                  targetScope: target },
        listenerArgs = concat([event], arguments, 1);

   
    do {
      current = next;
      event.currentScope = current;
      forEach(current.$$listeners[name], function(listener) {
        try {
          listener.apply(null, listenerArgs);
        } catch(e) {
          current.$service('$exceptionHandler')(e);
        }
      });

     
     
     
      if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
        while(current !== target && !(next = current.$$nextSibling)) {
          current = current.$parent;
        }
      }
    } while ((current = next));
  }
};

function compileToFn(exp, name) {
  var fn = isString(exp)
    ? expressionCompile(exp)
    : exp;
  assertArgFn(fn, name);
  return fn;
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

function annotate(services, fn) {
  if (services instanceof Array) {
    fn.$inject = services;
    return fn;
  } else {
    var i = 0,
        length = arguments.length - 1,
        $inject = arguments[length].$inject = [];
    for (; i < length; i++) {
      $inject.push(arguments[i]);
    }
    return arguments[length];
  }
}

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $eager:eager});
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

var OPERATORS = {
    'null':function(self){return null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    $undefined:noop,
    '+':function(self, a,b){return (isDefined(a)?a:0)+(isDefined(b)?b:0);},
    '-':function(self, a,b){return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':noop,
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

function lex(text, parseStringsForObjects){
  var dateParseLength = parseStringsForObjects ? DATE_ISOSTRING_LN : -1,
      tokens = [],
      token,
      index = 0,
      json = [],
      ch,
      lastCh = ':';

  while (index < text.length) {
    ch = text.charAt(index);
    if (is('"\'')) {
      readString(ch);
    } else if (isNumber(ch) || is('.') && isNumber(peek())) {
      readNumber();
    } else if (isIdent(ch)) {
      readIdent();
     
      if (was('{,') && json[0]=='{' &&
         (token=tokens[tokens.length-1])) {
        token.json = token.text.indexOf('.') == -1;
      }
    } else if (is('(){}[].,;:')) {
      tokens.push({
        index:index,
        text:ch,
        json:(was(':[,') && is('{[')) || is('}]:,')
      });
      if (is('{[')) json.unshift(ch);
      if (is('}]')) json.shift();
      index++;
    } else if (isWhitespace(ch)) {
      index++;
      continue;
    } else {
      var ch2 = ch + peek(),
          fn = OPERATORS[ch],
          fn2 = OPERATORS[ch2];
      if (fn2) {
        tokens.push({index:index, text:ch2, fn:fn2});
        index += 2;
      } else if (fn) {
        tokens.push({index:index, text:ch, fn:fn, json: was('[,:') && is('+-')});
        index += 1;
      } else {
        throwError("Unexpected next character ", index, index+1);
      }
    }
    lastCh = ch;
  }
  return tokens;

  function is(chars) {
    return chars.indexOf(ch) != -1;
  }

  function was(chars) {
    return chars.indexOf(lastCh) != -1;
  }

  function peek() {
    return index + 1 < text.length ? text.charAt(index + 1) : false;
  }
  function isNumber(ch) {
    return '0' <= ch && ch <= '9';
  }
  function isWhitespace(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v' || ch == '\u00A0';
  }
  function isIdent(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  }
  function isExpOperator(ch) {
    return ch == '-' || ch == '+' || isNumber(ch);
  }

  function throwError(error, start, end) {
    end = end || index;
    throw Error("Lexer Error: " + error + " at column" +
        (isDefined(start)
            ? "s " + start +  "-" + index + " [" + text.substring(start, end) + "]"
            : " " + end) +
        " in expression [" + text + "].");
  }

  function readNumber() {
    var number = "";
    var start = index;
    while (index < text.length) {
      var ch = lowercase(text.charAt(index));
      if (ch == '.' || isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = peek();
        if (ch == 'e' && isExpOperator(peekCh)) {
          number += ch;
        } else if (isExpOperator(ch) &&
            peekCh && isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (isExpOperator(ch) &&
            (!peekCh || !isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          throwError('Invalid exponent');
        } else {
          break;
        }
      }
      index++;
    }
    number = 1 * number;
    tokens.push({index:start, text:number, json:true,
      fn:function(){return number;}});
  }
  function readIdent() {
    var ident = "";
    var start = index;
    var fn;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (ch == '.' || isIdent(ch) || isNumber(ch)) {
        ident += ch;
      } else {
        break;
      }
      index++;
    }
    fn = OPERATORS[ident];
    tokens.push({
      index:start,
      text:ident,
      json: fn,
      fn:fn||extend(getterFn(ident), {
        assign:function(self, value){
          return setter(self, ident, value);
        }
      })
    });
  }

  function readString(quote) {
    var start = index;
    index++;
    var string = "";
    var rawString = quote;
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      rawString += ch;
      if (escape) {
        if (ch == 'u') {
          var hex = text.substring(index + 1, index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            throwError( "Invalid unicode escape [\\u" + hex + "]");
          index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        index++;
        tokens.push({index:start, text:rawString, string:string, json:true,
          fn:function(){
            return (string.length == dateParseLength)
              ? angular['String']['toDate'](string)
              : string;
          }});
        return;
      } else {
        string += ch;
      }
      index++;
    }
    throwError("Unterminated quote", start);
  }
}

function parser(text, json){
  var ZERO = valueFn(0),
      tokens = lex(text, json),
      assignment = _assignment,
      assignable = logicalOR,
      functionCall = _functionCall,
      fieldAccess = _fieldAccess,
      objectIndex = _objectIndex,
      filterChain = _filterChain,
      functionIdent = _functionIdent,
      pipeFunction = _pipeFunction;
  if(json){
   
   
    assignment = logicalOR;
    functionCall =
      fieldAccess =
      objectIndex =
      assignable =
      filterChain =
      functionIdent =
      pipeFunction =
        function (){ throwError("is not valid json", {text:text, index:0}); };
  }
 
 
  return {
      assignable: assertConsumed(assignable),
      primary: assertConsumed(primary),
      statements: assertConsumed(statements),
      validator: assertConsumed(validator),
      formatter: assertConsumed(formatter),
      filter: assertConsumed(filter)
  };

  function assertConsumed(fn) {
    return function(){
      var value = fn();
      if (tokens.length !== 0) {
        throwError("is an unexpected token", tokens[0]);
      }
      return value;
    };
  }

 
  function throwError(msg, token) {
    throw Error("Syntax Error: Token '" + token.text +
      "' " + msg + " at column " +
      (token.index + 1) + " of the expression [" +
      text + "] starting at [" + text.substring(token.index) + "].");
  }

  function peekToken() {
    if (tokens.length === 0)
      throw Error("Unexpected end of expression: " + text);
    return tokens[0];
  }

  function peek(e1, e2, e3, e4) {
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  }

  function expect(e1, e2, e3, e4){
    var token = peek(e1, e2, e3, e4);
    if (token) {
      if (json && !token.json) {
        throwError("is not valid json", token);
      }
      tokens.shift();
      return token;
    }
    return false;
  }

  function consume(e1){
    if (!expect(e1)) {
      throwError("is unexpected, expecting [" + e1 + "]", peek());
    }
  }

  function unaryFn(fn, right) {
    return function(self) {
      return fn(self, right(self));
    };
  }

  function binaryFn(left, fn, right) {
    return function(self) {
      return fn(self, left(self), right(self));
    };
  }

  function hasTokens () {
    return tokens.length > 0;
  }

  function statements(){
    var statements = [];
    while(true) {
      if (tokens.length > 0 && !peek('}', ')', ';', ']'))
        statements.push(filterChain());
      if (!expect(';')) {
       
       
        return statements.length == 1
          ? statements[0]
          : function (self){
            var value;
            for ( var i = 0; i < statements.length; i++) {
              var statement = statements[i];
              if (statement)
                value = statement(self);
            }
            return value;
          };
      }
    }
  }

  function _filterChain(){
    var left = expression();
    var token;
    while(true) {
      if ((token = expect('|'))) {
        left = binaryFn(left, token.fn, filter());
      } else {
        return left;
      }
    }
  }

  function filter(){
    return pipeFunction(angularFilter);
  }

  function validator(){
    return pipeFunction(angularValidator);
  }

  function formatter(){
    var token = expect();
    var formatter = angularFormatter[token.text];
    var argFns = [];
    if (!formatter) throwError('is not a valid formatter.', token);
    while(true) {
      if ((token = expect(':'))) {
        argFns.push(expression());
      } else {
        return valueFn({
          format:invokeFn(formatter.format),
          parse:invokeFn(formatter.parse)
        });
      }
    }
    function invokeFn(fn){
      return function(self, input){
        var args = [input];
        for ( var i = 0; i < argFns.length; i++) {
          args.push(argFns[i](self));
        }
        return fn.apply(self, args);
      };
    }
  }

  function _pipeFunction(fnScope){
    var fn = functionIdent(fnScope);
    var argsFn = [];
    var token;
    while(true) {
      if ((token = expect(':'))) {
        argsFn.push(expression());
      } else {
        var fnInvoke = function(self, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self));
          }
          return fn.apply(self, args);
        };
        return function(){
          return fnInvoke;
        };
      }
    }
  }

  function expression(){
    return assignment();
  }

  function _assignment(){
    var left = logicalOR();
    var right;
    var token;
    if ((token = expect('='))) {
      if (!left.assign) {
        throwError("implies assignment but [" +
          text.substring(0, token.index) + "] can not be assigned to", token);
      }
      right = logicalOR();
      return function(self){
        return left.assign(self, right(self));
      };
    } else {
      return left;
    }
  }

  function logicalOR(){
    var left = logicalAND();
    var token;
    while(true) {
      if ((token = expect('||'))) {
        left = binaryFn(left, token.fn, logicalAND());
      } else {
        return left;
      }
    }
  }

  function logicalAND(){
    var left = equality();
    var token;
    if ((token = expect('&&'))) {
      left = binaryFn(left, token.fn, logicalAND());
    }
    return left;
  }

  function equality(){
    var left = relational();
    var token;
    if ((token = expect('==','!='))) {
      left = binaryFn(left, token.fn, equality());
    }
    return left;
  }

  function relational(){
    var left = additive();
    var token;
    if ((token = expect('<', '>', '<=', '>='))) {
      left = binaryFn(left, token.fn, relational());
    }
    return left;
  }

  function additive(){
    var left = multiplicative();
    var token;
    while ((token = expect('+','-'))) {
      left = binaryFn(left, token.fn, multiplicative());
    }
    return left;
  }

  function multiplicative(){
    var left = unary();
    var token;
    while ((token = expect('*','/','%'))) {
      left = binaryFn(left, token.fn, unary());
    }
    return left;
  }

  function unary(){
    var token;
    if (expect('+')) {
      return primary();
    } else if ((token = expect('-'))) {
      return binaryFn(ZERO, token.fn, unary());
    } else if ((token = expect('!'))) {
      return unaryFn(token.fn, unary());
    } else {
      return primary();
    }
  }

  function _functionIdent(fnScope) {
    var token = expect();
    var element = token.text.split('.');
    var instance = fnScope;
    var key;
    for ( var i = 0; i < element.length; i++) {
      key = element[i];
      if (instance)
        instance = instance[key];
    }
    if (!isFunction(instance)) {
      throwError("should be a function", token);
    }
    return instance;
  }

  function primary() {
    var primary;
    if (expect('(')) {
      var expression = filterChain();
      consume(')');
      primary = expression;
    } else if (expect('[')) {
      primary = arrayDeclaration();
    } else if (expect('{')) {
      primary = object();
    } else {
      var token = expect();
      primary = token.fn;
      if (!primary) {
        throwError("not a primary expression", token);
      }
    }
    var next;
    while ((next = expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = functionCall(primary);
      } else if (next.text === '[') {
        primary = objectIndex(primary);
      } else if (next.text === '.') {
        primary = fieldAccess(primary);
      } else {
        throwError("IMPOSSIBLE");
      }
    }
    return primary;
  }

  function _fieldAccess(object) {
    var field = expect().text;
    var getter = getterFn(field);
    return extend(function (self){
      return getter(object(self));
    }, {
      assign:function(self, value){
        return setter(object(self), field, value);
      }
    });
  }

  function _objectIndex(obj) {
    var indexFn = expression();
    consume(']');
    return extend(
      function (self){
        var o = obj(self);
        var i = indexFn(self);
        return (o) ? o[i] : undefined;
      }, {
        assign:function(self, value){
          return obj(self)[indexFn(self)] = value;
        }
      });
  }

  function _functionCall(fn) {
    var argsFn = [];
    if (peekToken().text != ')') {
      do {
        argsFn.push(expression());
      } while (expect(','));
    }
    consume(')');
    return function (self){
      var args = [];
      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](self));
      }
      var fnPtr = fn(self) || noop;
     
      return fnPtr.apply
          ? fnPtr.apply(self, args)
          : fnPtr(args[0], args[1], args[2], args[3], args[4]);
    };
  }

 
  function arrayDeclaration () {
    var elementFns = [];
    if (peekToken().text != ']') {
      do {
        elementFns.push(expression());
      } while (expect(','));
    }
    consume(']');
    return function (self){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self));
      }
      return array;
    };
  }

  function object () {
    var keyValues = [];
    if (peekToken().text != '}') {
      do {
        var token = expect(),
        key = token.string || token.text;
        consume(":");
        var value = expression();
        keyValues.push({key:key, value:value});
      } while (expect(','));
    }
    consume('}');
    return function (self){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        var value = keyValue.value(self);
        object[keyValue.key] = value;
      }
      return object;
    };
  }

  function watchDecl () {
    var anchorName = expect().text;
    consume(":");
    var expressionFn;
    if (peekToken().text == '{') {
      consume("{");
      expressionFn = statements();
      consume("}");
    } else {
      expressionFn = expression();
    }
    return function(self) {
      return {name:anchorName, fn:expressionFn};
    };
  }
}

function setter(obj, path, setValue) {
  var element = path.split('.');
  for (var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var propertyObj = obj[key];
    if (!propertyObj) {
      propertyObj = {};
      obj[key] = propertyObj;
    }
    obj = propertyObj;
  }
  obj[element.shift()] = setValue;
  return setValue;
}

function getter(obj, path, bindFnToScope) {
  if (!path) return obj;
  var keys = path.split('.');
  var key;
  var lastInstance = obj;
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    key = keys[i];
    if (obj) {
      obj = (lastInstance = obj)[key];
    }
    if (isUndefined(obj)  && key.charAt(0) == '$') {
      var type = angularGlobal.typeOf(lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : _undefined;
      if (fn) {
        return obj = bind(lastInstance, fn, lastInstance);
      }
    }
  }
  if (!bindFnToScope && isFunction(obj)) {
    return bind(lastInstance, obj);
  }
  return obj;
}

var getterFnCache = {},
    compileCache = {},
    JS_KEYWORDS = {};

forEach(
    ("abstract,boolean,break,byte,case,catch,char,class,const,continue,debugger,default," +
    "delete,do,double,else,enum,export,extends,false,final,finally,float,for,function,goto," +
    "if,implements,import,ininstanceof,intinterface,long,native,new,null,package,private," +
    "protected,public,return,short,static,super,switch,synchronized,this,throw,throws," +
    "transient,true,try,typeof,var,volatile,void,undefined,while,with").split(/,/),
  function(key){ JS_KEYWORDS[key] = true;}
);

function getterFn(path) {
  var fn = getterFnCache[path];
  if (fn) return fn;

  var code = 'var l, fn, t;\n';
  forEach(path.split('.'), function(key) {
    key = (JS_KEYWORDS[key]) ? '["' + key + '"]' : '.' + key;
    code += 'if(!s) return s;\n' +
            'l=s;\n' +
            's=s' + key + ';\n' +
            'if(typeof s=="function" && !(s instanceof RegExp)) s = function(){ return l' +
              key + '.apply(l, arguments); };\n';
    if (key.charAt(1) == '$') {
     
      var name = key.substr(2);
      code += 'if(!s) {\n' +
              ' t = angular.Global.typeOf(l);\n' +
              ' fn = (angular[t.charAt(0).toUpperCase() + t.substring(1)]||{})["' + name + '"];\n' +
              ' if (fn) s = function(){ return fn.apply(l, ' +
                   '[l].concat(Array.prototype.slice.call(arguments, 0))); };\n' +
              '}\n';
    }
  });
  code += 'return s;';
  fn = Function('s', code);
  fn["toString"] = function(){ return code; };

  return getterFnCache[path] = fn;
}

function compileExpr(expr) {
  return parser(expr).statements();
}

function expressionCompile(exp) {
  if (isFunction(exp)) return exp;
  var fn = compileCache[exp];
  if (!fn) {
    fn = compileCache[exp] =  parser(exp).statements();
  }
  return fn;
}

function Route(template, defaults) {
  this.template = template = template + '#';
  this.defaults = defaults || {};
  var urlParams = this.urlParams = {};
  forEach(template.split(/\W/), function(param){
    if (param && template.match(new RegExp(":" + param + "\\W"))) {
      urlParams[param] = true;
    }
  });
}

Route.prototype = {
  url: function(params) {
    var self = this,
        url = this.template,
        encodedVal;

    params = params || {};
    forEach(this.urlParams, function(_, urlParam){
      encodedVal = encodeUriSegment(params[urlParam] || self.defaults[urlParam] || "");
      url = url.replace(new RegExp(":" + urlParam + "(\\W)"), encodedVal + "$1");
    });
    url = url.replace(/\/?#$/, '');
    var query = [];
    forEachSorted(params, function(value, key){
      if (!self.urlParams[key]) {
        query.push(encodeUriQuery(key) + '=' + encodeUriQuery(value));
      }
    });
    url = url.replace(/\/*$/, '');
    return url + (query.length ? '?' + query.join('&') : '');
  }
};

function ResourceFactory(xhr) {
  this.xhr = xhr;
}

ResourceFactory.DEFAULT_ACTIONS = {
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'}
};

ResourceFactory.prototype = {
  route: function(url, paramDefaults, actions){
    var self = this;
    var route = new Route(url);
    actions = extend({}, ResourceFactory.DEFAULT_ACTIONS, actions);
    function extractParams(data){
      var ids = {};
      forEach(paramDefaults || {}, function(value, key){
        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
      });
      return ids;
    }

    function Resource(value){
      copy(value || {}, this);
    }

    forEach(actions, function(action, name){
      var isPostOrPut = action.method == 'POST' || action.method == 'PUT';
      Resource[name] = function (a1, a2, a3, a4) {
        var params = {};
        var data;
        var success = noop;
        var error = null;
        switch(arguments.length) {
        case 4:
          error = a4;
          success = a3;
          //fallthrough
        case 3:
        case 2:
          if (isFunction(a2)) {
            if (isFunction(a1)) {
              success = a1;
              error = a2;
              break;
            }

            success = a2;
            error = a3;
            //fallthrough
          } else {
            params = a1;
            data = a2;
            success = a3;
            break;
          }
        case 1:
          if (isFunction(a1)) success = a1;
          else if (isPostOrPut) data = a1;
          else params = a1;
          break;
        case 0: break;
        default:
          throw "Expected between 0-4 arguments [params, data, success, error], got " +
            arguments.length + " arguments.";
        }

        var value = this instanceof Resource ? this : (action.isArray ? [] : new Resource(data));
        self.xhr(
          action.method,
          route.url(extend({}, action.params || {}, extractParams(data), params)),
          data,
          function(status, response) {
            if (response) {
              if (action.isArray) {
                value.length = 0;
                forEach(response, function(item) {
                  value.push(new Resource(item));
                });
              } else {
                copy(response, value);
              }
            }
            (success||noop)(value);
          },
          error || action.verifyCache,
          action.verifyCache);
        return value;
      };

      Resource.bind = function(additionalParamDefaults){
        return self.route(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      Resource.prototype['$' + name] = function(a1, a2, a3) {
        var params = extractParams(this),
            success = noop,
            error;

        switch(arguments.length) {
        case 3: params = a1; success = a2; error = a3; break;
        case 2:
        case 1:
          if (isFunction(a1)) {
            success = a1;
            error = a2;
          } else {
            params = a1;
            success = a2 || noop;
          }
        case 0: break;
        default:
          throw "Expected between 1-3 arguments [params, success, error], got " +
            arguments.length + " arguments.";
        }
        var data = isPostOrPut ? this : undefined;
        Resource[name].call(this, params, data, success, error);
      };
    });
    return Resource;
  }
};

var XHR = window.XMLHttpRequest || function () {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};

function Browser(window, document, body, XHR, $log) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {},
      lastLocationUrl;

  self.isMock = false;

 
 
 
  var idCounter = 0;
  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  
  self.xhr = function(method, url, post, callback, headers) {
    outstandingRequestCount ++;
    if (lowercase(method) == 'json') {
      var callbackId = ("angular_" + Math.random() + '_' + (idCounter++)).replace(/\d\./, '');
      window[callbackId] = function(data) {
        window[callbackId].data = data;
      };

      var script = self.addJs(url.replace('JSON_CALLBACK', callbackId), null, function() {
        if (window[callbackId].data) {
          completeOutstandingRequest(callback, 200, window[callbackId].data);
        } else {
          completeOutstandingRequest(callback);
        }
        delete window[callbackId];
        body[0].removeChild(script);
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
          if (value) xhr.setRequestHeader(key, value);
      });
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
         
          var status = xhr.status == 1223 ? 204 : xhr.status || 200;
          completeOutstandingRequest(callback, status, xhr.responseText);
        }
      };
      xhr.send(post || '');
    }
  };

  
  self.notifyWhenNoOutstandingRequests = function(callback) {
   
   
   
    forEach(pollFns, function(pollFn){ pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

 
 
 
  var pollFns = [],
      pollTimeout;

  
  self.addPollFn = function(fn) {
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  
  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn){ pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

 
 
 

  
  self.setUrl = function(url) {

    var existingURL = lastLocationUrl;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    if (existingURL != url) {
      location.href = url;
    }
   };

  
  self.getUrl = function() {
    return lastLocationUrl = location.href;
  };

  
  self.onHashChange = function(listener) {
   
    var dm = window.document.documentMode;
    if ('onhashchange' in window && (isUndefined(dm) || dm >= 8)) {
      jqLite(window).bind('hashchange', listener);
    } else {
      var lastBrowserUrl = self.getUrl();

      self.addPollFn(function() {
        if (lastBrowserUrl != self.getUrl()) {
          listener();
          lastBrowserUrl = self.getUrl();
        }
      });
    }
    return listener;
  };

 
 
 
  var lastCookies = {};
  var lastCookieString = '';

  
  self.cookies = function (name, value) {
    var cookieLength, cookieArray, cookie, i, keyValue, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = escape(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          rawDocument.cookie = escape(name) + '=' + escape(value);

          cookieLength = name.length + value.length + 1;
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
          if (lastCookies.length > 20) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because too many cookies " +
              "were already set (" + lastCookies.length + " > 20 )");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) {
            lastCookies[unescape(cookie.substring(0, index))] = unescape(cookie.substring(index + 1));
          }
        }
      }
      return lastCookies;
    }
  };

  
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };

  

  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
  };

 
 
 
  var hoverListener = noop;

  
  self.hover = function(listener) { hoverListener = listener; };

  
  self.bind = function() {
    document.bind("mouseover", function(event){
      hoverListener(jqLite(msie ? event.srcElement : event.target), true);
      return true;
    });
    document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      hoverListener(jqLite(event.target), false);
      return true;
    });
  };

  
  self.addCss = function(url) {
    var link = jqLite(rawDocument.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    body.append(link);
  };

  
  self.addJs = function(url, domId, done) {
   
   
   
   
   
   
   
    var script = rawDocument.createElement('script');

    script.type = 'text/javascript';
    script.src = url;
    if (domId) script.id = domId;

    if (msie) {
      script.onreadystatechange = function() {
        /loaded|complete/.test(script.readyState) && done && done();
      };
    } else {
      if (done) script.onload = script.onerror = done;
    }

    body[0].appendChild(script);

    return script;
  };
}

var START_TAG_REGEXP = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
  END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\s*\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  URI_REGEXP = /^((ftp|https?):\/\/|mailto:|#)/,
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;

var emptyElements = makeMap("area,br,col,hr,img");

var blockElements = makeMap("address,blockquote,center,dd,del,dir,div,dl,dt,"+
    "hr,ins,li,map,menu,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

var inlineElements = makeMap("a,abbr,acronym,b,bdo,big,br,cite,code,del,dfn,em,font,i,img,"+
    "ins,kbd,label,map,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var");
var closeSelfElements = makeMap("colgroup,dd,dt,li,p,td,tfoot,th,thead,tr");
var specialElements = makeMap("script,style");
var validElements = extend({}, emptyElements, blockElements, inlineElements, closeSelfElements);

var uriAttrs = makeMap("background,href,longdesc,src,usemap");
var validAttrs = extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function htmlParser( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function(){ return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

   
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

     
      if ( html.indexOf("<!--") === 0 ) {
        index = html.indexOf("-->");

        if ( index >= 0 ) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }

     
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

     
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
     
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
     
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

     
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
function decodeEntities(value) {
  hiddenPre.innerHTML=value.replace(/</g,"&amp;lt;");
  return hiddenPre.innerText || hiddenPre.textContent || '';
}

function encodeEntities(value) {
  return value.
    replace(/&amp;/g, '&amp;amp;').
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&amp;#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&amp;lt;').
    replace(/>/g, '&amp;gt;');
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

var jqCache = {},
    jqName = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListenerFn = (window.document.addEventListener
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}
      : function(element, type, fn) {element.attachEvent('on' + type, fn);}),
    removeEventListenerFn = (window.document.removeEventListener
      ? function(element, type, fn) {element.removeEventListener(type, fn, false); }
      : function(element, type, fn) {element.detachEvent('on' + type, fn); });

function jqNextId() { return (jqId++); }

function getStyle(element) {
  var current = {}, style = element[0].style, value, name, i;
  if (typeof style.length == 'number') {
    for(i = 0; i < style.length; i++) {
      name = style[i];
      current[name] = style[name];
    }
  } else {
    for (name in style) {
      value = style[name];
      if (1*name != name && name != 'cssText' && value && typeof value == 'string' && value !='false')
        current[name] = value;
    }
  }
  return current;
}

function jqLiteWrap(element) {
  if (isString(element) && element.charAt(0) != '<') {
    throw new Error('selectors not implemented');
  }
  return new JQLite(element);
}

function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  } else if (isString(element)) {
    var div = document.createElement('div');
   
   
    div.innerHTML = '<div>&amp;nbsp;</div>' + element;
    div.removeChild(div.firstChild);
    JQLiteAddNodes(this, div.childNodes);
    this.remove();
  } else {
    JQLiteAddNodes(this, element);
  }
}

function JQLiteClone(element) {
  return element.cloneNode(true);
}

function JQLiteDealoc(element){
  JQLiteRemoveData(element);
  for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {
    JQLiteDealoc(children[i]);
  }
}

function JQLiteRemoveData(element) {
  var cacheId = element[jqName],
  cache = jqCache[cacheId];
  if (cache) {
    forEach(cache.bind || {}, function(fn, type){
      removeEventListenerFn(element, type, fn);
    });
    delete jqCache[cacheId];
    element[jqName] = undefined;
  }
}

function JQLiteData(element, key, value) {
  var cacheId = element[jqName],
      cache = jqCache[cacheId || -1];
  if (isDefined(value)) {
    if (!cache) {
      element[jqName] = cacheId = jqNextId();
      cache = jqCache[cacheId] = {};
    }
    cache[key] = value;
  } else {
    return cache ? cache[key] : null;
  }
}

function JQLiteHasClass(element, selector, _) {
 
 
  var className = " " + selector + " ";
  return ((" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf( className ) > -1);
}

function JQLiteRemoveClass(element, selector) {
  if (selector) {
    forEach(selector.split(' '), function(cssClass) {
      element.className = trim(
          (" " + element.className + " ")
          .replace(/[\n\t]/g, " ")
          .replace(" " + trim(cssClass) + " ", " ")
      );
    });
  }
}

function JQLiteAddClass(element, selector) {
  if (selector) {
    forEach(selector.split(' '), function(cssClass) {
      if (!JQLiteHasClass(element, cssClass)) {
        element.className = trim(element.className + ' ' + trim(cssClass));
      }
    });
  }
}

function JQLiteAddNodes(root, elements) {
  if (elements) {
    elements = (!elements.nodeName && isDefined(elements.length) && !isWindow(elements))
      ? elements
      : [ elements ];
    for(var i=0; i < elements.length; i++) {
      root.push(elements[i]);
    }
  }
}

var JQLitePrototype = JQLite.prototype = {
  ready: function(fn) {
    var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    this.bind('DOMContentLoaded', trigger);
   
    jqLiteWrap(window).bind('load', trigger);
  },
  toString: function() {
    var value = [];
    forEach(this, function(e){ value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};

var SPECIAL_ATTR = makeMap("multiple,selected,checked,disabled,readonly");

forEach({
  data: JQLiteData,

  scope: function(element) {
    var scope;
    while (element && !(scope = jqLite(element).data($$scope))) {
      element = element.parentNode;
    }
    return scope;
  },

  removeAttr: function(element,name) {
    element.removeAttribute(name);
  },

  hasClass: JQLiteHasClass,

  css: function(element, name, value) {
    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      return element.style[name];
    }
  },

  attr: function(element, name, value){
    if (name === 'class') {
      if(isDefined(value)) {
        element.className = value;
      } else {
        return element.className;
      }
    } else if (SPECIAL_ATTR[name]) {
      if (isDefined(value)) {
        element[name] = !!value;
      } else {
        return element[name];
      }
    } else if (isDefined(value)) {
      element.setAttribute(name, value);
    } else if (element.getAttribute) {
     
     
      var ret = element.getAttribute(name, 2);
     
      return ret === null ? undefined : ret;
    }
  },

  text: extend((msie < 9)
      ? function(element, value) {
       
        if (element.nodeType == 3) {
          if (isUndefined(value))
            return element.nodeValue;
          element.nodeValue = value;
        } else {
          if (isUndefined(value))
            return element.innerText;
          element.innerText = value;
        }
      }
      : function(element, value) {
        if (isUndefined(value)) {
          return element.textContent;
        }
        element.textContent = value;
      }, {$dv:''}),

  val: function(element, value) {
    if (isUndefined(value)) {
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      JQLiteDealoc(childNodes[i]);
    }
    element.innerHTML = value;
  }
}, function(fn, name){
  
  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;

    if ((fn.length == 2 ? arg1 : arg2) === undefined) {
      if (isObject(arg1)) {
       
        for(i=0; i < this.length; i++) {
          for (key in arg1) {
            fn(this[i], key, arg1[key]);
          }
        }
       
        return this;
      } else {
       
        if (this.length)
          return fn(this[0], arg1, arg2);
      }
    } else {
     
      for(i=0; i < this.length; i++) {
        fn(this[i], arg1, arg2);
      }
     
      return this;
    }
    return fn.$dv;
  };
});

forEach({
  removeData: JQLiteRemoveData,

  dealoc: JQLiteDealoc,

  bind: function(element, type, fn){
    var bind = JQLiteData(element, 'bind');
    if (!bind) JQLiteData(element, 'bind', bind = {});
    forEach(type.split(' '), function(type){
      var eventHandler = bind[type];
      if (!eventHandler) {
        bind[type] = eventHandler = function(event) {
          if (!event.preventDefault) {
            event.preventDefault = function(){
              event.returnValue = false;
            };
          }
          if (!event.stopPropagation) {
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
          }
          if (!event.target) {
            event.target = event.srcElement || document;
          }
          forEach(eventHandler.fns, function(fn){
            fn.call(element, event);
          });
        };
        eventHandler.fns = [];
        addEventListenerFn(element, type, eventHandler);
      }
      eventHandler.fns.push(fn);
    });
  },

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    JQLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node){
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element){
      if (element.nodeName != '#text')
        children.push(element);
    });
    return children;
  },

  append: function(element, node) {
    forEach(new JQLite(node), function(child){
      if (element.nodeType === 1)
        element.appendChild(child);
    });
  },

  prepend: function(element, node) {
    if (element.nodeType === 1) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child){
        if (index) {
          element.insertBefore(child, index);
        } else {
          element.appendChild(child);
          index = child;
        }
      });
    }
  },

  remove: function(element) {
    JQLiteDealoc(element);
    var parent = element.parentNode;
    if (parent) parent.removeChild(element);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;
    forEach(new JQLite(newElement), function(node){
      parent.insertBefore(node, index.nextSibling);
      index = node;
    });
  },

  addClass: JQLiteAddClass,
  removeClass: JQLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (isUndefined(condition)) {
      condition = !JQLiteHasClass(element, selector);
    }
    (condition ? JQLiteAddClass : JQLiteRemoveClass)(element, selector);
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },

  next: function(element) {
    return element.nextSibling;
  },

  find: function(element, selector) {
    return element.getElementsByTagName(selector);
  },

  clone: JQLiteClone
}, function(fn, name){
  
  JQLite.prototype[name] = function(arg1, arg2) {
    var value;
    for(var i=0; i < this.length; i++) {
      if (value == undefined) {
        value = fn(this[i], arg1, arg2);
        if (value !== undefined) {
         
          value = jqLite(value);
        }
      } else {
        JQLiteAddNodes(value, fn(this[i], arg1, arg2));
      }
    }
    return value == undefined ? this : value;
  };
});

var angularGlobal = {
  'typeOf':function(obj){
    if (obj === null) return $null;
    var type = typeof obj;
    if (type == $object) {
      if (obj instanceof Array) return $array;
      if (isDate(obj)) return $date;
      if (obj.nodeType == 1) return 'element';
    }
    return type;
  }
};

var angularCollection = {
  'copy': copy,
  'size': size,
  'equals': equals
};
var angularObject = {
  'extend': extend
};

var angularArray = {

  
  'indexOf': indexOf,

  
  'sum':function(array, expression) {
    var fn = angularFunction.compile(expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },

  
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },

  
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },

  
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },

  
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angularFunction.compile(condition), count = 0;
    forEach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },

  
  'orderBy':function(array, sortPredicate, reverseOrder) {
    if (!sortPredicate) return array;
    sortPredicate = isArray(sortPredicate) ? sortPredicate: [sortPredicate];
    sortPredicate = map(sortPredicate, function(predicate){
      var descending = false, get = predicate || identity;
      if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        get = expressionCompile(predicate);
      }
      return reverseComparator(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2){
      for ( var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return toBoolean(descending)
          ? function(a,b){return comp(b,a);}
          : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  },

  
  limitTo: function(array, limit) {
    limit = parseInt(limit, 10);
    var out = [],
        i, n;

    if (limit > 0) {
      i = 0;
      n = limit;
    } else {
      i = array.length + limit;
      n = array.length;
    }

    for (; i<n; i++) {
      out.push(array[i]);
    }

    return out;
  }
};

var R_ISO8061_STR = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d)(?:\:(\d\d)(?:\:(\d\d)(?:\.(\d{3}))?)?)?Z)?$/;

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },

  
  'toDate':function(string){
    var match;
    if (isString(string) && (match = string.match(R_ISO8061_STR))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4]||0, match[5]||0, match[6]||0, match[7]||0);
      return date;
    }
    return string;
  }
};

var angularDate = {
    'toString':function(date){
       if (!date) return date;

       var isoString = date.toISOString ? date.toISOString() : '';

       return (isoString.length==24) ?
                isoString :
                padNumber(date.getUTCFullYear(), 4) + '-' +
                  padNumber(date.getUTCMonth() + 1, 2) + '-' +
                  padNumber(date.getUTCDate(), 2) + 'T' +
                  padNumber(date.getUTCHours(), 2) + ':' +
                  padNumber(date.getUTCMinutes(), 2) + ':' +
                  padNumber(date.getUTCSeconds(), 2) + '.' +
                  padNumber(date.getUTCMilliseconds(), 3) + 'Z';
    }
  };

var angularFunction = {
  'compile': function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return expressionCompile(expression);
    } else {
     return identity;
   }
  }
};

function hashKey(obj) {
  var objType = typeof obj;
  var key = obj;
  if (objType == 'object') {
    if (typeof (key = obj.$hashKey) == 'function') {
     
      key = obj.$hashKey();
    } else if (key === undefined) {
      key = obj.$hashKey = nextUid();
    }
  }
  return objType + ':' + key;
}

function HashMap(){}
HashMap.prototype = {
  
  put: function(key, value) {
    var _key = hashKey(key);
    var oldValue = this[_key];
    this[_key] = value;
    return oldValue;
  },

  
  get: function(key) {
    return this[hashKey(key)];
  },

  
  remove: function(key) {
    var _key = hashKey(key);
    var value = this[_key];
    delete this[_key];
    return value;
  }
};

function defineApi(dst, chain){
  angular[dst] = angular[dst] || {};
  forEach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal]);
defineApi('Collection', [angularGlobal, angularCollection]);
defineApi('Array', [angularGlobal, angularCollection, angularArray]);
defineApi('Object', [angularGlobal, angularCollection, angularObject]);
defineApi('String', [angularGlobal, angularString]);
defineApi('Date', [angularGlobal, angularDate]);
angular.Date.toString = angularDate.toString;
defineApi('Function', [angularGlobal, angularCollection, angularFunction]);

angularFilter.currency = function(amount, currencySymbol){
  var formats = this.$service('$locale').NUMBER_FORMATS;
  this.$element.toggleClass('ng-format-negative', amount < 0);
  if (isUndefined(currencySymbol)) currencySymbol = formats.CURRENCY_SYM;
  return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2)
                                                         .replace(/\u00A4/g, currencySymbol);
};

var DECIMAL_SEP = '.';

angularFilter.number = function(number, fractionSize) {
  if (isNaN(number) || !isFinite(number)) return '';
  var formats = this.$service('$locale').NUMBER_FORMATS;
  return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP,
                                                  formats.DECIMAL_SEP, fractionSize);
}

function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
  var isNegative = number < 0;
  number = Math.abs(number);
  var numStr =  number + '',
      formatedText = '',
      parts = [];

  if (numStr.indexOf('e') !== -1) {
    formatedText = numStr;
  } else {
    var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

   
    if (isUndefined(fractionSize)) {
      fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
    }

    var pow = Math.pow(10, fractionSize);
    number = Math.round(number * pow) / pow;
    var fraction = ('' + number).split(DECIMAL_SEP);
    var whole = fraction[0];
    fraction = fraction[1] || '';

    var pos = 0,
        lgroup = pattern.lgSize,
        group = pattern.gSize;

    if (whole.length >= (lgroup + group)) {
      pos = whole.length - lgroup;
      for (var i = 0; i < pos; i++) {
        if ((pos - i)%group === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
    }

    for (i = pos; i < whole.length; i++) {
      if ((whole.length - i)%lgroup === 0 && i !== 0) {
        formatedText += groupSep;
      }
      formatedText += whole.charAt(i);
    }

   
    while(fraction.length < fractionSize) {
      fraction += '0';
    }

    if (fractionSize) formatedText += decimalSep + fraction.substr(0, fractionSize);
  }

  parts.push(isNegative ? pattern.negPre : pattern.posPre);
  parts.push(formatedText);
  parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
  return parts.join('');
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}

function dateGetter(name, size, offset, trim) {
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset)
      value += offset;
    if (value === 0 && offset == -12 ) value = 12;
    return padNumber(value, size, trim);
  };
}

function dateStrGetter(name, shortForm) {
  return function(date, formats) {
    var value = date['get' + name]();
    var get = uppercase(shortForm ? ('SHORT' + name) : name);

    return formats[get][value];
  };
}

function timeZoneGetter(date) {
  var offset = date.getTimezoneOffset();
  return padNumber(offset / 60, 2) + padNumber(Math.abs(offset % 60), 2);
}

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
    yy: dateGetter('FullYear', 2, 0, true),
     y: dateGetter('FullYear', 1),
  MMMM: dateStrGetter('Month'),
   MMM: dateStrGetter('Month', true),
    MM: dateGetter('Month', 2, 1),
     M: dateGetter('Month', 1, 1),
    dd: dateGetter('Date', 2),
     d: dateGetter('Date', 1),
    HH: dateGetter('Hours', 2),
     H: dateGetter('Hours', 1),
    hh: dateGetter('Hours', 2, -12),
     h: dateGetter('Hours', 1, -12),
    mm: dateGetter('Minutes', 2),
     m: dateGetter('Minutes', 1),
    ss: dateGetter('Seconds', 2),
     s: dateGetter('Seconds', 1),
  EEEE: dateStrGetter('Day'),
   EEE: dateStrGetter('Day', true),
     a: ampmGetter,
     Z: timeZoneGetter
};

var GET_TIME_ZONE = /[A-Z]{3}(?![+\-])/;
var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
var OPERA_TOSTRING_PATTERN = /^[\d].*Z$/;
var NUMBER_STRING = /^\d+$/;

angularFilter.date = function(date, format) {
  var $locale = this.$service('$locale');
  format = $locale.DATETIME_FORMATS[format] || format;
  if (isString(date)) {
    if (NUMBER_STRING.test(date)) {
      date = parseInt(date, 10);
    } else {
      date = angularString.toDate(date);
    }
  }

  if (isNumber(date)) {
    date = new Date(date);
  }

  if (!isDate(date)) {
    return date;
  }

  var text = date.toLocaleDateString(), fn;
  if (format && isString(format)) {
    text = '';
    var parts = [], match;
    while(format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = concat(parts, match, 1);
        format = parts.pop();
      } else {
        parts.push(format);
        format = null;
      }
    }
    forEach(parts, function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date, $locale.DATETIME_FORMATS)
                 : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
    });
  }
  return text;
};

angularFilter.json = function(object) {
  this.$element.addClass("ng-monospace");
  return toJson(object, true);
};

angularFilter.lowercase = lowercase;

angularFilter.uppercase = uppercase;

angularFilter.html =  function(html, option){
  return new HTML(html, option);
};

var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}\<\>]/,
    MAILTO_REGEXP = /^mailto:/;

angularFilter.linky = function(text) {
  if (!text) return text;
  var match;
  var raw = text;
  var html = [];
  var writer = htmlSanitizeWriter(html);
  var url;
  var i;
  while ((match = raw.match(LINKY_URL_REGEXP))) {
   
    url = match[0];
   
    if (match[2] == match[3]) url = 'mailto:' + url;
    i = match.index;
    writer.chars(raw.substr(0, i));
    writer.start('a', {href:url});
    writer.chars(match[0].replace(MAILTO_REGEXP, ''));
    writer.end('a');
    raw = raw.substring(i + match[0].length);
  }
  writer.chars(raw);
  return new HTML(html.join(''));
};

function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {
  return (isDefined(obj) && obj !== null) ? "" + obj : obj;
}

var NUMBER = /^\s*[-+]?\d*(\.\d*)?\s*$/;

angularFormatter.noop = formatter(identity, identity);

angularFormatter.json = formatter(toJson, function(value){
  return fromJson(value || 'null');
});

angularFormatter['boolean'] = formatter(toString, toBoolean);

angularFormatter.number = formatter(toString, function(obj){
  if (obj == null || NUMBER.exec(obj)) {
    return obj===null || obj === '' ? null : 1*obj;
  } else {
    throw "Not a number";
  }
});

angularFormatter.list = formatter(
  function(obj) { return obj ? obj.join(", ") : obj; },
  function(value) {
    var list = [];
    forEach((value || '').split(','), function(item){
      item = trim(item);
      if (item) list.push(item);
    });
    return list;
  }
);

angularFormatter.trim = formatter(
  function(obj) { return obj ? trim("" + obj) : ""; }
);

extend(angularValidator, {
  'noop': function() { return null; },

  
  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return null;
    }
  },

  
  'number': function(value, min, max) {
    var num = 1 * value;
    if (num == value) {
      if (typeof min != $undefined && num < min) {
        return "Value can not be less than " + min + ".";
      }
      if (typeof min != $undefined && num > max) {
        return "Value can not be greater than " + max + ".";
      }
      return null;
    } else {
      return "Not a number";
    }
  },

  
  'integer': function(value, min, max) {
    var numberError = angularValidator['number'](value, min, max);
    if (numberError) return numberError;
    if (!("" + value).match(/^\s*[\d+]*\s*$/) || value != Math.round(value)) {
      return "Not a whole number";
    }
    return null;
  },

  
  'date': function(value) {
    var fields = /^(\d\d?)\/(\d\d?)\/(\d\d\d\d)$/.exec(value);
    var date = fields ? new Date(fields[3], fields[1]-1, fields[2]) : 0;
    return (date &&
            date.getFullYear() == fields[3] &&
            date.getMonth() == fields[1]-1 &&
            date.getDate() == fields[2])
              ? null
              : "Value is not a date. (Expecting format: 12/31/2009).";
  },

  
  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return null;
    }
    return "Email needs to be in username@host.com format.";
  },

  
  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America " +
           "or +999 (123) 45678 906 internationally.";
  },

  
  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&amp;%@!\-\/]))?$/)) {
      return null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },

  
  'json': function(value) {
    try {
      fromJson(value);
      return null;
    } catch (e) {
      return e.toString();
    }
  },

  
  
  'asynchronous': function(input, asynchronousFn, updateFn) {
    if (!input) return;
    var scope = this;
    var element = scope.$element;
    var cache = element.data('$asyncValidator');
    if (!cache) {
      element.data('$asyncValidator', cache = {inputs:{}});
    }

    cache.current = input;

    var inputState = cache.inputs[input],
        $invalidWidgets = scope.$service('$invalidWidgets');

    if (!inputState) {
      cache.inputs[input] = inputState = { inFlight: true };
      $invalidWidgets.markInvalid(scope.$element);
      element.addClass('ng-input-indicator-wait');
      asynchronousFn(input, function(error, data) {
        inputState.response = data;
        inputState.error = error;
        inputState.inFlight = false;
        if (cache.current == input) {
          element.removeClass('ng-input-indicator-wait');
          $invalidWidgets.markValid(element);
        }
        element.data($$validate)();
      });
    } else if (inputState.inFlight) {
     
      $invalidWidgets.markInvalid(scope.$element);
    } else {
      (updateFn||noop)(inputState.response);
    }
    return inputState.error;
  }
});

angularServiceInject('$cookieStore', function($store) {

  return {
    
    get: function(key) {
      return fromJson($store[key]);
    },

    
    put: function(key, value) {
      $store[key] = toJson(value);
    },

    
    remove: function(key) {
      delete $store[key];
    }
  };

}, ['$cookies']);

angularServiceInject('$cookies', function($browser) {
  var rootScope = this,
      cookies = {},
      lastCookies = {},
      lastBrowserCookies,
      runEval = false;

 
  $browser.addPollFn(function() {
    var currentCookies = $browser.cookies();
    if (lastBrowserCookies != currentCookies) {
      lastBrowserCookies = currentCookies;
      copy(currentCookies, lastCookies);
      copy(currentCookies, cookies);
      if (runEval) rootScope.$apply();
    }
  })();

  runEval = true;

 
 
 
  this.$watch(push);

  return cookies;

  
  function push(){
    var name,
        value,
        browserCookies,
        updated;

   
    for (name in lastCookies) {
      if (isUndefined(cookies[name])) {
        $browser.cookies(name, undefined);
      }
    }

   
    for(name in cookies) {
      value = cookies[name];
      if (!isString(value)) {
        if (isDefined(lastCookies[name])) {
          cookies[name] = lastCookies[name];
        } else {
          delete cookies[name];
        }
      } else if (value !== lastCookies[name]) {
        $browser.cookies(name, value);
        updated = true;
      }
    }

   
    if (updated){
      updated = false;
      browserCookies = $browser.cookies();

      for (name in cookies) {
        if (cookies[name] !== browserCookies[name]) {
         
          if (isUndefined(browserCookies[name])) {
            delete cookies[name];
          } else {
            cookies[name] = browserCookies[name];
          }
          updated = true;
        }
      }
    }
  }
}, ['$browser']);

angularServiceInject('$defer', function($browser) {
  var scope = this;
  return function(fn, delay) {
    $browser.defer(function() {
      scope.$apply(fn);
    }, delay);
  };
}, ['$browser']);

angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window']);

var $exceptionHandlerFactory;
angularServiceInject('$exceptionHandler', $exceptionHandlerFactory = function($log){
  return function(e) {
    $log.error(e);
  };
}, ['$log']);

angularServiceInject("$hover", function(browser, document) {
  var tooltip, self = this, error, width = 300, arrowWidth = 10, body = jqLite(document[0].body);
  browser.hover(function(element, show){
    if (show && (error = element.attr(NG_EXCEPTION) || element.attr(NG_VALIDATION_ERROR))) {
      if (!tooltip) {
        tooltip = {
            callout: jqLite('<div id="ng-callout"></div>'),
            arrow: jqLite('<div></div>'),
            title: jqLite('<div class="ng-title"></div>'),
            content: jqLite('<div class="ng-content"></div>')
        };
        tooltip.callout.append(tooltip.arrow);
        tooltip.callout.append(tooltip.title);
        tooltip.callout.append(tooltip.content);
        body.append(tooltip.callout);
      }
      var docRect = body[0].getBoundingClientRect(),
          elementRect = element[0].getBoundingClientRect(),
          leftSpace = docRect.right - elementRect.right - arrowWidth;
      tooltip.title.text(element.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...");
      tooltip.content.text(error);
      if (leftSpace < width) {
        tooltip.arrow.addClass('ng-arrow-right');
        tooltip.arrow.css({left: (width + 1)+'px'});
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.left - arrowWidth - width - 4) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      } else {
        tooltip.arrow.addClass('ng-arrow-left');
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.right + arrowWidth) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      }
    } else if (tooltip) {
      tooltip.callout.remove();
      tooltip = null;
    }
  });
}, ['$browser', '$document'], true);

angularServiceInject("$invalidWidgets", function(){
  var invalidWidgets = [];

  
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };

  
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };

  
  invalidWidgets.visible = function() {
    var count = 0;
    forEach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };

  
  this.$watch(function() {
    for(var i = 0; i < invalidWidgets.length;) {
      var widget = invalidWidgets[i];
      if (isOrphan(widget[0])) {
        invalidWidgets.splice(i, 1);
        if (widget.dealoc) widget.dealoc();
      } else {
        i++;
      }
    }
  });

  
  function isOrphan(widget) {
    if (widget == window.document) return false;
    var parent = widget.parentNode;
    return !parent || isOrphan(parent);
  }

  return invalidWidgets;
});

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};

angularServiceInject("$location", function($browser) {
  var location = {update: update, updateHash: updateHash};
  var lastLocation = {};

  $browser.onHashChange(bind(this, this.$apply, function() {
    update($browser.getUrl());
  }))();

  this.$watch(sync);

  return location;

 

  
  function update(href) {
    if (isString(href)) {
      extend(location, parseHref(href));
    } else {
      if (isDefined(href.hash)) {
        extend(href, isString(href.hash) ? parseHash(href.hash) : href.hash);
      }

      extend(location, href);

      if (isDefined(href.hashPath || href.hashSearch)) {
        location.hash = composeHash(location);
      }

      location.href = composeHref(location);
    }
    $browser.setUrl(location.href);
    copy(location, lastLocation);
  }

  
  function updateHash(path, search) {
    var hash = {};

    if (isString(path)) {
      hash.hashPath = path;
      hash.hashSearch = search || {};
    } else
      hash.hashSearch = path;

    hash.hash = composeHash(hash);

    update({hash: hash});
  }

 

  
  function sync() {
    if (!equals(location, lastLocation)) {
      if (location.href != lastLocation.href) {
        update(location.href);
      } else {
        if (location.hash != lastLocation.hash) {
          var hash = parseHash(location.hash);
          updateHash(hash.hashPath, hash.hashSearch);
        } else {
          location.hash = composeHash(location);
          location.href = composeHref(location);
        }
        update(location.href);
      }
    }
  }

  
  function composeHref(loc) {
    var url = toKeyValue(loc.search);
    var port = (loc.port == DEFAULT_PORTS[loc.protocol] ? null : loc.port);

    return loc.protocol  + '://' + loc.host +
          (port ? ':' + port : '') + loc.path +
          (url ? '?' + url : '') + (loc.hash ? '#' + loc.hash : '');
  }

  
  function composeHash(loc) {
    var hashSearch = toKeyValue(loc.hashSearch);
   
    return escape(loc.hashPath).replace(/%21/gi, '!').replace(/%3A/gi, ':').replace(/%24/gi, '$') +
          (hashSearch ? '?' + hashSearch : '');
  }

  
  function parseHref(href) {
    var loc = {};
    var match = URL_MATCH.exec(href);

    if (match) {
      loc.href = href.replace(/#$/, '');
      loc.protocol = match[1];
      loc.host = match[3] || '';
      loc.port = match[5] || DEFAULT_PORTS[loc.protocol] || null;
      loc.path = match[6] || '';
      loc.search = parseKeyValue(match[8]);
      loc.hash = match[10] || '';

      extend(loc, parseHash(loc.hash));
    }

    return loc;
  }

  
  function parseHash(hash) {
    var h = {};
    var match = HASH_MATCH.exec(hash);

    if (match) {
      h.hash = hash;
      h.hashPath = unescape(match[1] || '');
      h.hashSearch = parseKeyValue(match[3]);
    }

    return h;
  }
}, ['$browser']);

var $logFactory;
angularServiceInject("$log", $logFactory = function($window){
  return {
    
    log: consoleLog('log'),

    
    warn: consoleLog('warn'),

    
    info: consoleLog('info'),

    
    error: consoleLog('error')
  };

  function consoleLog(type) {
    var console = $window.console || {};
    var logFn = console[type] || console.log || noop;
    if (logFn.apply) {
      return function(){
        var args = [];
        forEach(arguments, function(arg){
          args.push(formatError(arg));
        });
        return logFn.apply(console, args);
      };
    } else {
     
      return logFn;
    }
  }
}, ['$window']);

angularServiceInject('$resource', function($xhr){
  var resource = new ResourceFactory($xhr);
  return bind(resource, resource.route);
}, ['$xhr.cache']);

angularServiceInject('$route', function($location, $routeParams) {
  

  

  

  var routes = {},
      matcher = switchRouteMatcher,
      parentScope = this,
      rootScope = this,
      dirty = 0,
      allowReload = true,
      $route = {
        routes: routes,

        
        parent: function(scope) {
          if (scope) parentScope = scope;
        },

        
        when:function (path, route) {
          if (isUndefined(path)) return routes;
          var routeDef = routes[path];
          if (!routeDef) routeDef = routes[path] = {reloadOnSearch: true};
          if (route) extend(routeDef, route);
          dirty++;
          return routeDef;
        },

        
        otherwise: function(params) {
          $route.when(null, params);
        },

        
        reload: function() {
          dirty++;
          allowReload = false;
        }
      };

  this.$watch(function(){ return dirty + $location.hash; }, updateRoute);

  return $route;

 

  function switchRouteMatcher(on, when, dstName) {
    var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
        params = [],
        dst = {};
    forEach(when.split(/\W/), function(param){
      if (param) {
        var paramRegExp = new RegExp(":" + param + "([\\W])");
        if (regex.match(paramRegExp)) {
          regex = regex.replace(paramRegExp, "([^\/]*)$1");
          params.push(param);
        }
      }
    });
    var match = on.match(new RegExp(regex));
    if (match) {
      forEach(params, function(name, index){
        dst[name] = match[index + 1];
      });
      if (dstName) this.$set(dstName, dst);
    }
    return match ? dst : null;
  }

  function updateRoute(){
    var next = parseRoute(),
        last = $route.current;

    if (next && last && next.$route === last.$route
        && equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && allowReload) {
      $route.current = next;
      copy(next.params, $routeParams);
      last.scope && last.scope.$emit('$routeUpdate');
    } else {
      allowReload = true;
      rootScope.$broadcast('$beforeRouteChange', next, last);
      last && last.scope && last.scope.$destroy();
      $route.current = next;
      if (next) {
        if (next.redirectTo) {
          $location.update(isString(next.redirectTo)
              ? {hashSearch: next.params, hashPath: interpolate(next.redirectTo, next.params)}
          : {hash: next.redirectTo(next.pathParams,
              $location.hash, $location.hashPath, $location.hashSearch)});
        } else {
          copy(next.params, $routeParams);
          next.scope = parentScope.$new(next.controller);
        }
      }
      rootScope.$broadcast('$afterRouteChange', next, last);
    }
  }

  
  function parseRoute(){
   
    var params, match;
    forEach(routes, function(route, path) {
      if (!match && (params = matcher($location.hashPath, path))) {
        match = inherit(route, {
          params: extend({}, $location.hashSearch, params),
          pathParams: params});
        match.$route = route;
      }
    });
   
    return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
  }

  
  function interpolate(string, params) {
    var result = [];
    forEach((string||'').split(':'), function(segment, i) {
      if (i == 0) {
        result.push(segment);
      } else {
        var segmentMatch = segment.match(/(\w+)(.*)/);
        var key = segmentMatch[1];
        result.push(params[key]);
        result.push(segmentMatch[2] || '');
        delete params[key];
      }
    });
    return result.join('');
  }
}, ['$location', '$routeParams']);

angularService('$routeParams', function(){
  return {};
});

angularServiceInject("$window", bind(window, identity, window));

angularServiceInject('$xhr.bulk', function($xhr, $error, $log){
  var requests = [],
      scope = this;
  function bulkXHR(method, url, post, success, error) {
    if (isFunction(post)) {
      error = success;
      success = post;
      post = null;
    }
    var currentQueue;
    forEach(bulkXHR.urls, function(queue){
      if (isFunction(queue.match) ? queue.match(url) : queue.match.exec(url)) {
        currentQueue = queue;
      }
    });
    if (currentQueue) {
      if (!currentQueue.requests) currentQueue.requests = [];
      var request = {
          method: method,
          url: url,
          data: post,
          success: success};
      if (error) request.error = error;
      currentQueue.requests.push(request);
    } else {
      $xhr(method, url, post, success, error);
    }
  }
  bulkXHR.urls = {};
  bulkXHR.flush = function(success, errorback) {
    assertArgFn(success = success || noop, 0);
    assertArgFn(errorback = errorback || noop, 1);
    forEach(bulkXHR.urls, function(queue, url) {
      var currentRequests = queue.requests;
      if (currentRequests && currentRequests.length) {
        queue.requests = [];
        queue.callbacks = [];
        $xhr('POST', url, {requests: currentRequests},
          function(code, response) {
            forEach(response, function(response, i) {
              try {
                if (response.status == 200) {
                  (currentRequests[i].success || noop)(response.status, response.response);
                } else if (isFunction(currentRequests[i].error)) {
                    currentRequests[i].error(response.status, response.response);
                } else {
                  $error(currentRequests[i], response);
                }
              } catch(e) {
                $log.error(e);
              }
            });
            success();
          },
          function(code, response) {
            forEach(currentRequests, function(request, i) {
              try {
                if (isFunction(request.error)) {
                  request.error(code, response);
                } else {
                  $error(request, response);
                }
              } catch(e) {
                $log.error(e);
              }
            });
            noop();
          });
      }
    });
  };
  this.$watch(function(){ bulkXHR.flush(); });
  return bulkXHR;
}, ['$xhr', '$xhr.error', '$log']);

angularServiceInject('$xhr.cache', function($xhr, $defer, $error, $log) {
  var inflight = {}, self = this;
  function cache(method, url, post, success, error, verifyCache, sync) {
    if (isFunction(post)) {
      if (!isFunction(success)) {
        verifyCache = success;
        sync = error;
        error = null;
      } else {
        sync = verifyCache;
        verifyCache = error;
        error = success;
      }
      success = post;
      post = null;
    } else if (!isFunction(error)) {
      sync = verifyCache;
      verifyCache = error;
      error = null;
    }

    if (method == 'GET') {
      var data, dataCached;
      if ((dataCached = cache.data[url])) {

        if (sync) {
          success(200, copy(dataCached.value));
        } else {
          $defer(function() { success(200, copy(dataCached.value)); });
        }

        if (!verifyCache)
          return;
      }

      if ((data = inflight[url])) {
        data.successes.push(success);
        data.errors.push(error);
      } else {
        inflight[url] = {successes: [success], errors: [error]};
        cache.delegate(method, url, post,
          function(status, response) {
            if (status == 200)
              cache.data[url] = {value: response};
            var successes = inflight[url].successes;
            delete inflight[url];
            forEach(successes, function(success) {
              try {
                (success||noop)(status, copy(response));
              } catch(e) {
                $log.error(e);
              }
            });
          },
          function(status, response) {
            var errors = inflight[url].errors,
                successes = inflight[url].successes;
            delete inflight[url];

            forEach(errors, function(error, i) {
              try {
                if (isFunction(error)) {
                  error(status, copy(response));
                } else {
                  $error(
                    {method: method, url: url, data: post, success: successes[i]},
                    {status: status, body: response});
                }
              } catch(e) {
                $log.error(e);
              }
            });
          });
      }

    } else {
      cache.data = {};
      cache.delegate(method, url, post, success, error);
    }
  }
  cache.data = {};
  cache.delegate = $xhr;
  return cache;
}, ['$xhr.bulk', '$defer', '$xhr.error', '$log']);

angularServiceInject('$xhr.error', function($log){
  return function(request, response){
    $log.error('ERROR: XHR: ' + request.url, request, response);
  };
}, ['$log']);

angularServiceInject('$xhr', function($browser, $error, $log){
  var rootScope = this;
  var xhrHeaderDefaults = {
    common: {
      "Accept": "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest"
    },
    post: {'Content-Type': 'application/x-www-form-urlencoded'},
    get: {},      // all these empty properties are needed so that client apps can just do:
    head: {},     // $xhr.defaults.headers.head.foo="bar" without having to create head object
    put: {},      // it also means that if we add a header for these methods in the future, it
    'delete': {}, // won't be easily silently lost due to an object assignment.
    patch: {}
  };

  function xhr(method, url, post, success, error) {
    if (isFunction(post)) {
      error = success;
      success = post;
      post = null;
    }
    if (post && isObject(post)) {
      post = toJson(post);
    }

    $browser.xhr(method, url, post, function(code, response){
      try {
        if (isString(response)) {
          if (response.match(/^\)\]\}',\n/)) response=response.substr(6);
          if (/^\s*[\[\{]/.exec(response) && /[\}\]]\s*$/.exec(response)) {
            response = fromJson(response, true);
          }
        }
        rootScope.$apply(function(){
          if (200 <= code && code < 300) {
              success(code, response);
          } else if (isFunction(error)) {
            error(code, response);
          } else {
            $error(
              {method: method, url: url, data: post, success: success},
              {status: code, body: response});
          }
        });
      } catch (e) {
        $log.error(e);
      }
    }, extend({'X-XSRF-TOKEN': $browser.cookies()['XSRF-TOKEN']},
              xhrHeaderDefaults.common,
              xhrHeaderDefaults[lowercase(method)]));
  }

  xhr.defaults = {headers: xhrHeaderDefaults};

  return xhr;
}, ['$browser', '$xhr.error', '$log']);

angularServiceInject('$locale', function() {
  return {
    id: 'en-us',

    NUMBER_FORMATS: {
      DECIMAL_SEP: '.',
      GROUP_SEP: ',',
      PATTERNS: [
        {
          minInt: 1,
          minFrac: 0,
          maxFrac: 3,
          posPre: '',
          posSuf: '',
          negPre: '-',
          negSuf: '',
          gSize: 3,
          lgSize: 3
        },{
          minInt: 1,
          minFrac: 2,
          maxFrac: 2,
          posPre: '\u00A4',
          posSuf: '',
          negPre: '(\u00A4',
          negSuf: ')',
          gSize: 3,
          lgSize: 3
        }
      ],
      CURRENCY_SYM: '$'
    },

    DATETIME_FORMATS: {
      MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'
              .split(','),
      SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
      DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
      AMPMS: ['AM','PM'],
      medium: 'MMM d, y h:mm:ss a',
      short: 'M/d/yy h:mm a',
      fullDate: 'EEEE, MMMM d, y',
      longDate: 'MMMM d, y',
      mediumDate: 'MMM d, y',
      shortDate: 'M/d/yy',
      mediumTime: 'h:mm:ss a',
      shortTime: 'h:mm a'
    },

    pluralCat: function(num) {
      if (num === 1) {
        return 'one';
      }
      return 'other';
    }
  };
});

angularDirective("ng:init", function(expression){
  return function(element){
    this.$eval(expression);
  };
});

angularDirective("ng:controller", function(expression){
  this.scope(function(scope){
    var Controller =
      getter(scope, expression, true) ||
      getter(window, expression, true);
    assertArgFn(Controller, expression);
    return Controller;
  });
  return noop;
});

angularDirective("ng:bind", function(expression, element){
  element.addClass('ng-binding');
  var exprFn = parser(expression).statements();
  return function(element) {
    var lastValue = noop, lastError = noop;
    this.$watch(function(scope) {
     
      var error, value, html, isHtml, isDomElement,
          hadOwnElement = scope.hasOwnProperty('$element'),
          oldElement = scope.$element;
     
      scope.$element = element;
      try {
        value = exprFn(scope);
      } catch (e) {
        scope.$service('$exceptionHandler')(e);
        error = formatError(e);
      } finally {
        if (hadOwnElement) {
          scope.$element = oldElement;
        } else {
          delete scope.$element;
        }
      }
     
     
     
      if ((isHtml = (value instanceof HTML)))
        value = (html = value).html;
      if (lastValue === value && lastError == error) return;
      isDomElement = isElement(value);
      if (!isHtml && !isDomElement && isObject(value)) {
        value = toJson(value, true);
      }
      if (value != lastValue || error != lastError) {
        lastValue = value;
        lastError = error;
        elementError(element, NG_EXCEPTION, error);
        if (error) value = error;
        if (isHtml) {
          element.html(html.get());
        } else if (isDomElement) {
          element.html('');
          element.append(value);
        } else {
          element.text(value == undefined ? '' : value);
        }
      }
    });
  };
});

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

angularDirective("ng:bind-template", function(expression, element){
  element.addClass('ng-binding');
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$watch(function(scope) {
      var value = templateFn(scope, element, true);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    });
  };
});

var REMOVE_ATTRIBUTES = {
  'disabled':'disabled',
  'readonly':'readOnly',
  'checked':'checked',
  'selected':'selected',
  'multiple':'multiple'
};

angularDirective("ng:bind-attr", function(expression){
  return function(element){
    var lastValue = {};
    this.$watch(function(scope){
      var values = scope.$eval(expression);
      for(var key in values) {
        var value = compileBindTemplate(values[key])(scope, element),
            specialName = REMOVE_ATTRIBUTES[lowercase(key)];
        if (lastValue[key] !== value) {
          lastValue[key] = value;
          if (specialName) {
            if (toBoolean(value)) {
              element.attr(specialName, specialName);
              element.attr('ng-' + specialName, value);
            } else {
              element.removeAttr(specialName);
              element.removeAttr('ng-' + specialName);
            }
            (element.data($$validate)||noop)();
          } else {
            element.attr(key, value);
          }
        }
      }
    });
  };
});

angularDirective("ng:click", function(expression, element){
  return function(element){
    var self = this;
    element.bind('click', function(event){
      self.$apply(expression);
      event.stopPropagation();
    });
  };
});

angularDirective("ng:submit", function(expression, element) {
  return function(element) {
    var self = this;
    element.bind('submit', function(event) {
      self.$apply(expression);
      event.preventDefault();
    });
  };
});

function ngClass(selector) {
  return function(expression, element) {
    return function(element) {
      this.$watch(expression, function(scope, newVal, oldVal) {
        if (selector(scope.$index)) {
          element.removeClass(isArray(oldVal) ? oldVal.join(' ') : oldVal)
          element.addClass(isArray(newVal) ? newVal.join(' ') : newVal);
        }
      });
    };
  };
}

angularDirective("ng:class", ngClass(function(){return true;}));

angularDirective("ng:class-odd", ngClass(function(i){return i % 2 === 0;}));

angularDirective("ng:class-even", ngClass(function(i){return i % 2 === 1;}));

angularDirective("ng:show", function(expression, element){
  return function(element){
    this.$watch(expression, function(scope, value){
      element.css('display', toBoolean(value) ? '' : 'none');
    });
  };
});

angularDirective("ng:hide", function(expression, element){
  return function(element){
    this.$watch(expression, function(scope, value){
      element.css('display', toBoolean(value) ? 'none' : '');
    });
  };
});

angularDirective("ng:style", function(expression, element){
  return function(element){
    var resetStyle = getStyle(element);
    this.$watch(function(scope){
      var style = scope.$eval(expression) || {}, key, mergedStyle = {};
      for(key in style) {
        if (resetStyle[key] === undefined) resetStyle[key] = '';
        mergedStyle[key] = style[key];
      }
      for(key in resetStyle) {
        mergedStyle[key] = mergedStyle[key] || resetStyle[key];
      }
      element.css(mergedStyle);
    });
  };
});

angularDirective("ng:cloak", function(expression, element) {
  element.removeAttr('ng:cloak');
  element.removeClass('ng-cloak');
});

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

angularTextMarkup('{{}}', function(text, textNode, parentElement) {
  var bindings = parseBindings(text),
      self = this;
  if (hasBindings(bindings)) {
    if (isLeafNode(parentElement[0])) {
      parentElement.attr('ng:bind-template', text);
    } else {
      var cursor = textNode, newElement;
      forEach(parseBindings(text), function(text){
        var exp = binding(text);
        if (exp) {
          newElement = jqLite('<span>');
          newElement.attr('ng:bind', exp);
        } else {
          newElement = jqLite(document.createTextNode(text));
        }
        if (msie && text.charAt(0) == ' ') {
          newElement = jqLite('<span>&amp;nbsp;</span>');
          var nbsp = newElement.html();
          newElement.text(text.substr(1));
          newElement.html(nbsp + newElement.html());
        }
        cursor.after(newElement);
        cursor = newElement;
      });
      textNode.remove();
    }
  }
});

angularTextMarkup('option', function(text, textNode, parentElement){
  if (lowercase(nodeName_(parentElement)) == 'option') {
    if (msie <= 7) {
     
     
      htmlParser(parentElement[0].outerHTML, {
        start: function(tag, attrs) {
          if (isUndefined(attrs.value)) {
            parentElement.attr('value', text);
          }
        }
      });
    } else if (parentElement[0].getAttribute('value') == null) {
     
      parentElement.attr('value', text);
    }
  }
});

var NG_BIND_ATTR = 'ng:bind-attr';
var SPECIAL_ATTRS = {};

forEach('src,href,checked,disabled,multiple,readonly,selected'.split(','), function(name) {
  SPECIAL_ATTRS['ng:' + name] = name;
});

angularAttrMarkup('{{}}', function(value, name, element){
 
  if (angularDirective(name) || angularDirective("@" + name)) return;
  if (msie && name == 'src')
    value = decodeURI(value);
  var bindings = parseBindings(value),
      bindAttr;
  if (hasBindings(bindings) || SPECIAL_ATTRS[name]) {
    element.removeAttr(name);
    bindAttr = fromJson(element.attr(NG_BIND_ATTR) || "{}");
    bindAttr[SPECIAL_ATTRS[name] || name] = value;
    element.attr(NG_BIND_ATTR, toJson(bindAttr));
  }
});

function modelAccessor(scope, element) {
  var expr = element.attr('name');
  var exprFn, assignFn;
  if (expr) {
    exprFn = parser(expr).assignable();
    assignFn = exprFn.assign;
    if (!assignFn) throw new Error("Expression '" + expr + "' is not assignable.");
    return {
      get: function() {
        return exprFn(scope);
      },
      set: function(value) {
        if (value !== undefined) {
          assignFn(scope, value);
        }
      }
    };
  }
}

function modelFormattedAccessor(scope, element) {
  var accessor = modelAccessor(scope, element),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  if (accessor) {
    return {
      get: function() {
        return formatter.format(scope, accessor.get());
      },
      set: function(value) {
        return accessor.set(formatter.parse(scope, value));
      }
    };
  }
}

function compileValidator(expr) {
  return parser(expr).validator()();
}

function compileFormatter(expr) {
  return parser(expr).formatter()();
}

function valueAccessor(scope, element) {
  var validatorName = element.attr('ng:validate') || NOOP,
      validator = compileValidator(validatorName),
      requiredExpr = element.attr('ng:required'),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName),
      format, parse, lastError, required,
      invalidWidgets = scope.$service('$invalidWidgets') || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  if (requiredExpr) {
    scope.$watch(requiredExpr, function(scope, newValue) {
      required = newValue;
      validate();
    });
  } else {
    required = requiredExpr === '';
  }

  element.data($$validate, validate);
  return {
    get: function(){
      if (lastError)
        elementError(element, NG_VALIDATION_ERROR, null);
      try {
        var value = parse(scope, element.val());
        validate();
        return value;
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(scope, value);
      if (oldValue != newValue) {
        element.val(newValue || '');
      }
      validate();
    }
  };

  function validate() {
    var value = trim(element.val());
    if (element[0].disabled || element[0].readOnly) {
      elementError(element, NG_VALIDATION_ERROR, null);
      invalidWidgets.markValid(element);
    } else {
      var error, validateScope = inherit(scope, {$element:element});
      error = required && !value
              ? 'Required'
              : (value ? validator(validateScope, value) : null);
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error) {
        invalidWidgets.markInvalid(element);
      } else {
        invalidWidgets.markValid(element);
      }
    }
  }
}

function checkedAccessor(scope, element) {
  var domElement = element[0], elementValue = domElement.value;
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = toBoolean(value);
    }
  };
}

function radioAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return domElement.checked ? domElement.value : null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  return {
    get: function(){
      var values = [];
      forEach(element[0].options, function(option){
        if (option.selected) values.push(formatter.parse(scope, option.value));
      });
      return values;
    },
    set: function(values){
      var keys = {};
      forEach(values, function(value){
        keys[formatter.format(scope, value)] = true;
      });
      forEach(element[0].options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

var textWidget = inputWidget('keydown change', modelAccessor, valueAccessor, initWidgetValue(), true),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'checkbox':        inputWidget('click', modelFormattedAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelFormattedAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelAccessor, valueAccessor, initWidgetValue(null)),
      'select-multiple': inputWidget('change', modelAccessor, optionsAccessor, initWidgetValue([]))
    };

function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get();
    if (!value && isDefined(initValue)) {
      value = copy(initValue);
    }
    if (isUndefined(model.get()) && isDefined(value)) {
      model.set(value);
    }
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.checked = false;
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) {
   model.set(modelValue = null);
 }
 if (modelValue == null && viewValue !== null) {
   model.set(viewValue);
 }
 view.set(modelValue);
}

function inputWidget(events, modelAccessor, viewAccessor, initFn, textBox) {
  return annotate('$defer', function($defer, element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        ngChange = element.attr('ng:change') || noop,
        lastValue;
    if (model) {
      initFn.call(scope, model, view, element);
      scope.$eval(element.attr('ng:init') || noop);
      element.bind(events, function(event){
        function handler(){
          var value = view.get();
          if (!textBox || value != lastValue) {
            model.set(value);
            lastValue = model.get();
            scope.$eval(ngChange);
          }
        }
        event.type == 'keydown' ? $defer(handler) : scope.$apply(handler);
      });
      scope.$watch(model.get, function(scope, value) {
        if (!equals(lastValue, value)) {
          view.set(lastValue = value);
        }
      });
    }
  });
}

function inputWidgetSelector(element){
  this.directives(true);
  this.descend(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);
angularWidget('textarea', inputWidgetSelector);

var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
angularWidget('select', function(element){
  this.descend(true);
  this.directives(true);

  var isMultiselect = element.attr('multiple'),
      expression = element.attr('ng:options'),
      onChange = expressionCompile(element.attr('ng:change') || ""),
      match;

  if (!expression) {
    return inputWidgetSelector.call(this, element);
  }
  if (! (match = expression.match(NG_OPTIONS_REGEXP))) {
    throw Error(
      "Expected ng:options in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
      " but got '" + expression + "'.");
  }

  var displayFn = expressionCompile(match[2] || match[1]),
      valueName = match[4] || match[6],
      keyName = match[5],
      groupByFn = expressionCompile(match[3] || ''),
      valueFn = expressionCompile(match[2] ? match[1] : valueName),
      valuesFn = expressionCompile(match[7]),
     
     
      optionTemplate = jqLite(document.createElement('option')),
      optGroupTemplate = jqLite(document.createElement('optgroup')),
      nullOption = false;

  return function(selectElement){

   
   
   
    var optionGroupsCache = [[{element: selectElement, label:''}]],
        scope = this,
        model = modelAccessor(scope, element);

   
    forEach(selectElement.children(), function(option){
      if (option.value == '')
       
        nullOption = {label:jqLite(option).text(), id:''};
    });
    selectElement.html('');

    selectElement.bind('change', function(){
      var optionGroup,
          collection = valuesFn(scope) || [],
          key = selectElement.val(),
          tempScope = scope.$new(),
          value, optionElement, index, groupIndex, length, groupLength;

      try {
        if (isMultiselect) {
          value = [];
          for (groupIndex = 0, groupLength = optionGroupsCache.length;
               groupIndex < groupLength;
               groupIndex++) {
           
            optionGroup = optionGroupsCache[groupIndex];

            for(index = 1, length = optionGroup.length; index < length; index++) {
              if ((optionElement = optionGroup[index].element)[0].selected) {
                if (keyName) tempScope[keyName] = key;
                tempScope[valueName] = collection[optionElement.val()];
                value.push(valueFn(tempScope));
              }
            }
          }
        } else {
          if (key == '?') {
            value = undefined;
          } else if (key == ''){
            value = null;
          } else {
            tempScope[valueName] = collection[key];
            if (keyName) tempScope[keyName] = key;
            value = valueFn(tempScope);
          }
        }
        if (isDefined(value) && model.get() !== value) {
          onChange(scope);
          model.set(value);
        }
        scope.$root.$apply();
      } finally {
        tempScope = null;
      }
    });

    scope.$watch(function(scope) {
      var optionGroups = {'':[]},
          optionGroupNames = [''],
          optionGroupName,
          optionGroup,
          option,
          existingParent, existingOptions, existingOption,
          values = valuesFn(scope) || [],
          keys = values,
          key,
          groupLength, length,
          fragment,
          groupIndex, index,
          optionElement,
          optionScope = scope.$new(),
          modelValue = model.get(),
          selected,
          selectedSet = false,
          isMulti = isMultiselect,
          lastElement,
          element;

      try {
        if (isMulti) {
          selectedSet = new HashMap();
          if (modelValue && isNumber(length = modelValue.length)) {
            for (index = 0; index < length; index++) {
              selectedSet.put(modelValue[index], true);
            }
          }
        } else if (modelValue === null || nullOption) {
         
          optionGroups[''].push(extend({selected:modelValue === null, id:'', label:''}, nullOption));
          selectedSet = true;
        }

       
        if(keyName) {
          keys = [];
          for (key in values) {
            if (values.hasOwnProperty(key))
              keys.push(key);
          }
          keys.sort();
        }

       
        for (index = 0; length = keys.length, index < length; index++) {
          optionScope[valueName] = values[keyName ? optionScope[keyName]=keys[index]:index];
          optionGroupName = groupByFn(optionScope) || '';
          if (!(optionGroup = optionGroups[optionGroupName])) {
            optionGroup = optionGroups[optionGroupName] = [];
            optionGroupNames.push(optionGroupName);
          }
          if (isMulti) {
            selected = !!selectedSet.remove(valueFn(optionScope));
          } else {
            selected = modelValue === valueFn(optionScope);
            selectedSet = selectedSet || selected;
          }
          optionGroup.push({
              id: keyName ? keys[index] : index,  
              label: displayFn(optionScope) || '',
              selected: selected                  
            });
        }
        optionGroupNames.sort();
        if (!isMulti && !selectedSet) {
         
          optionGroups[''].unshift({id:'?', label:'', selected:true});
        }

       
        for (groupIndex = 0, groupLength = optionGroupNames.length;
             groupIndex < groupLength;
             groupIndex++) {
         
          optionGroupName = optionGroupNames[groupIndex];

         
          optionGroup = optionGroups[optionGroupName];

          if (optionGroupsCache.length <= groupIndex) {
           
            optionGroupsCache.push(
                existingOptions = [
                  existingParent = {
                      element: optGroupTemplate.clone().attr('label', optionGroupName),
                      label: optionGroup.label
                    }
                ]
            );
            selectElement.append(existingParent.element);
          } else {
            existingOptions = optionGroupsCache[groupIndex];
            existingParent = existingOptions[0]; 

           
            if (existingParent.label != optionGroupName) {
              existingParent.element.attr('label', existingParent.label = optionGroupName);
            }
          }

          lastElement = null; 
          for(index = 0, length = optionGroup.length; index < length; index++) {
            option = optionGroup[index];
            if ((existingOption = existingOptions[index+1])) {
             
              lastElement = existingOption.element;
              if (existingOption.label !== option.label) {
                lastElement.text(existingOption.label = option.label);
              }
              if (existingOption.id !== option.id) {
                lastElement.val(existingOption.id = option.id);
              }
              if (existingOption.selected !== option.selected) {
                lastElement.attr('selected', option.selected);
              }
            } else {
             
             
             
             
              (element = optionTemplate.clone())
                .val(option.id)
                .attr('selected', option.selected)
                .text(option.label);
              existingOptions.push(existingOption = {
                element: element,
                label: option.label,
                id: option.id,
                checked: option.selected
              });
              if (lastElement) {
                lastElement.after(element);
              } else {
                existingParent.element.append(element);
              }
              lastElement = element;
            }
          }
         
          index++;
          while(existingOptions.length > index) {
            existingOptions.pop().element.remove();
          }
        }
       
        while(optionGroupsCache.length > groupIndex) {
          optionGroupsCache.pop()[0].element.remove();
        }
      } finally {
        optionScope.$destroy();
      }
    });
  };
});

angularWidget('ng:include', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '',
      onloadExp = element[0].getAttribute('onload') || '';
  if (element[0]['ng:compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng:compiled'] = true;
    return extend(function(xhr, element){
      var scope = this,
          changeCounter = 0,
          releaseScopes = [],
          childScope,
          oldScope;

      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(function(scope){
        var newScope = scope.$eval(scopeExp);
        if (newScope !== oldScope) {
          oldScope = newScope;
          incrementChange();
        }
      });
      this.$watch(function(){return changeCounter;}, function(scope) {
        var src = scope.$eval(srcExp),
            useScope = scope.$eval(scopeExp);

        while(releaseScopes.length) {
          releaseScopes.pop().$destroy();
        }
        if (src) {
          xhr('GET', src, null, function(code, response){
            element.html(response);
            if (useScope) {
              childScope = useScope;
            } else {
              releaseScopes.push(childScope = scope.$new());
            }
            compiler.compile(element)(childScope);
            scope.$eval(onloadExp);
          }, false, true);
        } else {
          childScope = null;
          element.html('');
        }
      });
    }, {$inject:['$xhr.cache']});
  }
});

angularWidget('ng:switch', function (element) {
  var compiler = this,
      watchExpr = element.attr("on"),
      changeExpr = element.attr('change'),
      casesTemplate = {},
      defaultCaseTemplate,
      children = element.children(),
      length = children.length,
      child,
      when;

  if (!watchExpr) throw new Error("Missing 'on' attribute.");
  while(length--) {
    child = jqLite(children[length]);
   
    child.remove();
    when = child.attr('ng:switch-when');
    if (isString(when)) {
      casesTemplate[when] = compiler.compile(child);
    } else if (isString(child.attr('ng:switch-default'))) {
      defaultCaseTemplate = compiler.compile(child);
    }
  }
  children = null;
  element.html('');

  return function(element){
    var changeCounter = 0;
    var childScope;
    var selectedTemplate;

    this.$watch(watchExpr, function(scope, value) {
      element.html('');
      if ((selectedTemplate = casesTemplate[value] || defaultCaseTemplate)) {
        changeCounter++;
        if (childScope) childScope.$destroy();
        childScope = scope.$new();
        childScope.$eval(changeExpr);
      }
    });

    this.$watch(function(){return changeCounter;}, function() {
      element.html('');
      if (selectedTemplate) {
        selectedTemplate(childScope, function(caseElement) {
          element.append(caseElement);
        });
      }
    });
  };
});

angularWidget('a', function() {
  this.descend(true);
  this.directives(true);

  return function(element) {
    var hasNgHref = ((element.attr('ng:bind-attr') || '').indexOf('"href":') !== -1);

   
   
    if (!hasNgHref && !element.attr('name') && !element.attr('href')) {
      element.attr('href', '');
    }

    if (element.attr('href') === '' && !hasNgHref) {
      element.bind('click', function(event){
        event.preventDefault();
      });
    }
  };
});

angularWidget('@ng:repeat', function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(jqLite('<!-- ng:repeat: ' + expression + ' -->'));
  var linker = this.compile(element);
  return function(iterStartElement){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of '_item_ in _collection_' but got '" +
      expression + "'.");
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.");
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    var childScopes = [];
    var childElements = [iterStartElement];
    var parentScope = this;
    this.$watch(function(scope){
      var index = 0,
          childCount = childScopes.length,
          collection = scope.$eval(rhs),
          collectionLength = size(collection, true),
          fragment = document.createDocumentFragment(),
          addFragmentTo = (childCount < collectionLength) ? childElements[childCount] : null,
          childScope,
          key;

      for (key in collection) {
        if (collection.hasOwnProperty(key)) {
          if (index < childCount) {
           
            childScope = childScopes[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$eval();
          } else {
           
            childScope = parentScope.$new();
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScopes.push(childScope);
            linker(childScope, function(clone){
              clone.attr('ng:repeat-index', index);
              fragment.appendChild(clone[0]);
             
             
             
             
              childScope.$digest();
              childElements[index + 1] = clone;
            });
          }
          index ++;
        }
      }

     
      if (addFragmentTo) {
       
       
        addFragmentTo.after(jqLite(fragment));
      }

     
      while(childScopes.length > index) {
       
        childScopes.pop().$destroy();
        childElements.pop().remove();
      }
    });
  };
});

angularWidget("@ng:non-bindable", noop);

angularWidget('ng:view', function(element) {
  var compiler = this;

  if (!element[0]['ng:compiled']) {
    element[0]['ng:compiled'] = true;
    return annotate('$xhr.cache', '$route', function($xhr, $route, element){
      var template;
      var changeCounter = 0;

      this.$on('$afterRouteChange', function(){
        changeCounter++;
      });

      this.$watch(function(){return changeCounter;}, function() {
        var template = $route.current && $route.current.template;
        if (template) {
         
          $xhr('GET', template, function(code, response) {
            element.html(response);
            compiler.compile(element)($route.current.scope);
          });
        } else {
          element.html('');
        }
      });
    });
  } else {
    compiler.descend(true);
    compiler.directives(true);
  }
});

angularWidget('ng:pluralize', function(element) {
  var numberExp = element.attr('count'),
      whenExp = element.attr('when'),
      offset = element.attr('offset') || 0;

  return annotate('$locale', function($locale, element) {
    var scope = this,
        whens = scope.$eval(whenExp),
        whensExpFns = {};

    forEach(whens, function(expression, key) {
      whensExpFns[key] = compileBindTemplate(expression.replace(/{}/g,
                                             '{{' + numberExp + '-' + offset + '}}'));
    });

    scope.$watch(function() {
      var value = parseFloat(scope.$eval(numberExp));

      if (!isNaN(value)) {
       
       
        if (!whens[value]) value = $locale.pluralCat(value - offset);
         return whensExpFns[value](scope, element, true);
      } else {
        return '';
      }
    }, function(scope, newVal) {
      element.text(newVal);
    });
  });
});

var browserSingleton;

angularService('$browser', function($log){
  if (!browserSingleton) {
    browserSingleton = new Browser(window, jqLite(window.document), jqLite(window.document.body),
                                   XHR, $log);
    browserSingleton.bind();
  }
  return browserSingleton;
}, {$inject:['$log']});

extend(angular, {
 
 
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'equals': equals,
  'forEach': forEach,
  'injector': createInjector,
  'noop':noop,
  'bind':bind,
  'toJson': toJson,
  'fromJson': fromJson,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isObject': isObject,
  'isNumber': isNumber,
  'isArray': isArray,
  'version': version,
  'isDate': isDate,
  'lowercase': lowercase,
  'uppercase': uppercase
});

bindJQuery();

  jqLiteWrap(document).ready(function(){
    angularInit(angularJsConfig(document), document);
  });

})(window, document);

angular.element(document).find('head').append('<style type="text/css">@charset "UTF-8";[ng\\:cloak],.ng-cloak{display:none;}.ng-format-negative{color:red;}.ng-exception{border:2px solid #FF0000;font-family:"Courier New",Courier,monospace;font-size:smaller;white-space:pre;}.ng-validation-error{border:2px solid #FF0000;}#ng-callout{margin:0;padding:0;border:0;outline:0;font-size:13px;font-weight:normal;font-family:Verdana,Arial,Helvetica,sans-serif;vertical-align:baseline;background:transparent;text-decoration:none;}#ng-callout .ng-arrow-left{background-image:url("data:image/gif;base64,R0lGODlhCwAXAKIAAMzMzO/v7/f39////////wAAAAAAAAAAACH5BAUUAAQALAAAAAALABcAAAMrSLoc/AG8FeUUIN+sGebWAnbKSJodqqlsOxJtqYooU9vvk+vcJIcTkg+QAAA7");background-repeat:no-repeat;background-position:left top;position:absolute;z-index:101;left:-12px;height:23px;width:10px;top:-3px;}#ng-callout .ng-arrow-right{background-image:url("data:image/gif;base64,R0lGODlhCwAXAKIAAMzMzO/v7/f39////////wAAAAAAAAAAACH5BAUUAAQALAAAAAALABcAAAMrCLTcoM29yN6k9socs91e5X3EyJloipYrO4ohTMqA0Fn2XVNswJe+H+SXAAA7");background-repeat:no-repeat;background-position:left top;position:absolute;z-index:101;height:23px;width:11px;top:-2px;}#ng-callout{position:absolute;z-index:100;border:2px solid #CCCCCC;background-color:#fff;}#ng-callout .ng-content{padding:10px 10px 10px 10px;color:#333333;}#ng-callout .ng-title{background-color:#CCCCCC;text-align:left;padding-left:8px;padding-bottom:5px;padding-top:2px;font-weight:bold;}.ng-input-indicator-wait{background-image:url("data:image/png;base64,R0lGODlhEAAQAPQAAP///wAAAPDw8IqKiuDg4EZGRnp6egAAAFhYWCQkJKysrL6+vhQUFJycnAQEBDY2NmhoaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA==");background-position:right;background-repeat:no-repeat;}</style>');