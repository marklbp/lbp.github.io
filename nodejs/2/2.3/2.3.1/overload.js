var util = require("util");
var Person = require('./person');
function Overload(){
	Person.call(this);
	this.eat = function(){
		console.log('eat by overload function');
	}
}

util.inherits(Overload, Person);

module.exports = Overload;