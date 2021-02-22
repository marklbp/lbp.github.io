var BASE_DIR = __dirname;
var fs = require('fs');
fs.stat(BASE_DIR+'/danhuang.txt', function (err, stats) {
  if (err) throw err;
  console.log(stats);
});