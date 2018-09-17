var fs = require('fs');
/* delete file  */
deleteFile('index.txt');
/**
 *
 * @desc check file and delete file
 * @param file string
 * @return null
 */
function deleteFile(file){
	fs.exists(file, function(stats){
		if(stats){
			rename(file, 'test.txt');
		}
	});
}
/**
 *
 * @desc rename file
 * @param file string
 * @param newName string
 * @return null
 */
function rename(file, newName){
	fs.rename(file, newName, function(err){
		unlink(newName, showResult);
	});
}
/**
 *
 * @desc delete file
 * @param file string
 * @param callback function
 * @return null
 */
function unlink(file, callback){
	fs.unlink(file, function(err){
		if(err)console.log(err);
		else
			callback('delete success');
	})
}
/**
 *
 * @desc show message
 * @param msg string
 * @return null
 */
function showResult(msg){
	console.log(msg);
}

