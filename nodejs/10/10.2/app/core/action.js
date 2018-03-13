module.exports = function(){
	this._res;
	this._req;
	
	this.render = function(jade, param){
		this._res.render(VIEW + jade, param);
	}
	
	this.display = function(html){
		var readPath = VIEW +url.parse(html).pathname;
		var indexPage = fs.readFileSync(readPath);
		this._res.writeHead(200, { 'Content-Type': 'text/html' });
		this._res.end(indexPage);
	}
}