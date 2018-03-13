var BASE_DIR = __dirname;
var fs = require('fs');
fs.chmod(BASE_DIR+'/danhuang.txt', '777', function (err) {
  if (err) throw err;
  console.log('chmod complete');
});