/*dgram.createSocket.js*/
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var message = new Buffer("message from server");
server.on("message", function (msg, rinfo) {
    console.log("server get: " + msg + " from " + rinfo.address + ":" + rinfo.port);
 });
server.on("listening", function () {
   var address = server.address();
   console.log("server listening " + address.address + ":" + address.port);
});
server.bind(41234);