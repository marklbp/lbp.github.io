var curl = require('./curl');
curl.get('http://127.0.0.1:1337', function(data){
	console.log(data);
});

curl.post('http://127.0.0.1:1400', {'name':'book'}, function(data){
	console.log(data);
});