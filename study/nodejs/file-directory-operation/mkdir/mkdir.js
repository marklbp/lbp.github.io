var BASE_DIR = __dirname;
var fs = require('fs');
fs.mkdir(BASE_DIR+'/danhuang.txt', function (err) {
  if (err) throw err;
  console.log('create danhuang.txt success');
});
