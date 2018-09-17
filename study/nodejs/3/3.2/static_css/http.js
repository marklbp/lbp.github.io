 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 fs    = require('fs'),
	 url   = require('url');
http.createServer(function(req, res) {
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}).listen(1337);
console.log('Server running at http://localhost:1337/');