var date = new Date();
var millSec = date.getSeconds();
var minSec = 1;
while(minSec<5){
	var nowDate = new Date();
	var nowMillSec = nowDate.getSeconds();
	var tempSec = nowMillSec - millSec;
	if(tempSec != minSec){
		minSec = tempSec;
		console.log('wait for ' + minSec + ' seconds');
	} 
}
console.log('if it is waiting more than 5 seconds, this is a block code');