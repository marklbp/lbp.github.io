var fs = require('fs');
fs.exists('index.txt', function(stats){
	if(stats){
		fs.rename('index.txt', 'test.txt', function(err){
			fs.unlink('test.txt', function(err){
				if(err)console.log(err);
				else
					console.log('delete success');
			});
		});
	}
});