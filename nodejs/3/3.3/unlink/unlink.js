var BASE_DIR = __dirname;
var fs = require('fs');
fs.unlink(BASE_DIR+'/danhuang.txt', function (err) {
  if (err) throw err;
});
