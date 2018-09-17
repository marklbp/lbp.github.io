 /* 首先require 加载两个模块 */
 var http         = require('http'), 
	 fs           = require('fs'),
	 url   	      = require('url'),
	 querystring  = require('querystring'),
	 httpParam    = require('./http_param'),
	 staticModule = require('./static_module'),
	 formidable   = require('formidable'),
	 jade         = require('jade');
var BASE_DIR      = __dirname;
http.createServer(function(req, res) {
	res.render = function(template, options){
		var str = fs.readFileSync(template, 'utf8');
		var fn = jade.compile(str, { filename: template, pretty: true });
		var page = fn(options);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(page);
	}
	var pathname = decodeURI(url.parse(req.url).pathname);
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
	res.render('index.jade',{'user':'danhuang'});
}

function upload(res, req){
	var timestamp = Date.parse(new Date());
    var form = new formidable.IncomingForm();
	form.parse(req, function(error, fields, files) {
		var fileName = timestamp + '_' + files.image.name;
		fs.renameSync(files.image.path, BASE_DIR + '/uploadFile/' + fileName);
		res.render('show_image.jade',{'imgUrl':'/uploadFile/' + fileName});
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