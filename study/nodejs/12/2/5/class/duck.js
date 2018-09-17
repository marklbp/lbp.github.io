/**
 *
 * @class Duck
 */
var util = require('util');
var Animal = require('./animal');
function Duck(){

	var _res  = arguments[0];
	var _req  = arguments[1];
	
	Animal.call(this);
　　util.inherits(this, Animal);
	
	this.say = function(){
		console.log('ga...ga');
	}
}

var duck = new Duck();
exports.say = duck.say;

