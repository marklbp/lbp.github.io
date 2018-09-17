var util = require("util");
var Person = require('./person');
function Student(){

	Person.call(this);
　　util.inherits(Student, Person);
　　this.study = function(){
　　     console.log('study~~!!!');
　　}
}
module.exports = Student;