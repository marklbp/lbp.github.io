var util = require("util");
var Person = require('./person');
function Coder(){
	Person.call(this);
}

util.inherits(Coder, Person);

Coder.prototype.code = function(){
	console.log('I am coding');
}

module.exports = Coder;