var crontab = require('./crontab');
crontab.circle_task(3000, show);
crontab.circle_task(3000, doIt);
crontab.circle_task(3000, 'dir');

crontab.time_task('12:24:00', show);
crontab.time_task('12:24:00', doIt);

function show(){
	console.log('show time');
}

function doIt(){
	console.log('do it');
}