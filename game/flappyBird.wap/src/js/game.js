+function(global,context,factory){
	var game = factory();
	game.load();

	return $.extend(true,context,{
		options : {
			isNeedPass : 1,
			isNeedSMS : 0,
			isPlay : 1, 
			username : null,
			rememberPassword : 0,
			subId : null,
			public : null,
			raffleCount : 0 //每天参与消耗红包数
		},
		init : function(){},
		isNeedPassSMS : function(callback){
			this.ajax($.extend(true,{},this.request.isNeedPassSMS,{
				done : function(data){
					$.extend(true,this.options,{
						isNeedPass : data.isNeedPass,
						isNeedSMS : data.isNeedSMS,
						isPlay : data.isPlay,
						raffleCount : data.raffleCount
					})
					this.play(callback);
				},
				fail : function(data){
					if(data.code !== undefined && data.code == 1){
						return this.playTip(data.value);
					}
					return this.modal.tip("登录超时，重新登录中...",{
						time : 800,
						callback : function(){
							Marklbp.isLogin = false;
							Marklbp.addLoginCallback("_init")
						}
					},true);
				}
			}))
		},
		_init : function(callback){
			this.isNeedPassSMS(callback||this._init.callback)
		},
		playTip : function(text){
			return this.modal.tip(text,1200,true);
			this.modalAlign(this.modal.dialog({
				message : "<div class='text'>"+text+"</div>\
						<div class='row'>\
							<div class='col-xs-6'>\
								<span class='btn' onclick='$(this).parents(\".modal\").find(\".close\").trigger(\"click\");'>取消</span>\
							</div>\
							<div class='col-xs-6'>\
								<span class='btn' onclick=''>去开通</span>\
							</div>\
						</div>"
			}).find(".modal-dialog").width("75%"))
		},
		play : function(callback){
			if(!this.options.isPlay)return this.playTip();
			return this.ajax($.extend(true,{},this.request.play,{
				done : function(data){
					this.options.username = data.username;
					this.options.subId = data.subId;
					this.options.public = data.public;
					'function' == typeof callback && callback({success:true});
					this.gameStart(callback);
				},
				fail : function(data){
					if(data.code !== undefined && data.code == 1){
						return this.playTip(data.value);
					}					
					this.modal.tip("登录超时，重新登录中...",{
						time : 800,
						callback : function(){
							Marklbp.isLogin = false;
							Marklbp.addLoginCallback("init")
						}
					},true);
				}
			}))
		},
		gameStart : function(callback){
			'function' == typeof callback && callback();
		},
		gameOver : function(score,callback){
          	var encrypt = new JSEncrypt();
          	encrypt.setPublicKey(this.options.public);
          	var encrypted = encrypt.encrypt(score+this.options.username);
			return this.ajax($.extend(true,{},this.request.sendScore,{
				param : {
					encryScore : encrypted,
					subId : this.options.subId
				},
				done : function(data){
					'function' == typeof callback && callback(data.maxScore)
				},
				fail : function(data){
					'function' == typeof callback && callback()
				}
			}))
		}

	})[context.debug ? "init" : "checkLogin"]();

}(window,Marklbp,function(){
	return {
		/* *
		 * load : 资源加载
		 * params : null
		 * return 
		 *      game 
		 * */
		load : function(){
			var that = this;
			this.elements = {};
			$.extend(this.elements,{
				bird  		  : $("#bird")[0],
				world 		  : $("#wrap")[0],
				score 		  : $("#score1")[0],
				gameTitle 	  : $("#game_tit")[0],
				gameOverTitle : $("#game_over")[0],
				ground        : $("#ground")[0],
				scoreBoard 	  : $("#score_box")[0],
				curScore      : $("#curr_score")[0],
				bestScore     : $("#best_score")[0],
				instruction   : $("#tap_start")[0],
				pipeBox 	  : $("#pipe_box")[0],
				btnStart 	  : $("#btn_start")[0],
				btnRestart    : $("#btn_restart")[0],
				flyAudio      : $("#fly_audio")[0],
				crashAudio    : $("#crash_audio")[0],
				startAudio    : $("#start_audio")[0],
				goldAudio     : $("#gold_audio")[0] 
			})

			$(this.elements.btnStart)
				.off()
				.on("click",function(){
					Marklbp.addLoginCallback("_init",$.proxy(function(){
						$(that.elements.btnStart).hide();
						that.tip();
					},this));
					
					return false
			})

			$(this.elements.btnRestart)
				.off()
				.on("click",function(){
					Marklbp.addLoginCallback("_init",$.proxy(function(){
						that.init(false);
						that.tip();
					},that));
				return false
			})

			this.init();
			return this;
		},

		/* *
		 * init ： 初始化 实现元素的居中，数值初始化。调用背景移动、鸟晃动、随机高度柱子生成。
		 * params : true->停止游戏标题动画 false->开启游戏标题动画
		 *		(stop)
		 * return 
		 *      game
		 * */
		init : function(stop){

			$.extend($(this.elements.bird).css({
				backgroundImage : 'url(img/bird.gif)',
				top : '240px'
			})[0],{
				timer : null,
				//isStart : true -> 没开始 false-> 开始
				isStart : true,
				isAlive : true,
				isAcross : true,
				iCurr : 0,
				maxTop : this.elements.world.offsetHeight - this.elements.bird.offsetHeight
			})

			$(this.elements.pipeBox).css('left',this.elements.world.offsetWidth);
			this.elements.world.maxHeight = this.elements.world.offsetHeight
			$(this.elements.score).html(0)

			$(this.elements.btnRestart).hide().css('opacity',0)

			$(this.elements.gameOverTitle).css({
				opacity : 0,
				top : 120
			})

			$(this.elements.scoreBoard).css('top',this.elements.world.parentNode.offsetHeight)
			
			//启动游戏标题动画
			this.titleAnimation(stop);
			//启动游戏背景动画
			this.backgroundAnimation(false,this.elements.world,.5);
			//启动游戏道路动画
			this.backgroundAnimation(false,this.elements.ground,2.5);
			//生成管道
			this.makePipe();
			return this;
		},
		//游戏说明
		tip : function() {
			//显示说明
			$(this.elements.instruction).animate({opacity:1},300);
			//显示计分
			$(this.elements.score).show().animate({opacity:1},300);
			//停止游戏标题动画
			this.titleAnimation(true);
			//停止游戏背景动画
			this.backgroundAnimation(true,this.elements.world);
			//停止游戏道路动画
			this.backgroundAnimation(true,this.elements.ground);
			//播放启动音效
			this.playStart();
			//注册游玩事件
			this.bindPlay();
			return this;
		},
		//播放开始音效
		playStart : function() {
			this.elements.startAudio.play();
			return this;
		},
		/*
		 * bindPlay : 注册游戏启动事件
		 * params : null
		 * return 
		 *		game
		*/
		//注册玩事件
		bindPlay : function(){
			var that = this;
			this.playEventType = "ontouchend" in document ? "touchend" : "mousedown"
			$(document).on(this.playEventType,function(){
				var bird = that.elements.bird
				if(bird.isStart && bird.isAlive){
					//没开始 鸟活着
					that.start();
					that.elements.flyAudio.play();
				}else if(!bird.isStart && bird.isAlive){
					//开始了 鸟活着
					that.fly();
					that.elements.flyAudio.currentTime = 0;
					that.elements.flyAudio.play();
				}else if(bird.isStart &&!bird.isAlive){
					//没开始了 鸟死了
				}else{
					//没开始 鸟死了
				}
				return false
			})
			return this;
		},
		/*
		 * titleAnimation : 标题上下跳动动画
		 * params :
		 *		(boolean) stop : 是否停止动画 true -> 停 , false -> 开
		 * return
		 *		game
		*/
		titleAnimation : function(stop){
			var gameTitle = $(this.elements.gameTitle);
			var bird      = $(this.elements.bird);
			var speed     = 0;
			if(stop){
				if(gameTitle[0].timer)clearInterval(gameTitle[0].timer);
				bird.css('left',85);
				gameTitle.hide();
				return this;
			}
			gameTitle.show();
			gameTitle[0].timer = setInterval(function(){
				var offsetTop = gameTitle[0].offsetTop;
				if(offsetTop < 233 ){
					speed += (233 - offsetTop)/18;
				}
				else{
					speed -= (offsetTop - 233)/18;
				}
				bird.css("top",bird[0].offsetTop + speed);
				gameTitle.css("top",offsetTop + speed)
			},30);
			return this;
		},
		/*
		 * backgroundAnimation : 游戏背景左右滚动动画
		 * params :
		 *		(boolean) stop : 是否停止动画 true -> 停 , false -> 开
		 *      (Element) element
		 *      (number) speed : 递减速度
		 * return
		 *		game
		*/
		backgroundAnimation : function(stop,element,speed){
			element.speed               = speed || element.speed;
			element.backgroundPositionX = element.backgroundPositionX || 0;
			if(stop){
				if(element.timer)clearInterval(element.timer);
				return this;
			}
			element.timer = setInterval(function(){
				if(element.backgroundPositionX <= - element.offsetWidth ){
					element.backgroundPositionX = 0;
				}
				element.backgroundPositionX -= element.speed;
				$(element).css('backgroundPosition',element.backgroundPositionX + 'px 0');
			},30);
			return this;
		},
		/* *
		 * start ：开始前，按下空格，延迟调用鸟跳跃，调用柱子移动
		 * params :
		 *		(object) 鸟
		 * return
		 *		void
		 * */
		start : function(){
			$(this.elements.instruction).animate({opacity:0},300)
			this.elements.bird.isStart = false;
			this.backgroundAnimation(false,this.elements.world);
			this.backgroundAnimation(false,this.elements.ground);
			this.fly();
			setTimeout($.proxy(this.pipeAnimation,this),2000);
			//播放飞翔音乐
			this.elements.flyAudio.play();
			return this;
		}
		,
		/* *
		 * fly ：调用时跳跃。判断触底，触底鸟死亡。
		 * params : null
		 * return
		 *		game
		 * */
		fly : function(){
			var that       = this;
			var bird 	   = this.elements.bird;
			var crashAudio = this.elements.crashAudio;
			var speed 	   = -25;
			var x          = 3
			if(bird.timer)clearInterval(bird.timer);
			if(bird.isAlive){
				bird.timer = setInterval(function(){
					speed += x;
					x*=1.05;
					var T = bird.offsetTop + speed;

					if(T < bird.maxTop + 4){
						speed *= 0.75;
					}else if( T < 0 ){ 
						//无法进去
						T = 0;
					}else{
						T = bird.maxTop + 4;
						crashAudio.play();
						$(bird).css('backgroundImage','url(img/bird.png)');
						that.gameover();
					}
					$(bird).css('top' , T);
					that.crash();
					that.count();
				},45);
			}
			return this;
		},

		/* *
		 * makePipe ：生成柱子，计算父级高度，随机高度，高度间隔为130
		 * params : null
		 * return
		 *		game
		 * */
		makePipe : function(){
			var world   = this.elements.world;
			var pipeBox = this.elements.pipeBox;
			var pipes   = pipeBox.getElementsByTagName('li');
			var xHeight = 0;
			//130为上下柱子间隔
			var vertical  = 200;
			//142为柱子水平间距
			var horizontal = 200;
			var pipeHeadHeight = 35;
			//40柱子最小高度
			var pipeMinHeight = 40;
			var _pipes;
			$(pipeBox).width((pipes[0].offsetWidth + horizontal) * pipes.length);
			for(var i = 0; i < pipes.length; i++){
				xHeight = Math.round(Math.random()*(world.maxHeight - vertical - pipeMinHeight*2));
				$(pipes[i]).css('left', i * (pipes[0].offsetWidth + horizontal));
				_pipes  = pipes[i].children;
				_pipes[0].style.height = xHeight + pipeHeadHeight + 'px';
				_pipes[1].style.height = world.maxHeight - vertical - pipeMinHeight*2 - xHeight + pipeMinHeight + 'px';
			}
			return this;
		},
		/* *
		 * pipeAnimation ：柱子开始移动
		 * params :
		 *		(boolean) stop -> true 停止动画
		 * return
		 *		game
		 * */
		pipeAnimation : function(stop){
			var pipeBox = this.elements.pipeBox;
			if(stop){
				if(pipeBox.timer)clearInterval(pipeBox.timer)
				return this;
			}
			var bird    = this.elements.bird;
			var pipes 	= pipeBox.getElementsByTagName('li');
			var speed   = 5;
			var horizontal = 200;
			if(bird.isAlive){
				pipeBox.timer = setInterval(function(){
					$(pipeBox).css('left',pipeBox.offsetLeft - speed);
					//当管道盒子距左距离 小于 第一个管道的宽 + 水平间距 时 将第一个管道追加到盒子末尾
					if( pipeBox.offsetLeft < -(pipes[0].offsetWidth + horizontal) ){
						pipeBox.appendChild(pipeBox.children[0]);
						for(var i = 0; i < pipes.length; i++){
							pipes[i].style.left = i*(pipes[0].offsetWidth + horizontal) + 'px';
						}
						$(pipeBox).css('left', pipes[0].offsetWidth + horizontal + pipeBox.offsetLeft);
					}
				},30)
			}
			return this;
		},
		/* *
		 * crash ：鸟跟柱子的碰撞检测，碰撞后执行 game.fall()结束游戏 ，未碰撞count() 统计
		 * params :
		 *		(object) 鸟
		 * return
		 *		game
		 * */
		crash : function(){
			var bird       = this.elements.bird;
			var pipeBox    = this.elements.pipeBox;
			var pipes      = pipeBox.getElementsByTagName('li');
			var goldAudio  = this.elements.goldAudio;
			var crashAudio = this.elements.crashAudio;
			var horizontal = 200;
			var iWidth 	   = pipes[0].offsetWidth + horizontal + pipeBox.offsetLeft;

			var T1 = bird.offsetTop;
			var B1 = bird.offsetTop  + bird.offsetHeight - 2;
			var R1 = bird.offsetLeft + bird.offsetWidth - 1;
			var L1 = bird.offsetLeft + 2;
			//
			var L2 = 0;
			var B2 = 0;
			var T2 = 0;
			var R2 = 0;

			if(bird.iCurr > 0){   
				//确定检测的值
				L2 = pipes[1].offsetLeft + pipeBox.offsetLeft + 20;
				B2 = pipes[1].children[0].offsetHeight;
				T2 = pipes[1].children[1].offsetTop + 20;
			}else{
				L2 = pipeBox.offsetLeft + 20;
				B2 = pipes[0].children[0].offsetHeight;
				T2 = pipes[0].children[1].offsetTop + 20;
			}
			R2 = L2 + pipes[0].offsetWidth - 20;
			var x = L1 - R2; //((aLi[0].offsetWidth)*2+142-Math.abs(oPipeBox.offsetLeft))
			if(L1>R2&&iWidth>L1&&bird.isAcross&&bird.iCurr==0){
				bird.iCurr = 1;
				bird.isAcross = false;
				goldAudio.play();
			}
			if(L1>L2&&L1<R2){
				bird.isAcross = true;
			}
			if(L1>R2&&bird.iCurr>0&&bird.isAcross){
				bird.iCurr++
				bird.isAcross = false;
				goldAudio.play();

			}
			//document.title = obj.iCurr;
			//console.log(L1+':'+R2+':'+iWidth+':'+obj.isAcross+':'+obj.iCurr+':'+aLi[0].n);
			if((R1>L2&&T1<B2)||(B1>T2&&R1>L2)){
				$(bird).css('backgroundImage','url(img/bird.png)');
				this.elements.crashAudio.play();
				this.fall();
			}
			return this;
		},
		/* *
		 * count ： 通过 iCurr 统计分数
		 * params : null
		 * return
		 *		void
		 * */
		count : function(){
			this.elements.score.innerHTML = this.elements.bird.iCurr;
		},
		/* *
		 * fall : 碰到柱子 无法跳跃 开始坠落
		 * params : null
		 * return
		 *		game
		 * */
		fall : function(){
			var that = this;
			this.elements.bird.src = 'img/brid.png';
			this.gameover();
			this.elements.bird.timer = function(){
				$(that.elements.bird).animate({
					top : that.elements.bird.maxTop+4
				},400)
			}
			setTimeout(this.elements.bird.timer,300)
			return this;
		}
		,
		/* *
		 * gameover : 鸟死亡， 游戏结束 清除定时器。显示相应布局
		 * params : 
		 * return
		 *		game
		 * */
		gameover : function(){ 
			//游戏结束 显示信息
			var that = this;
			$(document).off();
			this.backgroundAnimation(true,this.elements.world);
			this.backgroundAnimation(true,this.elements.ground);
			this.pipeAnimation(true);
			this.showScore();
		},
		showScore : function(){
			var bird     = this.elements.bird;
			bird.src 	 = 'img/brid.png';
			bird.isAlive = false;
			bird.isStart = true;
			this.elements.curScore.innerHTML = 0;
			if(bird.timer)clearInterval(bird.timer);

			Marklbp.gameOver(bird.iCurr,$.proxy(function(maxScore){
				$(this.elements.score).fadeOut();
				var N 			  = 0;
				var that          = this;
				var bird          = this.elements.bird;
				var gameOverTitle = this.elements.gameOverTitle;
				var scoreBoard    = this.elements.scoreBoard;
				var curScore      = this.elements.curScore;
				var bestScore     = this.elements.bestScore;
				var startAudio    = this.elements.startAudio;

				bestScore.innerHTML = maxScore;

				setTimeout(function(){
					$(gameOverTitle).animate({
						opacity : 1,
						top : gameOverTitle.offsetTop+20
					},400)
				},200);

				setTimeout(function(){
					$(scoreBoard).animate({top : 225},300,function(){
						startAudio.play();
						startAudio.currentTime = 0;
						var timer = setInterval(function(){
							curScore.innerHTML = N;
							if(N == bird.iCurr){
								clearInterval(timer);
							}
							N++
						},50)
						$(that.elements.btnRestart).show().animate({opacity : 1},100);
					})
				},800);

			},this))
		}
	}
});

$.extend(true,$.easing,{
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
});
