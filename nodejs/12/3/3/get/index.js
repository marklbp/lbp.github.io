/* index.js */
var res, req,
	fs = require('fs'),
	url   = require('url'),
	querystring = require('querystring');
exports.init = function(response, request){
	res = response;
	req = request;
}

exports.index = function(){
	/* 获取当前image的路径 */
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

exports.calculate = function(){
	var pathname = url.parse(req.url).pathname,
		paramStr = url.parse(req.url).query,
		param = querystring.parse(paramStr);
	
	var type      = param['type'] ? parseInt(param['type']) : 0
	  , preValue  = param['pre'] ? parseFloat(param['pre']) : 0
	  , nextValue = param['next'] ? parseFloat(param['next']) : 0
	  , ret       = 0;
	switch(type){
		case 1 : ret = preValue + nextValue;
		break;
		case 2 : ret = preValue - nextValue;
		break;
		case 3 : ret = preValue * nextValue;
		break;
		case 4 : ret = preValue / nextValue;
		break;
	}
	ret = '' + ret;
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end(ret);
}





