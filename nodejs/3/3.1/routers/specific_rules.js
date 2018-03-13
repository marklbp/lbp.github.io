 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 fs    = require('fs'),
	 url   = require('url'),
	 response;
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log(req.url);
	console.log(req.method);
	console.log(req.headers);
	var param = pathname.substr(2),
		firstParam = pathname.substr(1,1).toUpperCase();
	var functionName = 'res' + firstParam + param;
		response = res;
	if(pathname == '/'){
		resDefault(res)
	} else if (pathname == '/favicon.ico') {
		return;
	}
	else{
		eval(functionName + '()');
	}
}).listen(1337);

function resIndex(){
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.end(indexPage);
}

function resImg(){
	/* 获取当前image的路径 */
	var readPath = __dirname + '/' +url.parse('logo.png').pathname;
	var indexPage = fs.readFileSync(readPath);
	response.writeHead(200, { 'Content-Type': 'image/png' });
	response.end(indexPage);
}

function resDefault(){
	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.end('can not find source');
}