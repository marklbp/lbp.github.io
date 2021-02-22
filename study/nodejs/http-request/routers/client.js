 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 url   = require('url'),
	 querystring = require("querystring");
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	if (pathname == '/favicon.ico') {
		return;
	}
	var module = pathname.substr(1),
		str    = url.parse(req.url).query,
		controller = querystring.parse(str).c,
		classObj = '';
	try {
		classObj = require('./' + module);
	}
	catch (err) {
		console.log('chdir: ' + err);
	}
	if(classObj){
		classObj.init(res, req);
		classObj[controller].call();
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('can not find source');
	}
}).listen(1337);