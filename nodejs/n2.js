var http = require('http'),
	dns = require('dns'),
	fs = require('fs'),
	url = require('url'),
	querystring = require('querystring');

http.createServer(function(req,res){
	var pathname = url.parse(req.url).pathname;
	req.setEncoding("utf8");
	res.writeHead(200,{'Content-Type': 'text/html'});
	/*var readPath = __dirname + '/' + url.parse('n2.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.end(indexPage);*/
	router(res,req,pathname);
}).listen(3000,"127.0.0.1");

function router(res,req,pathname){
	switch(pathname){
		case "/parse":
			parseDNS(res,req);
			break;
		default:
			goIndex(res,req);
	}
}

function goIndex(res,req){
	var readPath = __dirname + '/' + url.parse('n2.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.end(indexPage);
}

function parseDNS(res, req){
	var postData = "";
	req.addListener("data", function(data){
		postData += data;
	});
	req.addListener("end", function(){
		getDNS(postData,function(domain,address){
			console.log(address);
			//address = address.join(".");
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.end(`<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="UTF-8">
							<title>DNS 查询</title>
						</head>
						<body>
							<div style="text-align: center;">
								Domain:<span>${domain}</span>
								IP:<span>${address.join(" ")}</span>
							</div>
						</body>
					</html>`);
		})
		return;
	});
}

function getDNS(data,cb){
	var domain = querystring.parse(data).search_dns;
	dns.resolve(domain, function(err, address){
		if(!address){
			address = ['不存在域名']
		}
		cb(domain,address);
	})
}

console.log("Server runing at 127.0.0.1:3000");