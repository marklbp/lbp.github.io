function hashKey(obj) {
  var objType = typeof obj;
  var key = obj;
  if (objType == 'object') {
    if (typeof (key = obj.$hashKey) == 'function') {
      // must invoke on object to keep the right this
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