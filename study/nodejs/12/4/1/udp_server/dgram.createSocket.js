/*dgram.createSocket.js*/
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
server.on("message", function (msg, rinfo) {
	var imageObject = JSON.parse(msg);
	resizeImage(imageObject.url, imageObject.width, imageObject.height, imageObject.new_name, function(ret){
		var retJson;
		if(ret == -1){
			retJson = {'code':-1, 'msg':'some error in resize image', 'data':{}}
		} else {
			retJson = {'code':0, 'msg':'success','data':{'name':imageObject.new_name}}
		}
		var retStr = JSON.stringify(retJson);
		var message = new Buffer(retStr);
		server.send(message, 0, message.length, rinfo.port, rinfo.address);
	});	
});

server.on("crop", function (msg, rinfo) {
	var imageObject = JSON.parse(msg);
	resizeImage(imageObject.url, imageObject.width, imageObject.height, imageObject.new_name, function(ret){
		var retJson;
		if(ret == -1){
			retJson = {'code':-1, 'msg':'some error in resize image', 'data':{}}
		} else {
			retJson = {'code':0, 'msg':'success','data':{'name':imageObject.new_name}}
		}
		var retStr = JSON.stringify(retJson);
		var message = new Buffer(retStr);
		server.send(message, 0, message.length, rinfo.port, rinfo.address);
	});	
});

server.on("listening", function () {
   var address = server.address();
   console.log("server listening " + address.address + ":" + address.port);
});
server.bind(41234);

function resizeImage(url, width, height, newName, callback){
	var im = require('imagemagick');
	im.resize({
		srcPath: url,
		dstPath: newName,
		width:   width,
		height:   height
	}, function(err, stdout, stderr){
		if (err){
			callback(-1);
			console.log(err);
		} else {
			console.log(stdout);
			callback(stdout);
		}
	});
}

function cropImage(url, width, height, newName, callback){
	var im = require('imagemagick');
	im.crop({
		srcPath: url,
		dstPath: newName,
		width:   width,
		height:   height
	}, function(err, stdout, stderr){
		if (err){
			callback(-1);
			console.log(err);
		} else {
			console.log(stdout);
			callback(stdout);
		}
	});
}
