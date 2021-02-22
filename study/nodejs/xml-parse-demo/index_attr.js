var xml = require('./xml');
xml.parse('xml/attribute.xml', 'attribute.xml', function(ret){
	//console.log(ret);
	//console.log('to:', ret['data']['note']['to']);
	console.log('to:', ret['data']['note']['to'][0]['_'], ' sex:', ret['data']['note']['to'][0]['$']['sex']);
	console.log('from:', ret['data']['note']['from'][0]['_'], ' sex:', ret['data']['note']['from'][0]['$']['sex'], ' age:',ret['data']['note']['from'][0]['$']['age']);
	console.log('heading:', ret['data']['note']['heading'][0]);
	console.log('body:', ret['data']['note']['body'][0]['_'], ' time:', ret['data']['note']['body'][0]['$']['time']);
});