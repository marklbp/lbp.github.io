var Hello = require('./build/Release/helloworld_eio.node');
var hi = new Hello.HelloWorldEio();
hi.hello(function(data){
  console.log(data);
});
