module.exports = function(){
	var current = 'red';
	var _res  = arguments[0];
	var _req  = arguments[1];

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
		
		if(!onlineList[roomId]['type']){
			onlineList[roomId]['type'] = {};
		}
		
		var time = 0;
            io.sockets.on('connection', function (socket){
                var  username = sessionLib.username;
				if(!username){
					return;
				}
                if(!onlineList[roomId][username] ){
                    onlineList[roomId][username] = socket;
                }
                var refresh_online = function(){
                    var n = [];
					var athlete = '';
                    for (var i in onlineList[roomId]){
						if(i != 'type'){
							n.push(i);
						}
                    }
					switch(n.length){
						case 1 : athlete = 'red';
						break;
						case 2 : athlete = 'black';
						break;
						default : athlete = 'visitor';
						break;
					}
					if(n.length > 1){
						publicMsg(roomId, 'start', {'msg':'start game'})
					}
					console.log(athlete);
					onlineList[roomId]['type'][username] = athlete;
					onlineList[roomId][username] = socket;
					socket.emit('type', {'type' : athlete});
                }
				//确保每次发送一个socket消息
                if(time > 0){
                    return;
                }
				
                refresh_online();
                
				socket.on('msg', function(data){
					data['ret'] = 0;
					data['next'] = current == 'red' ? 'black' : 'red';
					current = data['next'];
					publicMsg(roomId, 'msg', data)
                });
				
                socket.on('disconnect', function(){
                    delete onlineList[roomId][username];
					delete onlineList[roomId]['type'][username];
					publicMsg(roomId, 'game_over', {'msg':'user has left the room, you are win!'});
                    refresh_online();
                });
                time++;
            });
			var readPath = VIEW +lib.url.parse('index.html').pathname;
			var indexPage = lib.fs.readFileSync(readPath);
			_res.writeHead(200, { 'Content-Type': 'text/html' });
			_res.end(indexPage);
	}
	
	function publicMsg(roomId, type, msg){
		for (var i in onlineList[roomId]){
			if(i != 'type'){
				onlineList[roomId][i].emit(type, msg);
			}
        }
	}
}