var SendMsg = require('./build/Release/sendmsg_eio.node');
var hi = new SendMsg.SendMsgEio();
hi.sendMsg(function(data){
  console.log(data);
});
 