(function(modules) {
	// The module cache
	var installedModules = {};

	// The require function
	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}

 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		// define name property when name not in exports
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
 				configurable: false,
 				enumerable: true,
 				get: getter
 			});
 		}
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ? function getDefault() { return module['default']; } :function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function(object, property) { 
		return Object.prototype.hasOwnProperty.call(object, property); 
	};

	// __webpack_public_path__
	__webpack_require__.p = "";

	__webpack_require__.s = 0;

	return __webpack_require__(0);
})([
	function(module, exports, __webpack_require__) {
		var greeter = __webpack_require__(1);
		document.getElementById('root').appendChild(greeter());
	},
	function(module, exports) {
		console.log('module = ',module);
		console.log('exports = ',exports);
		console.log('this = ',this);
		console.log('this',this===exports?'===':'!=','exports');
		module.exports = function() {
			var greet = document.createElement('div');
			greet.textContent = "Hi there and greetings!";
			return greet;
		};
		console.log('module = ',module);
		console.log('exports = ',exports);
		console.log('this = ',this);
		console.log('this',this===exports?'===':'!=','exports');
	}
]);