var url = require('url');
exports.router = function(res, req){
	var pathname = decodeURI(url.parse(req.url).pathname);
	var pathArr = pathname.split('/')
	  , model = pathArr[1]
	  , controller = pathArr[2]
	  , Class = '';
	if(model == 'favicon.ico'){
		return;
	}
	Class = require('./controller/' + model);
	var object = new Class(res, req);
	object[controller].call();
}