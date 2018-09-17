var http = require('http'), 
	 url   = require('url'),
	 querystring = require("querystring");
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	if (pathname == '/favicon.ico') {
		return;
	}
	var pathArr = pathname.split('/');
	// 弹出第一个空字符
	pathArr.shift();
	
	var model = pathArr.shift()
	  , controller = pathArr.shift()
	  , classObj = '';
	if(!model || !controller){
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('can not find source');
	}
	
	try {
		classObj = require('./' + model);
	}
	catch (err) {
		console.log('chdir: ' + err);
	}
	if(classObj){
		classObj.init(res, req);
		try{
			classObj[controller].call();
		} catch(err){
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('can not find source');
		}
		
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('can not find source');
	}
}).listen(1337);