var io = require('socket.io').listen(8080,{log:false});
io.sockets.on('connection', function (socket) {
  socket.on('msg', function (data) {
	console.log(data);
    if(data.state){
		if(data.state == 'success'){
			socket.emit('msg', { 'me': 'very good' });
		} else {
			socket.emit('msg', {other:"that is all"});
		}
	} else {
		socket.emit('msg', {other:"that is all"});
	}
  });
});