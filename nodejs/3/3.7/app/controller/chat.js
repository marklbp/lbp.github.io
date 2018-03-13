module.exports = function(){

	this._res  = arguments[0];
	this._req  = arguments[1];
	
	this.test = function(){
		console.log('test is ok~!');
	}
}