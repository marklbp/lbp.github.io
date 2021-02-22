module.exports = function(){

	var _res  = arguments[0];
	var _req  = arguments[1];
	
	this.checkSession = function(model){
		if(model == 'login'){
			return true;
		}else if(sessionLib.username && sessionLib.username != '') {
			return true;
		} 
		return false;
	}
	
	this.login = function(){
		var room = lib.config.get(CONF + 'room.json', '');
		lib.httpParam.POST('username', function(value){
            sessionLib.username = value;
            _res.render(VIEW + 'main.jade', {'user' : value, 'rooms' : room});
            var time = 0;
		});
        return;
	}

	this.enterRoom = function(){
		var roomId = lib.httpParam.GET('room_id');
		if(!onlineList[roomId]){
			onlineList[roomId] = [];
		}
		if(!onlineList['pic']){
			onlineList['pic'] = [];
		}

		var time = 0;
            io.sockets.on('connection', function (socket){
                var  username = sessionLib.username;
				if(!username){
					return;
				}
                if(!onlineList[roomId][username] ){
                    onlineList[roomId][username] = socket;
					onlineList['pic'][username] = {'pic':'picture' + parseInt(Math.random()*2+1) + '.png', 'name':username};
                }
                var refresh_online = function(){
                    var n = [];
					var p = [];
                    for (var i in onlineList[roomId]){
                        n.push(i);
						p.push(onlineList['pic'][i]);
                    }
                    io.sockets.emit('online_list', n);//所有人广播
					console.log(onlineList['pic']);
					io.sockets.emit('pic_list', p);//所有人广播
                }
                refresh_online();
                //确保每次发送一个socket消息
                if(time > 0){
                    return;
                }
                socket.on('public', function(data){
                    io.sockets.emit('msg', 'hi all');
                });
                socket.on('disconnect', function(){
                    delete onlineList[roomId][username];
                    refresh_online();
                });
                time++;
				console.log(onlineList);
            });
			_res.render(VIEW + 'live.jade',{'user':sessionLib.username});
	}
	
	this.say = function(){
		var username = sessionLib.username;
		var msg = lib.httpParam.GET('msg');
		var retJson = {};
		retJson['msg'] = msg;
		retJson['name'] = username;
		io.sockets.emit('say_msg', retJson);
	}
}