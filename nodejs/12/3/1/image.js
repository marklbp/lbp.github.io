/* image.js */
var res, req,
	fs = require('fs'),
	url   = require('url');
exports.init = function(response, request){
	res = response;
	req = request;
}

exports.imgJpg = function(){
	/* 获取当前image的路径 */
	var readPath = __dirname + '/' +url.parse('img.jpg').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'image/png' });
	res.end(indexPage);
}