var config = require('./config');
var testConf = config.get('test.json', 'json');
console.log(testConf);
var info = config.get('test.conf', 'conf');
console.log(info);
console.log(CONFIG);