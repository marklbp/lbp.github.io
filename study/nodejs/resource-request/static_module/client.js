 /* 首先require 加载两个模块 */
 var http = require('http'), 
	 fs    = require('fs'),
	 url   = require('url'),
	 staticModule = require('./static_module'),
	 BASE_DIR = __dirname;
http.createServer(function(req, res) {
	/* 获取当前index.html的路径 */
	var pathname = url.parse(req.url).pathname;
	if (pathname == '/favicon.ico') {
		return;
	} else if(pathname == '/index' || pathname == '/'){
			goIndex(res)
	} else {	
		staticModule.getStaticFile(pathname, res);
	}

}).listen(1337);
console.log('Server running at http://localhost:1337/');

function goIndex(res){
		var readPath = BASE_DIR + '/' +url.parse('index.html').pathname;
		var indexPage = fs.readFileSync(readPath);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(indexPage);
}
