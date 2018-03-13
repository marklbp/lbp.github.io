var encodeModule = require('./encode_module');

/*encode with hash*/
console.log('-----encode with hash-----');
var hashEncodeStr = encodeModule.encode('hash', 'md5', 'danhuang', 'hex');
console.log(hashEncodeStr);

/*encode with hmac*/
console.log('-----encode with hmac-----');
var hmacEncodeStr = encodeModule.encode('hmac', 'md5', 'danhuang', 'hex', 'dan');
console.log(hmacEncodeStr);

/*encode with cipher*/
console.log('-----encode with cipher-----');
var cipherEncodeStr = encodeModule.encode('cipher', 'aes-256-cbc', 'danhuang', 'hex', 'salt_from', 'utf8');
console.log(cipherEncodeStr);

/*decode with decipher*/
console.log('-----decode with decipher-----');
var decipherEncodeStr = encodeModule.decode('cipher', 'aes-256-cbc', cipherEncodeStr, 'utf8', 'salt_from', 'hex');
console.log(decipherEncodeStr);


/*encode with sign*/
console.log('-----encode with sign-----');
var fs = require('fs');
var privatePem = fs.readFileSync('client.pem');
var key = privatePem.toString();
var signEncodeStr = encodeModule.encode('sign', 'RSA-SHA256', 'danhuang', 'hex', key, 'utf8');
console.log(signEncodeStr);
