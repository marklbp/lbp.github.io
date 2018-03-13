var test = require('./test_module');
console.log(test.name);

test.show ? test.show() : console.log('test object has no method show');

test.say();
