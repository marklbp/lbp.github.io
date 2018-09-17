var util = require("util");
var Person = require('./person');
function Student(){

	Person.call(this);
　　util.inherits(Student, Person);
　　this.study = function(){
　　     console.log('study~~!!!');
　　}
}

var student = new Student();

exports.study = student.study;
exports.eat = student.eat;
exports.sleep = student.sleep;