1.js对象封装和继承

a.拷贝继承
function A(name,age){
  this.name=name;
  this.age=age;
}
A.prototype.show=function(){
   alert(this.name)
}
function B(job){
  this.job=job;
}

for(var att in A.prototype){
  if(!B.protype[att]){
      B.prototype[att]=A.prototype[att]
  }
}
var b=new B('teacher');
b.show();

b.类式继承
function A(name,age){
  this.name=name;
  this.age=age;
}
A.prototype.show=function(){
   alert(this.name)
}
function B(job){
  A.call(this,'Tom',11)
  this.job=job;
}
B.prototype=new A('Jim',10);
var b=new B('teacher');
b.show();

c.原型继承
function inheritPrototype(proto){
  var F=function(){};
  F.prototype=proto;
  return new F();
}
function A(name,age){
  this.name=name;
  this.age=age;
}
A.prototype.show=function(){
   alert(this.name)
}
function B(job){
  A.call(this,'Tom',11)
  this.job=job;
}
B.prototype=inheritPrototype(A.prototype);
var b=new B('teacher');
b.show();

2.dom Ready (DOMContentLoaded)和 window.onload
浏览器渲染引擎的html解析流程

a.解析html标签
b.构建dom树
c.构建render树     -----------------------------> DOMContentLoaded
d.解析样式信息     -----------------------------> window.onload
e.布局render树
f.确定dom元素的大小位置信息
g.绘制render树
h.渲染到页面


3.原生ajax编写
var xhr=(function(){
	   var req;
           try{
              req=new XMLHttpRequest();
           }catch(ex){
	      try{
                 req=new ActiveXObject('Microsoft.XMLHTTP');
              }catch(ex){
		 try{
                    req=new ActiveXObject('MSXML2.XMLHTTP')
                 }catch(ex){
		    req=false;
                 }
              }
           }	
	   return req;
        })();

    xhr.onreadystatechange=function(){
       if(xhr.readyState==4&&xhr.status==200){
	   //成功回调
           //解析 xhr.responseText / xhr.responseXML
       }else{
           //错误回调
       }
    }

    xhr.open('GET/POST',url,true/false);

    xhr.setRequestHeader(header,value)    

    xhr.send(string)