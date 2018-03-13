/**
 *
 * @class FirstObserver
 */
var util = require('util');
var Iobserver = require('./iobserver');

module.exports = function(){
	Iobserver.call(this);
　　util.inherits(this, Iobserver);
	
	this.update = function(){
		console.log('first observer');
	}
}