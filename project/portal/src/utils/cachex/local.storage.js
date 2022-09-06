var Global = (typeof window !== 'undefined' ? window : global)

export default {
  name: 'localStorage',
  read,
  write,
  each,
  remove,
  clear
}

function localStorageX () {
  return Global.localStorage
}

function read (key) {
  return localStorageX().getItem(key)
}

function write (key, data) {
  return localStorageX().setItem(key, data)
}

function each (fn) {
  for (var i = localStorageX().length - 1; i >= 0; i--) {
    var key = localStorageX().key(i)
    fn(read(key), key)
  }
}

function remove (key) {
  return localStorageX().removeItem(key)
}

function clear () {
  return localStorageX().clear()
}
