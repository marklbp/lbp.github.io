var http = require("http")
	,fs = require("fs")
	,url = require("url")
	,sys = require("util")
	,querystring = require("querystring")
	,path = require("path")
	,mineTypeObj = getMineTypeConf();

var Server = http.createServer(function(req,res){
	var pathname = url.parse(req.url).pathname;
	/*	,paramStr = url.parse(req.url).query
		,param = querystring.parse(paramStr);*/
	if('favicon.ico' == pathname)return;
	router(req,res,pathname);
}).listen("8000");

console.log('Server running at http://localhost:8000/');

function router(req,res,pathname){
	var staticFilePath = __dirname + pathname;
	var extname = path.extname(pathname);
	var action = pathname.substring(pathname.lastIndexOf("/")+1);
	if(extname.length <= 0){
		if(actions[action])return actions[action](req,res,pathname);
		return actions['defaultIndex'](req,res,pathname)
	}
	dealWithStatic(req,res,staticFilePath, pathname)
}

function dealWithStatic(req, res, staticFilePath, pathname){
	fs.exists(staticFilePath, function(exists){
		if(!exists){
			res.writeHead(404,{'Content-Type': 'text/plain'});
			res.write("~Oooh no! Not found " + staticFilePath);
			res.end();
		}else{
			getStaticFile(req, res, pathname, staticFilePath)
		}
	});
}

function getMineTypeConf(){
	var temp = {};
	try{
		temp = JSON.parse(fs.readFileSync('mine_type.json', 'utf8'))
	}catch(ex){
		sys.debug("JSON parse failed")
	}
	return temp;
}

function getStaticFile(req, res, pathname, staticFilePath){
	var extname = path.extname(pathname);
	extname = extname ? extname.slice(1) : '';
	var mineType = mineTypeObj[extname] ? mineTypeObj[extname] : 'text/plain';

	fs.exists(staticFilePath, function(exists){
		if(!exists){
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.write("~Oooh no! Not found " + staticFilePath);
			res.end()
		}else{
			var fileInfo = fs.statSync(staticFilePath);
			var lastModified = fileInfo.mtime.toUTCString();
			var CACHE_TIME = 60 * 60;
			if(mineTypeObj[extname]){
				var date = new Date();
				date.setTime(date.getTime() + CACHE_TIME * 1000);
				res.setHeader("Expires", date.toUTCString());
				res.setHeader("Cache-Control", "max-age=" + CACHE_TIME)
			}
			if(req.headers["if-modified-since"] && lastModified == req.headers["if-modified-since"]){
				res.writeHead(304, "Not Modified");
				res.end()
				return;
			}
			fs.readFile(staticFilePath, "binary", function(err, file) {
				if(err){
					res.writeHead(500, {'Content-Type': 'text/plain'});
					res.end(err);
				}else{
					res.setHeader("Last-Modified", lastModified);
					res.writeHead(200, {'Content-Type': mineType});
					res.write(file, 'binary');
					res.end()
				}
			})
		}
	})
}

var actions = {
		defaultIndex: (req, res, pathname)=>{
			/*res.writeHead(200, {'Content-Type': 'text/html'});
			var readPath = __dirname + '/' + url.parse('index.html').pathname;
			var indexPage = fs.readFileSync(readPath);
			res.end(indexPage);*/
			var pathname = "/index.html";
			var staticFilePath = __dirname + "/index.html";
			return getStaticFile(req, res, pathname, staticFilePath)
		}
	}

module.exports = {
	actions
}