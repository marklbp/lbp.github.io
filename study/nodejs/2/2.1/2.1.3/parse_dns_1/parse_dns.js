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
	req.setEncoding("utf8");
	res.writeHead(200, { 'Content-Type': 'text/html' });
	router(res, req, pathname);
}).listen(3000, "127.0.0.1");
/* 打印运行log */
console.log('Server running at http://127.0.0.1:3000/');

function router(res, req, pathname){
	switch (pathname){
		case "/parse": 
			parseDns(res, req)
		break;
		default: 
			goIndex(res, req)
	}
}

function parseDns(res, req){
	var postData = "";
	req.addListener("data", function(postDataChunk) {
      postData += postDataChunk; 
    });
	req.addListener("end", function() {
		var retData = getDns(postData,function(domain,addresses){
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end("<html><head><meta http-equiv='content-type' content='text/html;charset=utf-8'></head><div style='text-align:center'>Domain:<span style='color:red'>" + domain + "</span> IP:<span style='color:red'>" + addresses.join(',') + "</span></div></html>");
		});
		return;
	});
}

function goIndex(res, req){
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	/* 返回 */
	res.end(indexPage);
}

function getDns(postData,callback){
	var domain = querystring.parse(postData).search_dns;
	dns.resolve(domain, function(err, addresses){
		if(!addresses){
			addresses=['不存在域名']
		}
		callback(domain, addresses);
	});
}

