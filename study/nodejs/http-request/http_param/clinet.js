 /* 首先require 加载两个模块 */
 var http        = require('http'), 
	 fs          = require('fs'),
	 url   	     = require('url'),
	 querystring = require('querystring'),
	 httpParam   = require('./http_param');
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	httpParam.init(req, res);
	switch(pathname){
		case '/add' : resAdd(res, req);
		break;
		default       : resDefault(res);
		break;
	}
}).listen(1337);

function resDefault(res){
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

function resAdd(res, req){
    // 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf8');
	httpParam.POST('name', function(value){
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end(value);
	});
}