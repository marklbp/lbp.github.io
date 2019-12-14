var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }
export default {
  noop () {},
  warn (msg) {
    var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'error';
    console[fn](msg);
  },
  getDpr () {
    var getParam = function getParam(name, str) {
      var reg = new RegExp('(^|,)' + name + '=([^,]*)(,|$)', 'i');
      var r = str.match(reg);
      if (r != null) {
        return r[2];
      }
      return null;
    };

    var viewPort = document.querySelector('meta[name=viewport]');

    if (!viewPort) {
      return 1;
    }

    var viewPortContent = viewPort.getAttribute('content');
    var initialScale = +(getParam('initial-scale', viewPortContent) || 1);
    var maximumScale = +(getParam('maximum-scale', viewPortContent) || 1);
    var minimumScale = +(getParam('minimum-scale', viewPortContent) || 1);

    return 1 / Math.min(initialScale, maximumScale, minimumScale);
  },
  traverse (data) {
    var childrenKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    if (!data) {
      return;
    }
    if (typeof childrenKeys === 'function') {
      fn = childrenKeys;
      childrenKeys = [];
    }
    var level = 0; // current level
    var indexs = []; // index set of all levels
    var walk = function walk(curData) {
      for (var i = 0, len = curData.length; i < len; i++) {
        var isArray = Array.isArray(curData[i]);
        var key = Array.isArray(childrenKeys) ? childrenKeys[level] : childrenKeys;
        if (isArray || curData[i] && curData[i][key]) {
          level++;
          indexs.push(i);
          walk(isArray ? curData[i] : curData[i][key]);
        } else if (level >= childrenKeys.length) {
          var res = fn(curData[i], level, [].concat(_toConsumableArray(indexs), [i]));
          if (res === 1) {
            continue;
          } else if (res === 2) {
            break;
          }
        } else {
          continue;
        }
      }
      level = 0;
      indexs = [];
    };
    walk(data);
  },
  inArray(list, item) {
    return Array.isArray(list) ? !!~list.indexOf(item) : item === list;
  },
  compareObjects(object0, object1) {
    var ret = true;

    if (!object0 || !object1) {
      ret = false;
    } else if ((typeof object0 === 'undefined' ? 'undefined' : _typeof(object0)) !== 'object' || (typeof object1 === 'undefined' ? 'undefined' : _typeof(object1)) !== 'object') {
      ret = false;
    } else if (JSON.stringify(object0) !== JSON.stringify(object1)) {
      ret = false;
    }

    return ret;
  },
  _toConsumableArray
}
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
}