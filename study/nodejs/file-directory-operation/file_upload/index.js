 /* 首先require 加载两个模块 */
 var http         = require('http'), 
	 fs           = require('fs'),
	 url   	      = require('url'),
	 querystring  = require('querystring'),
	 httpParam    = require('./http_param'),
	 staticModule = require('./static_module'),
	 formidable = require("formidable");
var BASE_DIR      = __dirname;
http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	httpParam.init(req, res);
	if(pathname == '/favicon.ico'){
		return;
	}
	switch(pathname){
		case '/upload' : upload(res, req);
		break;
		case '/image'  : showImage(res, req);
		break;
		case '/'       :  defaultIndex(res);
		break;
		case '/index'  :  defaultIndex(res);
		break;
		case '/show'   :  show(res);
		break;
		default        :  staticModule.getStaticFile(pathname, res, req);
		break;
	}
}).listen(1337);

function defaultIndex(res){
	/* 获取当前index.html的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

function upload(res, req){
	var readPath = __dirname + '/' +url.parse('show_image.html').pathname;
	var indexPage = fs.readFileSync(readPath);
    var form = new formidable.IncomingForm();
	form.parse(req, function(error, fields, files) {
		fs.renameSync(files.image.path, BASE_DIR + '/uploadFile/test.png');
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(indexPage);
	});
}
function show(res){
	var readPath = __dirname + '/' +url.parse('show_image.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

function showImage(res, req){
	var retData = {'retCode':0, 'imageUrl': '/uploadFile/test.png'};
    res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end(JSON.stringify(retData));
}