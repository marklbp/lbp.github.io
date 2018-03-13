var config = require('./config');
var nodemailer = require('nodemailer');

var emailConf = config.get('email.json', 'json');
var mail = nodemailer.createTransport("SMTP",{
    service: emailConf['service'],
    auth: {
        user: emailConf['user'],
        pass: emailConf['pass']
    }
});

exports.sendMail = function(emailAddress, title, content){
	mail.sendMail(
	{
		sender:emailConf['host'], 
		to : emailAddress, 
		subject:title,
		html:content 
	},function(error,success){
		if(!error){
			console.log('message success', success);
		}else{
			console.log('failed '+error);
		}
	});
}
