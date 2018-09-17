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
		lib.httpParam.POST('username', function(value){
            sessionLib.username = value;
            if(value == 'danhuang'){
                _res.render(VIEW + 'live.jade', {'user' : value});
            } else {
                _res.render(VIEW + 'main.jade', {'user' : value});
            }
            var time = 0;
            io.sockets.on('connection', function (socket){
                var  username = sessionLib.username;
                if(!onlineList[username] ){
                    onlineList[username] = socket;
                }
                var refresh_online = function(){
                    var n = [];
                    for (var i in onlineList){
                        n.push(i);
                    }
                    var message = lib.fs.readFileSync(BASE_DIR + '/live_data.txt', 'utf8');
                    socket.emit('live_data',message);
                    io.sockets.emit('online_list', n);//所有人广播
                }
                refresh_online();
                //确保每次发送一个socket消息
                if(time > 0){
                    return;
                }
                socket.on('public', function(data){
                    var insertMsg = "<li><span  class='icon-user'></span><span class='live_user_name text-success'>[danhuang]</span><span class='live_message text-info'>" + data.msg + "</span></li>"
                    writeFile({'msg':insertMsg, 'data':data}, function(data){
                        io.sockets.emit('msg', data);
                    });
                });
                socket.on('disconnect', function(){
                    delete onlineList[username];
                    refresh_online();
                });
                time++;
            });
		});
        return;
	}
    function writeFile(data, callback){
        var message = lib.fs.readFileSync(BASE_DIR + '/live_data.txt', 'utf8');
        lib.fs.writeFile(BASE_DIR + '/live_data.txt',message+data.msg, function(err){
            if (err) throw err;
            callback(data.data);
        });
    }

}