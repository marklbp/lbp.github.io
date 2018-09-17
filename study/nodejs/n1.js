/*
var http = require("http");
http.createServer(function(req,res) {
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end('You are so good')
}).listen(8080,"127.0.0.1");
console.log("Server running at http://127.0.0.1:80/");
*/

var http = require("http");
http.createServer(function(req,res) {
	var html = "<html>\
					<head>\
						<title>This is a test html file</title>\
					</head>\
					<body>\
						<div>Hi there! Nice to meet you here!</div>\
					</body>\
				</html>";
	res.writeHead(200,{"Content-Type":"text/html"});
	res.end(html)
}).listen(8080,"127.0.0.1");
console.log("Server running at http://127.0.0.1:80/");