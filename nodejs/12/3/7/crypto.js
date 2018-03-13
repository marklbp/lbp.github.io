/* crypto.js */
var res, req,
	fs = require('fs'),
	url   = require('url'),
	crypto = require('crypto');
exports.init = function(response, request){
	res = response;
	req = request;
}

exports.index = function(){
	var readPath = __dirname + '/' +url.parse('index.html').pathname;
	var indexPage = fs.readFileSync(readPath);
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(indexPage);
}

exports.cipher = function(){
	var key = httpParam.GET('key'),
	    plaintext = httpParam.GET('plaintext'),
	    cipher = crypto.createCipher('aes-256-cbc', key);
	cipher.update(plaintext, 'utf8', 'hex');
	
	var encryptedPassword = cipher.final('hex');
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(encryptedPassword);
}

exports.decipher = function(){
	var key = httpParam.GET('key'),
	    plaintext = httpParam.GET('plaintext'),
	    decipher = crypto.createDecipher('aes-256-cbc', key);
	decipher.update(plaintext, 'hex', 'utf8');

	var decryptedPassword = decipher.final('utf8');
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(decryptedPassword);
}