var clickList = new Array(2);
var i = 0;
var crontab;
var preElement;
var type;
var next = 'red';

var socket = io.connect('http://127.0.0.1:1337');

socket.on('msg', function (data) {
	var ret = data['ret'];
	var current = data['next'];
	var clickList = data['click_list'];
	var value = data['value'];
	var clickListStact = new Array(2);
	if(ret == 0){
		for(var key in clickList){
			var x = clickList[key]['x'];
			var y = clickList[key]['y'];
			var location = new Location();
			location.setX(x);
			location.setY(y);
			clickListStact[key] = location;
		}
		moveTo(clickListStact, value);
		changeStyle();
		winGame();
	}
	next = current;
	$('msg_info').innerHTML = 'you are ' + type +'<br/>next is ' + current;
});

socket.on('type', function (data) {
	type = data['type'];
})

socket.on('game_over', function (data) {
	alert(data.msg);
})

socket.on('start', function (data) {
	$('msg_info').innerHTML = 'game start';
})

function changeClass(value){
	if(type != next){
		return;
	}
	var x = changeStringToNum(value[0]);
	var y = changeStringToNum(value[1]);
	var location = new Location();
	location.setX(x);
	location.setY(y);
	if(location.locationBlank() != -1){
		//play_click('/static/image/button.wav');
	}
	if($(value) != ''){
		if(preElement){preElement.style.opacity = '';}
		clearInterval(crontab);
		crontab = setInterval(function(){
			var elemet = document.getElementById(value);
			elemet.style.opacity = parseInt(Math.random()*10+1)/10;
			preElement = elemet;
		}, 200);
	}
	
	if(i<2){
		clickList[i] = location;
		/*
		if(location.locationBlank() != -1){
			clickList[0] = location;
		}
		else {
			clickList[1] = location;
		}
		*/
	}
	else{
		clickList[0] = location;
		clickList[1] = "";
		i=0;
	}
	if(clickList[0].locationBlank() != -1){
		i++;
	}
	var side = checkWhichSide($(clickList[0].getId()).value);
	switch(type){
		case 'red' : if(side == 1){clearInterval(crontab);return;};
		break;
		case 'black' : if(side == 2){clearInterval(crontab);return;};
		break;
		default: clearInterval(crontab);return;
		break;
	}
	var clickListStact = new Array(2);
	clickListStact = clickList;
	moveTo(clickList, value);
	changeStyle();
	winGame();

}
function winGame(){
	var location = new Location();
	var count = 0;
	for(var i=0; i<10; i++){
		for(var j=0; j<9; j++){
			location.setX(i);
			location.setY(j);
			if(checkWhatIt($(location.getId()).value)==5){
				count++;
				winner = checkWhichSide($(location.getId()).value);
			}
		}
	}
	if(count<2){
		if(winner == 1){
			alert("黑方获胜！");
		}
		else
			alert("红方获胜！");
	}
}

function PcMove(clickListStact){
}

 function play_click(url){  
    var div = $('music');  
     div.innerHTML = '<embed src="'+url+'" loop="0" autostart="true" hidden="true"></embed>';  
     var emb = document.getElementsByTagName('EMBED')[0];  
     if (emb) {  
        setTimeout(function(){div.innerHTML='';},1000);  
    }  
} 
function moveTo(clickList, value){
	if((clickList[0].locationBlank() != -1)&&(clickList[1].locationBlank() != -1))
	{
		var firstValue = $(clickList[0].getId()).value;
		var secondValue = $(clickList[1].getId()).value;
		if(checkItCanMove(clickList) && (checkWhichSide(firstValue) != checkWhichSide(secondValue))){
			$(clickList[0].getId()).value = "";
			$(clickList[1].getId()).value = firstValue;
			socket.emit('msg', {'click_list':clickList, 'value':value, 'type':type});
		}
	}
	if((clickList[0] != "") && (clickList[1] != "")){
		var firstValue = $(clickList[0].getId()).value;
		var secondValue = $(clickList[1].getId()).value;
		if(!secondValue && checkItCanMove(clickList)){
			$(clickList[1].getId()).value = firstValue;
			$(clickList[0].getId()).value = secondValue;
			socket.emit('msg', {'click_list':clickList, 'value':value, 'type':type});
		}
	}
	clearInterval(crontab);
}
function checkWhatIt(string){
	if(string == "")
		return -1;
	else if(string == "車" || string == "车")
		return 1;
	else if(string == "马" || string == "馬")
		return 2;
	else if(string == "象" || string == "相")
		return 3;
	else if(string == "士" || string == "仕")
		return 4;
	else if(string == "将" || string == "將")
		return 5;
	else if(string == "炮" || string == "包")
		return 6;
	else if(string == "兵" || string == "卒")
		return 7;
}
function checkWhichSide(string){
	if(string == "車"||string == "马" ||string == "象"||string == "士"||string == "将"||string == "炮" ||string == "兵" )
		return 1;
	if(string == "车"||string == "馬" ||string == "相"||string == "仕"||string == "將"||string == "包" ||string == "卒" )
		return 2;
}
function checkItCanMove(clickList){
	var pieceType = checkWhatIt($(clickList[0].getId()).value);
	var location = new Location();
	if(pieceType == 1)
	{
		var number=0;
		if((clickList[0].getX() == clickList[1].getX()) ||( clickList[0].getY() == clickList[1].getY())){
			if(clickList[0].getX() == clickList[1].getX()){
				if(clickList[0].getY()<clickList[1].getY()){
					for(var m=clickList[0].getY()+1; m<clickList[1].getY();m++){
						var betweenLocation = new Location();
						betweenLocation.setX(clickList[0].getX());
						betweenLocation.setY(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
				if(clickList[0].getY()>clickList[1].getY()){
					for(var m=clickList[1].getY()+1; m<clickList[0].getY();m++){
						var betweenLocation = new Location();
						betweenLocation.setX(clickList[0].getX());
						betweenLocation.setY(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
			}
			if(clickList[0].getY() == clickList[1].getY()){
				if(clickList[0].getX()<clickList[1].getX()){
					for(var m=clickList[0].getX()+1; m<clickList[1].getX();m++){
						var betweenLocation = new Location();
						betweenLocation.setY(clickList[0].getY());
						betweenLocation.setX(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
				if(clickList[0].getX()>clickList[1].getX()){
					for(var m=clickList[1].getX()+1; m<clickList[0].getX();m++){
						var betweenLocation = new Location();
						betweenLocation.setY(clickList[0].getY());
						betweenLocation.setX(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
			}
			if(number<1){
				return true;
			}
		}
	}
	if(pieceType == 2)
	{
		if(((clickList[0].getX()+1 == clickList[1].getX()) &&((clickList[0].getY()+2 == clickList[1].getY())||(clickList[0].getY()-2 == clickList[1].getY())))||((clickList[0].getX()-1 == clickList[1].getX() )&&( (clickList[0].getY()+2 == clickList[1].getY())||(clickList[0].getY()-2 == clickList[1].getY())))){
				location.setX(clickList[0].getX());
				location.setY((clickList[0].getY()+clickList[1].getY())/2);
				if(location.locationBlank() == -1){
					return true;
				}
		}
		if(((clickList[0].getX()+2 == clickList[1].getX()) &&( (clickList[0].getY()+1 == clickList[1].getY())||(clickList[0].getY()-1 == clickList[1].getY())))||((clickList[0].getX()-2 == clickList[1].getX()) &&( (clickList[0].getY()+1 == clickList[1].getY())||(clickList[0].getY()-1 == clickList[1].getY())))){
				location.setX((clickList[0].getX()+clickList[1].getX())/2);
				location.setY(clickList[0].getY());
				if(location.locationBlank() == -1){
					return true;
				}
		}
	}
	if(pieceType == 3)
	{
		if((clickList[0].getX()+2 == clickList[1].getX() && ((clickList[0].getY()+2 == clickList[1].getY())||(clickList[0].getY()-2 == clickList[1].getY())))||(clickList[0].getX()-2 == clickList[1].getX() && ((clickList[0].getY()-2 == clickList[1].getY())||(clickList[0].getY()+2 == clickList[1].getY())))){
				location.setX((clickList[0].getX()+clickList[1].getX())/2);
				location.setY((clickList[0].getY()+clickList[1].getY())/2);
				if(location.locationBlank() == -1){
					if(clickList[0].getX()<5 && clickList[1].getX()<5)
						return true;
					else if(clickList[0].getX()>4 && clickList[1].getX()>4)
						return true;
					}
				else
					return false;
			}
	}
	if(pieceType == 4)
	{
		if((clickList[0].getX()+1 == clickList[1].getX() && ((clickList[0].getY()+1 == clickList[1].getY())||(clickList[0].getY()-1 == clickList[1].getY())))||(clickList[0].getX()-1 == clickList[1].getX() && ((clickList[0].getY()-1== clickList[1].getY())||(clickList[0].getY()+1 == clickList[1].getY())))){
				if((clickList[1].getY()<6)&&(clickList[1].getY()>2)&&(clickList[1].getX()<3))
					return true;
				else if((clickList[1].getY()<6)&&(clickList[1].getY()>2)&&(clickList[1].getX()>6))
					return true;
			}
	}
	if(pieceType == 5)
	{
		if(((clickList[0].getX()+1 == clickList[1].getX()) && (clickList[0].getY() == clickList[1].getY()))||((clickList[0].getX()-1 == clickList[1].getX()) && (clickList[0].getY()== clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()-1 == clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()+1 == clickList[1].getY()))){
				if((clickList[1].getY()<6)&&(clickList[1].getY()>2)&&(clickList[1].getX()<3))
					return true;
				else if((clickList[1].getY()<6)&&(clickList[1].getY()>2)&&(clickList[1].getX()>6))
					return true;
			}
	}
	if(pieceType == 6)
	{
		var number=0;
		if((clickList[0].getX() == clickList[1].getX()) ||( clickList[0].getY() == clickList[1].getY())){
			if(clickList[0].getX() == clickList[1].getX()){
				if(clickList[0].getY()<clickList[1].getY()){
					for(var m=clickList[0].getY()+1; m<clickList[1].getY();m++){
						var betweenLocation = new Location();
						betweenLocation.setX(clickList[0].getX());
						betweenLocation.setY(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
				if(clickList[0].getY()>clickList[1].getY()){
					for(var m=clickList[1].getY()+1; m<clickList[0].getY();m++){
						var betweenLocation = new Location();
						betweenLocation.setX(clickList[0].getX());
						betweenLocation.setY(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
			}
			if(clickList[0].getY() == clickList[1].getY()){
				if(clickList[0].getX()<clickList[1].getX()){
					for(var m=clickList[0].getX()+1; m<clickList[1].getX();m++){
						var betweenLocation = new Location();
						betweenLocation.setY(clickList[0].getY());
						betweenLocation.setX(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
				if(clickList[0].getX()>clickList[1].getX()){
					for(var m=clickList[1].getX()+1; m<clickList[0].getX();m++){
						var betweenLocation = new Location();
						betweenLocation.setY(clickList[0].getY());
						betweenLocation.setX(m);
						if(betweenLocation.locationBlank() != -1)
							number++;
					}
				}
			}
			if(number==0 && clickList[1].locationBlank() == -1){
				return true;
			}
			if(number==1 && clickList[0].locationBlank() != -1 && clickList[1].locationBlank() != -1){
				return true;
			}
		}
	}
	if(pieceType == 7)
	{
		if(checkWhichSide($(clickList[0].getId()).value) ==1){
			if(clickList[0].getX()>4){
				if(((clickList[0].getX()+1 == clickList[1].getX()) && (clickList[0].getY() == clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()-1 == clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()+1 == clickList[1].getY())))
					return true;
			}
			else{
				if((clickList[0].getX()+1 == clickList[1].getX()) && (clickList[0].getY() == clickList[1].getY()))
					return true;			
			}
		}
		if(checkWhichSide($(clickList[0].getId()).value) ==2){
			
			if(clickList[0].getX()<5){
				if(((clickList[0].getX()-1 == clickList[1].getX()) && (clickList[0].getY() == clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()-1 == clickList[1].getY()))||((clickList[0].getX()== clickList[1].getX()) && (clickList[0].getY()+1 == clickList[1].getY())))
					return true;
			}
			else{
				if((clickList[0].getX()-1 == clickList[1].getX()) && (clickList[0].getY() == clickList[1].getY()))
					return true;			
			}
		}
	}
	return false;
}
function changeStringToNum(string){
	var ascii =string.charCodeAt();
	return (ascii - 97);
}
function changeNumToString(number1,number2){
	var string = String.fromCharCode(number1+97,number2+97) ;
	return string;
}
function Location() {
	this.x = -1;
	this.y = -1;
}
Location.prototype.getX = function(){
	return this.x;
}
Location.prototype.getY = function(){
	return this.y;
}
Location.prototype.setX = function(x){
	this.x = x;
}
Location.prototype.setY = function(y){
	this.y = y;
}
Location.prototype.getId = function(){
	var id = changeNumToString(this.x,this.y);
	return id;
}
Location.prototype.locationBlank = function(){
	var id = changeNumToString(this.x,this.y);
	if($(id).value == '')
		return -1;
	else
		return $(id).value;	
}
function bindUI(){
	changeStyle();
}


function changeStyle(){
	var location = new Location();
	for(var i=0; i<10; i++){
		for(var j=0; j<9; j++){
			location.setX(i);
			location.setY(j);
			if(location.locationBlank() != -1){
				if(checkWhichSide(($(location.getId()).value)) == 2){
					$(location.getId()).className = 'red_piece';
				}
				else
					$(location.getId()).className = 'piece';
			}
			else{
				$(location.getId()).className = 'button';
			}
		}
	}
}


document.observe('dom:loaded', bindUI);




