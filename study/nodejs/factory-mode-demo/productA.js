/* productA.js */
var Product = require('./product');
var util = require("util");

function ProductA(){
	Product.call(this);
	this.getProduct = function(){
		console.log('product is get from class of ProductA');
	}
}

util.inherits(ProductA, Product);

module.exports = ProductA;
