define(function(require,exports,module){
	var a=require.async("./a",function(a){
		console.log(a);
	});
	console.log(a);
	return {
			show:function(n){
				a.show(n);
			}
		}
})