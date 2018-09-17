module.exports = function(res, req){
	var _res = res;
	var _req = req;
	this.show = function(){
		var str = 'success, you get show method';
		_res.writeHead(200, { 'Content-Type': 'text/html' });
		_res.end(str);
	}
}