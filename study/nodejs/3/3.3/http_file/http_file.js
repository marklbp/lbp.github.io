var BASE_DIR = __dirname,
	path  = require('path');
var app=function(req,res)
{
 var realPath = BASE_DIR + req.url;
 res.writeHead(200,{'Content-Type':'text/plain'})
 var buffer=new Buffer(100)
 var fs=require('fs');
 console.log(realPath);
 console.log(buffer);
 fs.read(realPath,buffer,0,buffer.length,1,function(e,l,b){
	res.write(b.toString('utf8',0,l))
	console.log(b.toString('utf8',0,l));
	fs.close(realPath);
	res.end();
 });
}
http = require('http')
server = http.createServer(app)
server.listen(8000)
console.log('GET http://127.0.0.1:8000/test.conf')