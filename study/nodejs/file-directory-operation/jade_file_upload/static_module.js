/**
 *
 * 定义全局常用变量
 */
var BASE_DIR = __dirname,
	CONF     = BASE_DIR + '/conf/',
    STATIC   = BASE_DIR,
	CACHE_TIME = 60*60*24*365,
	mmieConf;
/**
 *
 * require本模块需要的Node.js模块
 */
var sys = require('util'),
	http = require('http'), 
	fs    = require('fs'),
	url   = require('url'),
	path  = require('path');
	mmieConf = getMmieConf();

/**
 *
 * 响应静态资源请求
 * @param string pathname
 * @param object res
 * @return null
 */
exports.getStaticFile = function(pathname, res, req){
	var extname = path.extname(pathname);
	extname  = extname  ? extname.slice(1) : '';
	var realPath = STATIC + pathname;
	var mmieType = mmieConf[extname] ? mmieConf[extname] : 'text/plain';
	fs.exists(realPath, function (exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("This request URL " + pathname + " was not found on this server.");
            res.end();
        } else {
			var fileInfo = fs.statSync(realPath);
			var lastModified = fileInfo.mtime.toUTCString();
			/* 设置缓存 */
			if ( mmieConf[extname]) {
				var date = new Date();
				date.setTime(date.getTime() + CACHE_TIME * 1000);
				res.setHeader("Expires", date.toUTCString());
				res.setHeader("Cache-Control", "max-age=" + CACHE_TIME);
			}
			if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
                    res.writeHead(304, "Not Modified");
                    res.end();
            } else {
				
					fs.readFile(realPath, "binary", function(err, file) {
						if (err) {
							res.writeHead(500, {'Content-Type': 'text/plain'});
							res.end(err);
						} else {
						res.setHeader("Last-Modified", lastModified);
						res.writeHead(200, {'Content-Type': mmieType});
						res.write(file, "binary");
						res.end();
					}
             });
          }
		}
      });
}
//获取MMIE配置信息，读取配置文件
function getMmieConf(){
    var routerMsg = {};
    try{
        var str = fs.readFileSync(CONF + 'mmie_type.json','utf8');
        routerMsg = JSON.parse(str);
    }catch(e){
        sys.debug("JSON parse fails")
    }
    return routerMsg;
}
