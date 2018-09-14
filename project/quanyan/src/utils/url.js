/* eslint-disable */
import {isFunction, isArray, isObject, isPlainObject, each} from './lang';

/**
 * Enumerate all object properties, ignoring prototype properties.
 * Internal method to encapsulate enumerate keys to avoid optimization problems in v8.
 *
 * @param   {Object} obj - input object
 */
function getKeys(obj) {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    list = [], key;
  for (key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      list.push(key);
    }
  }
  return list;
}

/**
 * internal method: uri string decoding
 */
function decode(v) {
  if (v === undefined) { return null; }
  if (v) { return decodeURIComponent(v); }
  return v;
}

/**
 * internal method: uri string encoding with type convertion to string
 */
function encode(v) {
  switch (typeof v) {
    case 'string':
      return encodeURIComponent(v);
    case 'boolean':
      return v ? 'true' : 'false';
    case 'number':
      return isFinite(v) ? v : '';
    case 'object':
      if (v === undefined || v === null) { return ''; }
      if (JSON && JSON.stringify) { return encodeURIComponent(JSON.stringify(v)); }
      return '';
    default:
      return '';
  }
}

export function parse (str, delimiter, eq) {
  var i;
  delimiter = delimiter || '&';
  eq = eq || '=';
  // create an object with no prototype
  var dic = Object.create(null);

  // step 0: sanity checks
  if (typeof str !== 'string') { return dic; }

  // detect if we have or not a query string
  i = str.indexOf('?');
  if (i < 0 && str.indexOf(eq) < 0) {
    return dic;
  }

  // step 1: prepare query string
  // split by '?'
  if (i >= 0) {
    str = str.substr(i + 1);
  }

  // trim space (see MDN polyfill), ?, # and & (allow passing location.search or location.hash as parameter)
  str = str.replace(/^[\s\uFEFF\xA0\?#&]+|[\s\uFEFF\xA0&]+$/g, '');

  // remove anchor [ "#" fragment ]
//   i = str.lastIndexOf('#');
//   if (i > 0) {
//     str = str.substr(0, i);
//   }

  // step 2: split by key/value pair
  var parts = str.split(delimiter);

  for (i = 0; i < parts.length; ++i) {
    // step 3: split key/value pair
    var s = parts[i].replace(/\+/g, ' ');
    var p = s.indexOf(eq);
    var key, val;

    // key must exist
    if (p === 0 || s.length === 0) {
      continue;
    }

    // split
    if (p < 0) {
      key = decode(s);
      val = null; // missing `=` should be `null`:
    } else {
      key = decode(s.substr(0, p));
      val = decode(s.substr(p + 1));
    }

    // check existing dic and add
    var e = dic[key];

    // step 4: add to dictionary
    if (e === undefined) {
      dic[key] = val;
    } else if (Array.isArray(e)) {
      e.push(val);
    } else {
      dic[key] = [e, val];
    }
  }
  return dic;
}

export function stringify(obj, delimiter, eq) {
  delimiter = delimiter || '&';
  eq = eq || '=';

  // sanity check
  if ((typeof obj !== 'object' && typeof obj !== 'function') || obj === null) { return ''; }

  // get obj keys
  var keys = getKeys(obj);

  // sanity check
  if (!keys || !keys.length) { return ''; }

  var list = [];
  var i = 0, j, k, v;

  // enumerate key/values
  for (; i < keys.length; i++) {
    k = encode(keys[i]);
    v = obj[k];
    // check value type (ignore undefined and function)
    if (v !== undefined && typeof v !== 'function') {
      if (Array.isArray(v)) {
        for (j = 0; j < v.length; ++j) {
          list.push(k + eq + (v[j] ? encode(v[j]) : ''));
        }
      } else {
        // try to encode
        if (v !== null) {
          v = encode(v);
        }
        // check final v value and add to list
        list.push((v === null || v === undefined) ? k : k + eq + v);
      }
    }
  }
  // concatenate final string
  return list.join(delimiter);
}

/**
 * 获取url上的参数
 * @example: http://xxx.com/a.do?productCode=P001
 * @Result:  C.getParameter('productCode')  // 'P001'
 * @param  {String} param 参数名称
 * @return {String}       返回参数值
 */
export function getParameter(param) {
    var reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i');
    var hrefStr = location.search;
    hrefStr = decodeURIComponent(decodeURIComponent(hrefStr));
    var value = reg.exec(hrefStr);
    return value ? value[1] : '';
};

/**
 * 获取URL参数对象
 * @param  {String} [queryString] url地址
 * @return {Object}
 */
export function getQueryMap(queryString) {
    var paramObj = {};
    var paramList;
    var oneQueryMatch;
    /*eslint-disable*/
    var regGlobal = /[\?\&][^\?\&]+=[^\?\&#]+/g;
    var regOne = /[\?\&]([^=\?]+)=([^\?\&#]+)/;
    queryString = queryString || location.href;
    paramList = queryString.match(regGlobal);

    if (!paramList) {
        return paramObj;
    }

    for (var i = 0, len = paramList.length; i < len; i++) {
        oneQueryMatch = paramList[i].match(regOne);
        if (oneQueryMatch === null) {
            continue;
        }
        paramObj[oneQueryMatch[1]] = decodeURIComponent(decodeURIComponent(oneQueryMatch[2]));
    }

    return paramObj;
};

/**
 * 将Object对象拼接到URL参数中
 * @param  {String} url  url地址
 * @param  {Object} data 数据对象
 * @return {String} 新的url
 */
export function urlParam(url, data) {
    if (data) {
        data = params(data);
        if (url.indexOf('?') > -1) {
            url += '&' + data;
        } else if (Object.keys(data).length > 0) {
            url += '?' + data;
        }
    }
    if (url && url.indexOf('?') > -1) {
        var param = [];
        var urlHost = url.split('?')[0];
        var urlData = getQueryMap(url);
        for (var key in urlData) {
            var tmp = '';
            try {
                tmp = decodeURIComponent(urlData[key]);
            } catch (e) {
                tmp = urlData[key];
            }
            param.push(key + '=' + encodeURIComponent(tmp));
        }
        url = urlHost + '?' + param.join('&');
    }
    return url.replace(/(%2F)/ig, '/');
};

function params (obj) {
    var params = [];
    var escape = encodeURIComponent;

    params.add = function(key, value) {
        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

function serialize(params, obj, scope) {
    var array = isArray(obj);
    var plain = isPlainObject(obj);
    var hash;

    each(obj, (value, key) => {
        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * deparam
 * @see {@link https://github.com/AceMetrix/jquery-deparam|jquery-deparam}
 * @param {String} params
 * @param {Boolean} [coerce] 是否转义值
 * @param {Boolean} [urlDecode] 是否对值进行解码
 * @returns {Object}
 */
export function deparam(params, coerce, urlDecode) {
    let obj = {};
    let coerceTypes = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    params.replace(/\+/g, ' ').split('&').forEach(function(v) {
        let param = v.split('=');
        let key = decodeURIComponent(param[0]);
        let val;
        let cur = obj;
        let i = 0;

        // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
        // into its component parts.
        let keys = key.split('][');
        let keysLast = keys.length - 1;

        // If the first keys part contains [ and the last ends with ], then []
        // are correctly balanced.
        if (/\[/.test(keys[0]) && /]$/.test(keys[ keysLast ])) {
            // Remove the trailing ] from the last keys part.
            keys[ keysLast ] = keys[ keysLast ].replace(/]$/, '');

            // Split first keys part into two parts on the [ and add them back onto
            // the beginning of the keys array.
            keys = keys.shift().split('[').concat(keys);

            keysLast = keys.length - 1;
        } else {
            // Basic 'foo' style key.
            keysLast = 0;
        }

        // Are we dealing with a name=value pair, or just a name?
        if (param.length === 2) {
            val = urlDecode ? decodeURIComponent(param[1]) : param[1];

            // Coerce values.
            if (coerce) {
                val = val && !isNaN(val) && ((+val + '') === val) ? +val        // number
                    : val === 'undefined' ? undefined         // undefined
                        : coerceTypes[val] !== undefined ? coerceTypes[val] // true, false, null
                            : val;                                                          // string
            }

            if (keysLast) {
                // Complex key, build deep object structure based on a few rules:
                // * The 'cur' pointer starts at the object top-level.
                // * [] = array push (n is set to array length), [n] = array if n is
                //   numeric, otherwise object.
                // * If at the last keys part, set the value.
                // * For each keys part, if the current level is undefined create an
                //   object or array based on the type of the next keys part.
                // * Move the 'cur' pointer to the next level.
                // * Rinse & repeat.
                for (; i <= keysLast; i++) {
                    key = keys[i] === '' ? cur.length : keys[i];
                    cur = cur[key] = i < keysLast
                        ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : [])
                        : val;
                }
            } else {
                // Simple key, even simpler rules, since only scalars and shallow
                // arrays are allowed.

                if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                    // val is already an array, so push on the next value.
                    obj[key].push(val);
                } else if ({}.hasOwnProperty.call(obj, key)) {
                    // val isn't an array, but since a second value has been specified,
                    // convert val into an array.
                    obj[key] = [ obj[key], val ];
                } else {
                    // val is a scalar.
                    obj[key] = val;
                }
            }
        } else if (key) {
            // No value was defined, so set something meaningful.
            obj[key] = coerce
                ? undefined
                : '';
        }
    });

    return obj;
}
