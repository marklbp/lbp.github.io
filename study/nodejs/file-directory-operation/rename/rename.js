var BASE_DIR = __dirname;
var fs = require('fs');
fs.rename(BASE_DIR+'/danhuang.txt', BASE_DIR+'/dan.txt', function (err) {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat(BASE_DIR+'/dan.txt', function (err, stats) {
  if (err) throw err;
  console.log('stats: ' + JSON.stringify(stats));
});