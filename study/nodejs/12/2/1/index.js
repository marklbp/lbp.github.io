/**
 *
 * test code
 */
var PersonClass    = require('./person_class');
var personObject   = require('./person_object');
var personArray    = require('./person_array');
var personArrayObj = require('./person_array_object');
/* person_class */
console.log('=============');
console.log(PersonClass);
var personClass = new PersonClass();
personClass.say();
personClass.eat();

/* person_object */
console.log('=============');
console.log(personObject);
personObject.Person.say();
personObject.Person.eat();

/* person_array */
console.log('=============');
console.log(personArray);

/* person_array_object */
console.log('=============');
console.log(personArrayObj);
console.log(personArrayObj.arr);