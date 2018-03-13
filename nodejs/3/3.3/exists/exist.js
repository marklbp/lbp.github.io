var BASE_DIR = __dirname;
var fs = require('fs');
fs.exists(BASE_DIR+'/danhuang.txt', function (existBool) {
  if(existBool){
	console.log('danhuang.txt exist');
  } else {
	console.log('danhuang.txt not exist');
  }
});

fs.exists(BASE_DIR+'/dan.txt', function (existBool) {
  if(existBool){
	console.log('dan.txt exist');
  } else {
	console.log('dan.txt not exist');
  }
});