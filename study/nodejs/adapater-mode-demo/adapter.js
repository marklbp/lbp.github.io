/* adapter.js */
var util = require("util");
var Target = require('./target');
var Adaptee = require('./adaptee');

function Adapter(){
	Target.call(this);
	this.request = function(){
        var adapteeObj = new Adaptee();
        adapteeObj.specialRequest();
    }
}
util.inherits(Adapter, Target);
module.exports = Adapter;