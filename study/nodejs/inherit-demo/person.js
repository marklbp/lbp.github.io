/**
 *
 * class for the person
 * param: name 
 * method: sleep, eat
 */
module.exports = function(){
	this.name = 'person';
	
	this.sleep = function(){
		console.log('sleep in the night');
	}
	
	this.eat = function(){
		console.log('eat food');
	}
} 