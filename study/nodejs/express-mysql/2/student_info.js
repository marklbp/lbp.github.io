var BaseMongodb = require('./base_mongodb')
  , util = require('util');
function StudentInfo(){
	BaseMongodb.call(this);
	util.inherits(BaseMongodb, this);
	
	var tableName = 'student_info'
	  , _self     = this;
	
	this.doAddStudent = function(studentInfo){
		_self.insert(tableName, studentInfo, function(ret){
			console.log(ret);
		});
	}
}

var studentInfo = new StudentInfo();
exports.doAddStudent = studentInfo.doAddStudent;