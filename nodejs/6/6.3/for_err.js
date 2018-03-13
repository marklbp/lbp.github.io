var A = Array;
for(var i=0; i<A.length; i++){
	a = A[i];
	B(a, function(a){
		console.log(a);
	})
}