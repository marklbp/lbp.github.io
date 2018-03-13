var Log = require('./log.js');
var log = new Log('danhuang', 'logs/');
var appLog = require('./appLog');
log.error(appLog.ERR_NUM.RET_ERR, appLog.LOG_CONTR.API, {'data':'is not ok'});
log.info(appLog.ERR_NUM.RET_SUCC, appLog.LOG_CONTR.SERVER, {'data':'is ok'});
