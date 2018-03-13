/**
 * Created by JetBrains WebStorm.
 * User: danhuang
 */
 // public parameter
 exports.name = 'danhuang';
 
 // private parameter
 var myName = 'idanhuang';

 exports.init =  function(itName){
	if(!itName){
		setName(myName);
	} else {
		setName(itName);
	}
 }
 
// public method
exports.show =  function(){
	console.log(name);
} 

// private method
function setName(myName){
	name = myName;
}
