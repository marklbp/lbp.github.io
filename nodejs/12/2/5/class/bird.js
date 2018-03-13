/**
 *
 * @class Bird
 */
 var util = require('util');
var Animal = require('./animal');
module.exports = function(){

	var _res  = arguments[0];
	var _req  = arguments[1];
	
	Animal.call(this);
　　util.inherits(this, Animal);
	
	this.say = function(){
		console.log('ji...ji');
	}
}
