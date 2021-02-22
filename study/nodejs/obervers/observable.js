/**
 *
 * @class Observable
 */
 
 module.exports = function(){
	var m_obserSet = [];
	var _self = this;
	
	this.addObser = function(observer){
		m_obserSet.push(observer);
	}
	
	this.removeObser = function(observer){
		if(m_obserSet[observer]){
			delete m_obserSet[observer];
		}
	}
	
	this.doAction = function(){
		console.log("Observable do some action");
		_self.notifyAllObser();
	}
	
	this.notifyAllObser = function(){
		for(var key in m_obserSet){
			m_obserSet[key].update();
		}
	}
 }