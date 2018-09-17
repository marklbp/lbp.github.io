/**
 *
 * 设置路径全局变量
 */
global.BASE_DIR = __dirname;
global.APP      = BASE_DIR + "/app/";
global.CON      = APP + "/controller/";
global.CORE     = APP + "/core/";
global.LIB      = BASE_DIR + "/node_modules/";
global.CONF     = BASE_DIR + "/conf/";
global.STATIC   = BASE_DIR + "/static/";
global.VIEW     = BASE_DIR + "/view/";
 
 /**
 * modules引入
 */
global.lib = {
	http        : require('http'), 
	fs          : require('fs'),
	url   	    : require('url'),
	querystring : require('querystring'),
	httpParam   : require(LIB + 'http_param'),
	staticModule: require(LIB + 'static_module'),
	router      : require(CORE + 'router'),
	action      : require(CORE + 'action'),
	jade        : require('jade'),
	socket      : require('socket.io'),
    path        : require('path'),
    parseCookie : require('connect').utils.parseCookie,
    session     : require(LIB + 'node_session'),
    util        : require('util'),
	config      : require(CORE + 'comm/util')
}

global.onlineList = {};

global.app = lib.http.createServer(function(req, res) {
	res.render = function(){
		var template = arguments[0];
		var options = arguments[1];
		var str = lib.fs.readFileSync(template, 'utf8');
		var fn = lib.jade.compile(str, { filename: template, pretty: true });
		var page = fn(options);
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(page);
	}
	lib.router.router(res, req);
}).listen(8000);
global.io = lib.socket.listen(app);


