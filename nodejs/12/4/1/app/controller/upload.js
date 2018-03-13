module.exports = function(){
	var _res  = arguments[0];
	var _req  = arguments[1];
	
	this.uploadPage = function(){
		_res.render(VIEW + 'index.jade');
	};
	
	this.uploadAction = function(){
		var now = Date.parse(new Date())/1000;
		var form = new lib.formidable.IncomingForm(),
			fields = [],
			baseName = BASE_DIR + '/uploadFile/' + now;
			imageName = baseName + '.png',
			newName   = baseName + '_small' + '.png',
			pathName  = '/uploadFile/' + now + '_small' + '.png';
		form.on('field', function(field, value) {
			fields.push([field, value]);
        });
		form.parse(_req, function(error, fields, files) {
			var size = '' + fields.width + 'x' + fields.height
			lib.fs.renameSync(files.image.path, imageName);
			switch(fields.type){
				case 1: imageResize(fields.width, fields.height, imageName, newName);
				break;
				case 2: imageCrop(fields.width, fields.height, imageName, newName);
				default:
				imageResize(fields.width, fields.height, imageName, newName);
				break;
			}
		});
	};
	
	function imageResize(width, height, imagePath, newName){
		var imageJson = {
			'width'    : width,
			'height'   : height,
			'url'      : imagePath,
			'new_name' : newName
		};
		var jsonStr = JSON.stringify(imageJson);
		var client = lib.dgram.createSocket("udp4");
		var message = new Buffer(jsonStr);
		client.send(message, 0, message.length, 41234, "127.0.0.1", function(){
			client.on("message", function (msg, rinfo) {
				var retJson = JSON.parse(msg);
				if(retJson.code == 0){
					console.log(pathName);
					_res.render(VIEW + 'main.jade', {'url' : pathName, 'err':'ok'});
				} else {
					_res.render(VIEW + 'main.jade', {'url' : '', 'err':'error'});
				}
			})
		});
	}
	
	function imageCrop(width, height, imagePath, newName){
		var imageJson = {
				'width'    : width,
				'height'   : height,
				'url'      : imagePath,
				'new_name' : newName
		};
		var jsonStr = JSON.stringify(imageJson);
		var client = lib.dgram.createSocket("udp4");
		var message = new Buffer(jsonStr);
		client.send(message, 0, message.length, 41234, "127.0.0.1", function(){
			client.on("crop", function (msg, rinfo) {
				var retJson = JSON.parse(msg);
				if(retJson.code == 0){
					console.log(pathName);
					_res.render(VIEW + 'main.jade', {'url' : pathName, 'err':'ok'});
				} else {
					_res.render(VIEW + 'main.jade', {'url' : '', 'err':'error'});
				}
			})
		});
	}
}