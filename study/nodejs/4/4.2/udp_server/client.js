var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var message = new Buffer("hi danhuang， node.js is waiting for you");
client.send(message, 0, message.length, 41234, "127.0.0.1",function(){
	client.on("message", function (msg, rinfo) {
	console.log('a'+msg+'a');
 });
});

//client.close();