var Person = require('./person');
var Student = require('./student');
var Teacher = require('./teacher');
var Coder = require('./coder');
//var Overload = require('./overload');

var personObj = new Person();
var studentObj = new Student();
var teacherObj = new Teacher();
var coderObj = new Coder();
//var overloadObj = new Overload();

console.log('-----for base class of person---------');
personObj.sleep();
personObj.eat();
console.log('--------------');

console.log('-----for class of student---------');
studentObj.sleep();
studentObj.eat();
studentObj.study();
console.log('--------------');

console.log('-----for class of teacher---------');
teacherObj.sleep();
teacherObj.eat();
teacherObj.teach();
console.log('--------------');

console.log('-----for class of coder---------');
coderObj.sleep();
coderObj.eat();
coderObj.code();
console.log('--------------');

/*
console.log('-----for class of overload---------');
overloadObj.eat();
console.log('--------------');
	
*/
