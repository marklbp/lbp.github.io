/**
 * @class Teacher
 */
var util = require("util");
var Person = require('./person');
function Teacher(){
	Person.call(this);
}

util.inherits(Teacher, Person);

Teacher.prototype.teach = function(){
	console.log('I am teaching');
}

module.exports = Teacher;