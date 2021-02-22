/* decorator.js */
var util = require("util");
var Component = require('./component');
function Decorator(){
	Component.call(this);
}

util.inherits(Decorator, Component);

module.exports = Decorator;