/**
 *
 * @author danhuang 2013-03-07
 * log example log.error(RET_NUM.RET_SUCC, LOG_CONTR.SERVER, {'a':'1', 'b':'2'});
 */
 var loguser = 'system';
 var logpath = 'logs';
 var appLog  = require('./appLog');
 var log4js  = require('log4js');
 var fs      = require('fs');
 
module.exports = function(user, path){
	log4js.loadAppender('file');
	var loguser   = user
	  , logpath   = path
	  , dateStr   = getDateTime()
	  , logger    = log4js.getLogger(loguser);
	
	// for error log
	this.error = function(errNum, controller, logInfo){
		var errType  = 'error';
		log(errType, errNum, controller, logInfo);
	}
	
	// for info log
	this.info = function(errNum, controller, logInfo){
		var errType  = 'info';
		log(errType, errNum, controller, logInfo);
	}   
	
	// for warn log
	this.warn = function(errNum, controller, logInfo){
		var errType  = 'warn';
		log(errType, errNum, controller, logInfo);
	}
	
	// for debug log
	this.debug = function(errNum, controller, logInfo){
		var errType  = 'debug';
		log(errType, errNum, controller, logInfo);
	}
	
	// add log in log file
	function log(errType, errorCode, controller, otherInfo){
		var otherInfo = otherInfo ? otherInfo : {};
		var errorMsg = appLog.getMsg(errorCode);
		var errorLog = getLogFileName(errType, controller);
		log4js.addAppender(log4js.appenders.file(errorLog), loguser);
		var jsonStr  = JSON.stringify(otherInfo);
		errorMsg = '[code ' + errorCode + '] '  + '[msg ' + errorMsg + '] ' + jsonStr;
		addLog(errType, errorMsg);
		log4js.clearAppenders();
	}
	
	function getLogFileName(errType, controller){
		var logPrefix = logpath + '/' + dateStr + '/';
		// create log file path
		try{
			fs.readdirSync(logPrefix);
		} catch (err){
			fs.mkdirSync(logPrefix);
		}
		switch(errType){
			case 'error' : return logPrefix + controller + '_error.log';
			break;
			case 'info'  : return logPrefix + controller + '_info.log';
			break;
			case 'warn'  : return logPrefix + controller + '_warn.log';
			break;
			case 'debug' : return logPrefix + controller + '_debug.log';
			break;
		}
	}
	
	function addLog(errType, errorMsg){
		switch(errType){
			case 'error' : logger.error(errorMsg);
			break;
			case 'info'  : logger.info(errorMsg);
			break;
			case 'warn'  : logger.warn(errorMsg);
			break;
			case 'debug' : logger.debug(errorMsg);
			break;
		}
	}
}


/**
 *	@return	{string} 20130307
 */
function getDateTime(timestamp) {
	var timeTemp = timestamp ? new Date(timestamp) : new Date(),
		currentTime;
	var yy = timeTemp.getFullYear();
	var MM = timeTemp.getMonth();
	var dd = timeTemp.getDate();

	// fixed MM, value of MM from 0 to 11
	MM === 0 ? MM = 12 : MM++;

	// fixed time format
	MM < 10 ? MM = '0'.concat(MM) : null;
	dd < 10 ? dd = '0'.concat(dd) : null;
	
	return '' + yy + MM + dd;
}