var fs = require("fs");

fs.readFile('index.conf', function (err, data) {
  getFileData(data);
});


function getFileData(data){
	setTimeout(function(){returnData(data)}, 1000);
}


function returnData(data){
	console.log(data);
}