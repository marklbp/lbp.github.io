var crypto = require('crypto');  

/*-------------binary md5------------------*/
var hmac = crypto.createHmac("md5", 'dan');  
hmac.update(new Buffer("huangdanhua", "binary"));
var encode = hmac.digest('hex');  
console.log("binary data: " + encode);

/*-------------string md5------------------*/
var hmac = crypto.createHmac("md5", 'dan');
hmac.update("huangdanhua");  
var encode = hmac.digest('hex');  
console.log("string:" + encode);

/*-------------string sha1------------------*/
var hmac = crypto.createHmac("sha1", 'dan');
hmac.update("huangdanhua");  
var encode = hmac.digest('hex');  
console.log("string sha1:" + encode);
