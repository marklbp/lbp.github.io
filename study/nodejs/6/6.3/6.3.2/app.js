var http = require('http');
var router = require('./router');
var router_update = require('./router_update');

var app = http.createServer(function(req, res) {
	//router.router(res, req);
	router_update.router(res, req);
}).listen(8000);