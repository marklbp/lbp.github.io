var email = require('./email');
var emailAddress = '492383469@qq.com';
var subject = 'test for email module';
var content = '<html><head><title>test</title></head><body><div>Node.js book test</div></body></html>';
email.sendMail(emailAddress, subject, content);