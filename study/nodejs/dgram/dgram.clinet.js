var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var message = Buffer.from("hi danhuang， node.js is waiting for you");
client.send(message, 0, message.length, 41234, "127.0.0.1");
client.close();