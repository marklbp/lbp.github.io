/* index.js */
var res, req,
	fs = require('fs'),
	url   = require('url'),
	querystring = require('querystring'),
	httpParam = require('./http_param'),
	BASE_DIR = __dirname;
	
exports.init = function(response, request){
	res = response;
	req = request;
	httpParam.init(req, res);
}

exports.del = function(){
	var file = httpParam.GET('file');
	fs.exists(BASE_DIR+'/file_test/' + file, function (existBool) {
		if(existBool){
			var ret = '';
			fs.unlink(BASE_DIR+'/file_test/' + file, function (err) {
			  if (err) {
				ret = err;
			  } else {
				ret = 'delete file success!';
			  }
			  res.writeHead(200, { 'Content-Type': 'text/plain' });
			  res.end(ret);
			});
		} else {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end('not exist file!');
		}
	});
}

exports.read = function(){
	var folder = httpParam.GET('folder');
	console.log(BASE_DIR+'/' + folder);
	fs.exists(BASE_DIR+'/' + folder, function (existBool) {
		if(existBool){
			var ret = '';
			fs.readdir(BASE_DIR+'/' + folder, function (err, files) {
			  if (err) {
				ret = err;
			  } else {
				ret = JSON.stringify(files);
			  }
			  res.writeHead(200, { 'Content-Type': 'text/plain' });
			  res.end(ret);
			});
		} else {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('404 not find!');
		}
	});
}





