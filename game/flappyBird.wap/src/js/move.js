/*
 * getByClass getStyle 绝对定位居中 时间运动 事件绑定bindEvent 转数组toArray 
 * hebin
 * 2014-2-20
 * description : 
 */
 
function positionCenter(parent,children){
	for( i in children){
		children[i].style.left = (parent.offsetWidth - children[i].offsetWidth)/2 + 'px';
	}
}

function setCookie(key, value, t) {
	var oDate = new Date();
	oDate.setDate( oDate.getDate() + t );
	document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}
function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for (var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if ( key == arr2[0] ) {
			return arr2[1];
		}
	}
}
function delCookie(key) {
	setCookie(key, '', -1);
}

function bindEvent(obj,events,fn){
	if(obj.addEventListener){
		obj.addEventListener(events,function(ev){
			
			if( fn.call(obj,ev) == false ){  //-> false undefined
			
				ev.preventDefault();
				ev.cancelBubble = true;				
			
			} 
			
		},false);
	}
	else{
		obj.attachEvent('on'+events,function(){
			
			var ev = window.event;
			
			if( fn.call(obj,ev) == false ){
				ev.cancelBubble = true;	
				return false;
			}
			
		});
	}
}

function getByClass(oParent,sClass){
	var arr = [];
	var elem = oParent.getElementsByTagName('*');
	for(var i=0;i<elem.length;i++){
		if( elem[i].className == sClass ){
			arr.push( elem[i] );
		}
	}
	return arr;
}

function toArray(elem){
	var arr = [];
	for(var i=0;i<elem.length;i++){
		arr.push( elem[i] );
	}
	
	return arr;
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj,false)[attr];
	}
}

function Vquery(vArg){
	
	this.elements = []; //存储元素的集合
	
	switch( typeof vArg ){
		case 'function':
			//window.onload = vArg;
			bindEvent(window,'load',vArg);
		break;
		case 'string':
		
			switch( vArg.charAt(0) ){
				case '#':  //id
					
					//vArg : #div1
					this.elements.push( document.getElementById(vArg.substring(1)) );
					
				break;
				case '.':  //class
				
					//vArg : .box
					this.elements = getByClass( document , vArg.substring(1) );
				break;
				default:  //tag
				
					this.elements = toArray(document.getElementsByTagName(vArg));
				
				break;
			}
		
		break;
		case 'object':
		
			if( vArg.constructor == Array ){
				this.elements = vArg;
			}
			else{
				this.elements.push(vArg);
			}
		
		break;
	}
	
}

Vquery.prototype.html = function(str){
	
	if(str){  //设置
	
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML = str;
		}
	
	}
	else{  //获取
		return this.elements[0].innerHTML;
	}
	
	return this;
	
};

Vquery.prototype.click = function(fn){
	
	/*for(var i=0;i<this.elements.length;i++){
		bindEvent(this.elements[i],'click',fn);
	}*/
	
	this.on('click',fn);
	return this;
	
};

Vquery.prototype.on = function(events,fn){
	
	for(var i=0;i<this.elements.length;i++){
		bindEvent(this.elements[i],events,fn);
	}
	return this;
	
};

Vquery.prototype.show = function(events,fn){ //思考JQ是如何实现的 block inline
	
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';
	}
	return this;
};

Vquery.prototype.hide = function(events,fn){
	
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
};

Vquery.prototype.hover = function(fnOver , fnOut){
	
	this.on( 'mouseover' , fnOver );
	this.on( 'mouseout' , fnOut );
	return this;
};

Vquery.prototype.css = function(attr,value){
	
	if( arguments.length == 2 ){  //设置
	
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[attr] = value;
		}
	
	}
	else{  
	
		return getStyle(this.elements[0],attr);
	
	}
	return this;
};

//attr : getAttribute setAttribute

Vquery.prototype.attr = function(attr,value){
	
	if( arguments.length == 2 ){
		
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(attr,value);
		}
		
	}
	else{
		
		return this.elements[0].getAttribute(attr);
		
	}
	return this;
};

Vquery.prototype.eq = function(num){
	return $(this.elements[num]);
};

Vquery.prototype.index = function(){
	var elems = this.elements[0].parentNode.children;
	
	for(var i=0;i<elems.length;i++){
		if( elems[i] == this.elements[0] ){
			
			return i;
			
		}
	}
	
	return this;
	
};

Vquery.prototype.siblings = function(){
	var elems = this.elements[0].parentNode.children;
	var result = [];
	
	for(var i=0;i<elems.length;i++){
		if( elems[i] != this.elements[0] ){
			result.push( elems[i] );
		}
	}
	
	return $(result);
	
};

Vquery.prototype.find = function(sel){
	
	var result = [];
	
	if( sel.charAt(0) == '.' ){  //class
	
		for( var i=0;i<this.elements.length;i++ ){
		
			//this.elements[i] : ul
			
			//sel : .box
			
			result = result.concat(getByClass( this.elements[i] , sel.substring(1)));
			
		}
	
	
	}
	else{  //tag
	
		for( var i=0;i<this.elements.length;i++ ){
		
			//this.elements[i] : ul
			
			//sel : li
			
			result = result.concat( toArray(this.elements[i].getElementsByTagName(sel)) );
			
		}
	
	}
	
	return $(result);
	
};


function hq(vArg){
	return new Vquery(vArg);
}

hq.trim = function(){
	
};

hq.proxy = function(){
	
};

hq.inArray = function(){};

//$.type = function(){};


hq.extend = function(json){
	
	for(var attr in json){
		$[attr] = json[attr];
	}
	
};

hq.fn = {};

hq.fn.extend = function(json){
	
	for(var attr in json){
		Vquery.prototype[attr] = json[attr];
	}
	
};


function startMove(obj, json, t, fx, fn) {
	
	clearInterval(obj.iTimer);
	
	var iStartTime = +new Date();
	var initValue = {};
	var countValue = {};
	
	for (var attr in json) {
		if ( attr == 'opacity' ) {
			initValue[attr] = Math.round(css(obj, attr) * 100);
		} else {
			initValue[attr] = parseInt(css(obj, attr));
		}
		
		countValue[attr] = json[attr] - initValue[attr];
		
	}
	
	//console.log(countValue);
	
	obj.iTimer = setInterval(function() {
		
		for (var attr in json) {
			
			var time = +new Date() - iStartTime;
			var iScale = Math.min( 1, time / t );
			var currentTime = t * iScale;
			
			//Tween[fx] typeof function
			var value = Tween[fx]( currentTime, initValue[attr], countValue[attr], t);
			
			if ( attr == 'opacity' ) {
				obj.style.opacity = value / 100;
				obj.style.filter = 'alpha(opacity='+ value +')';
			} else {
				obj.style[attr] = value + 'px';
			}
			
			if (iScale == 1) {
				clearInterval(obj.iTimer);
				fn && fn.call(obj);
			}
			
		}
		
	}, 13);
	
}

function css(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}

var _st = window.setTimeout;
//fRef 是test函数,mDelay是时间
window.setTimeout = function(fRef, mDelay) { 
   if(typeof fRef == 'function'){  
       var argu = Array.prototype.slice.call(arguments,2); 
       var f = (
            function(){ 
                fRef.apply(null, argu); 
            });  
       return _st(f, mDelay); 
    } 
    return _st(fRef,mDelay);
}
