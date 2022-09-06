var Global = (typeof window !== 'undefined' ? window : global)

export default {
  name: 'sessionStorage',
  read,
  write,
  each,
  remove,
  clear
}

function sessionStorageX () {
  return Global.sessionStorage
}

function read (key) {
  return sessionStorageX().getItem(key)
}

function write (key, data) {
  return sessionStorageX().setItem(key, data)
}

function each (fn) {
  for (var i = sessionStorageX().length - 1; i >= 0; i--) {
    var key = sessionStorageX().key(i)
    fn(read(key), key)
  }
}

function remove (key) {
  return sessionStorageX().removeItem(key)
}

function clear () {
  return sessionStorageX().clear()
}
