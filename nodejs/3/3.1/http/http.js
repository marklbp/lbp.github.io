 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 fs    = require('fs'),
	 url   = require('url');
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log(req.url);
	console.log(req.method);
	console.log(req.headers);
	switch(pathname){
		case '/index' : resIndex(res);
		break;
		case '/img'   : resImage(res);
		break;
		default       : resDefault(res);
		break;
	}
}).listen(1337);

function resIndex(res){
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

function resImage(res){
	/* 获取当前image的路径 */
	var readPath = __dirname + '/' +url.parse('logo.png').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'image/png' });
	res.end(indexPage);
}

function resDefault(res){
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end('can not find source');
}
console.log('Server running at http://localhost:1337/');