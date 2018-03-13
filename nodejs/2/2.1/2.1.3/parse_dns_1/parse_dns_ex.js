/**
 * http dns fileSystem url是node.js原生模块
 * 主要是利用两者做一个域名解析例子
 */
 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 dns   = require('dns'),
	 fs    = require('fs'),
	 url   = require('url'),
	 querystring = require("querystring");
/* 查看官网API我们可以看到http模块提供创建http的方法，dns提供解析dns的方法 */

/* 创建http服务器 */
http.createServer(function(req, res) {
	/* 写http head 返回html，因此Content-Type为html*/
	var pathname = url.parse(req.url).pathname;
	var postData = "";
	req.setEncoding("utf8");
	res.writeHead(200, { 'Content-Type': 'text/html' });
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	/* 返回 */
	res.end(indexPage);
}).listen(3000, "127.0.0.1");
/* 打印运行log */
console.log('Server running at http://127.0.0.1:3000/');

function router(key, postData, callback){
	var domain = querystring.parse(postData).search_dns;
	if(key == "/parse"){
		getDns(domain,function(address){if(!address){address=['不存在域名']};callback(address,domain)});
	}
}

function getDns(domain,callback){
	dns.resolve(domain, function(err, addresses){
		callback(addresses);
	});
}

