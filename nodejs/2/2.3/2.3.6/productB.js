/* productB.js */
var Product = require('./product');
var util = require("util");

function productB(){
	Product.call(this);
	this.getProduct = function(){
		console.log('product is get from class of productB');
	}
}

util.inherits(productB, Product);

module.exports = productB;