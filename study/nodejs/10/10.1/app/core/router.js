/**
 *
 * @author danhuang 2013-03-07
 *
 */
var FAVICON = '/favicon.ico';

exports.router = function(res, req){
	var logInfo = {};
	// url解码，避免url路径出现中文字符
	var pathname = decodeURI(lib.url.parse(req.url).pathname);
	// 初始化http参数获取模块
	lib.httpParam.init(req, res);
	// 初始化session管理模块
	global.sessionLib = lib.session.start(res, req);
	// 获取http请求路径，使用斜杠获取请求的controller类名以及action方法
	var pathArr = pathname.split('/');
	// 弹出第一个空字符
	pathArr.shift();
	var model = pathArr.shift()
	  , controller = pathArr.shift()
	  , Class = '';
	  
	//  添加日志信息
	logInfo['pathname'] = pathname;
	logInfo['model'] = model;
	logInfo['controller'] = controller;
	
	// 过滤favicon请求
	if(pathname == FAVICON){
		return;
	}else if(pathname == '/'){
		res.render(VIEW + 'index.jade');
		return;
	}
	if(!controller || !model){
		returnDefault(res, 'can not find source');
		return;
	}
	// 尝试require一个controller类名，如果失败则认为是一个静态资源文件请求
	try {
		Class = require(CON + model);
	}
	catch (err) {
		console.log(err);
		lib.staticModule.getStaticFile(pathname, res, req, BASE_DIR);
		return;
	}
	if(Class){
		var object = new Class(res, req);
		try{
			object[controller].call();
		} catch(err){
			console.log(err);
			returnDefault(res, 'no this action');
		}
	} else {
		returnDefault(res, 'can not find source');
	}
}

/**
 *
 * 默认404失败页面
 */
function returnDefault(res, string){
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end(string);
}






