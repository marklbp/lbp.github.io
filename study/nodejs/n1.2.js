var fs = require("fs");

function getFileData(cb){
	fs.readFile("n1.2.conf", function(err,data){
		cb(data);
	});
}

function returnData(cb){
	getFileData(function(data){
		setTimeout(function(){
           cb(data);
		}, 1000);
	})
}

returnData(function(data){
	console.log(data)
})

console.log("waiting....")