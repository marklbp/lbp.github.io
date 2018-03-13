var crypto = require('crypto')
  , key = 'salt_from'
  , plaintext = 'danhuang'
  , cipher = crypto.createCipher('aes-256-cbc', key)
  , decipher = crypto.createDecipher('aes-256-cbc', key);
  
cipher.update(plaintext, 'utf8', 'hex');
var encryptedPassword = cipher.final('hex')

decipher.update(encryptedPassword, 'hex', 'utf8');
var decryptedPassword = decipher.final('utf8');

console.log('encrypted :', encryptedPassword);
console.log('decrypted :', decryptedPassword);