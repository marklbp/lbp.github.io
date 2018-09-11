var prefix = '\33[';
var appendfix = '';
var spt = String.prototype;
var colors = {
	blackc:     '30m',
	redc:       '31m',
	greenc:     '32m',
	yellowc:    '33m',
	purplec:    '35m',
	skyBluec:   '36m',
	whitec:     '37m'
};

var extendsStringPrototype = function(){
	for(var c in colors){
		(function(c){
			Object.defineProperty(spt, c, {
				get(){
					return prefix + colors[c] + this + appendfix;
				}
			})
		})(c)
	}
}

module.exports = extendsStringPrototype;