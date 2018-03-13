/* productFactory.js */
var ProductA = require('./productA');
var ProductB = require('./productB');

exports.createProduct = function(type){
	switch(type) {
		case 'ProductA' : return new ProductA();
		break;
		default:
		case 'ProductB' : return new ProductB();
		break;
		
	}
}