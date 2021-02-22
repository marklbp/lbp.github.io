var xml = require('./xml');
xml.parse('xml/keyvalue.xml', 'keyvalue.xml', function(ret){
	console.log(ret);
	/*console.log('to:', ret['data']['note']['to'][0]);
	console.log('from:', ret['data']['note']['from'][0]);
	console.log('heading:', ret['data']['note']['heading'][0]);
	console.log('body:', ret['data']['note']['body'][0]);*/
});