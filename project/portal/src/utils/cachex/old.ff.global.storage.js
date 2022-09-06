// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.
var Global = (typeof window !== 'undefined' ? window : global)

export default {
	name: 'oldFF-globalStorage',
	read,
	write,
	each,
	remove,
	clear
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clear() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}
