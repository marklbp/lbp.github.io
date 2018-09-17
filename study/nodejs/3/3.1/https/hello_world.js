var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('keys/agent2-key.pem'),
  cert: fs.readFileSync('keys/agent2-cert.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(1337);