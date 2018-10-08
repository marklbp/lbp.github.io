+function(global,context) {
return $.extend(true,context,{
		init : function(){
			//获取一注价格
			this.getPricePerBet()
			//获取当前期数
			.getCurrentDate()
			.initEvents()
			//缓存渲染的部分元素
			.cacheElements();
			if(this.isLogin||this.debug)this.getUserData().checkUserProtocol();
			return this;
		},
		//缓存元素
		cacheElements : function(){
			this.options.$eles = this.options.$eles ? this.options.$eles : {};
			$.extend(this.options.$eles,{
				indexPage : $("#index_page"),
				//当前共计投注数
				totalBets : $(document).find("[data-marklbp=totalBets]"),
				//球号数
				balls : (function(){
							var json = {
								red : {},
								blue : {}
							};
							var color,number;
							$(document).find(".index-page .ball:not(.btn-reset):not(.unvisible)").each(function(){
								color = $(this).parents(".red").length > 0 ? "red" : "blue";
								number = $.trim($(this).text()+'')
								json[color][number] = $(this);
							})
							return json;
						})(),
				cartPage : $("#cart_page"),
				carts : $("#cart_page .list"),
				itemTpl : $("#item-tpl").html(),
				prePay : $("#cart_page .foot-nav .btn-pay"),
				allDate : $("#cart_page .foot-nav input[name=allDatesStr]"),
				mutiple : $("#cart_page .foot-nav input[name=mutiple]"),
				payCoupon : $("#cart_page .foot-nav .payCoupon"),
				leftCoupon : $("#cart_page .foot-nav .leftCoupon")
			});
			return this;
		},
		//事件注册
		initEvents : function(){
			if(this.initEvents.inited)return this;
			this.initEvents.inited = true;
			var that = this;
			$(document)
			//规则
			.on("touchend",".modal-rule",function(){
				$(this).toggleClass("active");
			})
			//往期
			.on("touchend",".btn-recorded",function(){
				return that.addLoginCallback("goToOpenedRewards"),false;
			})
			//选号
			.on("touchend touchstart",".index-page .ball:not(.btn-reset):not(.unvisible)",function(e){
				if(e.type=='touchstart')return e.preventDefault();
				$(this).toggleClass("active");
				var isRedBall = $(this).parents(".red").length > 0 ? "red" : "blue"; 
				var number = $(this).text()+''; 
				var index = that.options.balls[isRedBall].indexOf(number);
				if($(this).hasClass("active")){
					that.options.balls[isRedBall].push(number)
				}else{
					if(index>-1)that.options.balls[isRedBall].splice(index,1)
				}
				that.calBets();
				return false;
			})
			//重置选号
			.on("touchstart touchend",".ball.btn-reset",function(e){
				if(e.type.toLowerCase()=="touchstart"){
					$(this).addClass("active");
					return false;
				}
				$(this).removeClass("active");
				return that.resetBets(),false;
			})
			//下一步
			.on("touchend",".btn-next",function(){
				if(that.options.balls.blue.length<=0||that.options.balls.red.length<6)return that.modal.tip("请至少选择6个红球和1个篮球",1200,true),false;
				return that.addLoginCallback("nextStep"),false;
				//return that.addLoginCallback("goToConfirmPage"),false;
			})
			//用户中心
			.on("touchend",".btn-user",function(){
				return that.addLoginCallback("toggleUserNav"),false;
			})
			//购彩记录
			.on("touchend",".btn-records,.btn-my-bets",function(){
				return that.addLoginCallback("goToRecordsPage"),false;
			})
			//领奖中心
			.on("touchend",".btn-get-reward,.btn-user-nav>a:first-child",function(){
				return that.addLoginCallback("goToRewardPage"),false;
			})
			//随机选号
			.on("touchend",".btn-random",function(){
				var isIndexPage = $(this).parents(".index-page").length>0;
				return that.getRandomNumber(function(balls){
					if(isIndexPage){
						Marklbp.resetBets().resetBets(balls);
					}else{
						balls.status = true;
						balls.bet = 1;
						Marklbp.updateCart(balls).updatePayCoupon().updateCartScroll(true);
					}
				}),false;
			})
			//手选一注
			.on("touchend",".cart-page .btn-hand",function(){
				return that.prevStep(),false;
			})
			//删除指定押注
			.on("touchend",".cart-page .list .btn-del",function(){
				var n = 0;
				that.options.carts.forEach(function(v,i){v.status ? n++ : n;});
				var hasBet = that.options.carts.length >0 && n<=1;
				var index = $(this.parentNode).slideUp().index();
				that.options.carts[index].status = false;
				if(hasBet)return that.prevStep(),false;
				that.updatePayCoupon();
				return false;
			})
			//修改
			.on("touchend",".cart-page .list .btn-go",function(){
				var index = $(this.parentNode).index();
				that.prevStep(index);
				return false;
			})
			//确认支付
			.on("touchend",".cart-page .foot-nav .btn-pay",function(){
				if($(this).hasClass("disabled"))return false;
				$(this).addClass("disabled").html("玩命处理中<span class='text-loading'></span>");
				return that.addLoginCallback("prePay"),false;
			})
			//追期和加倍
			.on("input",".cart-page .foot-nav input",function(){
				if(!/^(?:[1-9]\d*|\s*)$/.test(this.value)){
					this.value = 1;
				}
				that.updatePayCoupon();
			});
			return this;	
		},
		//显示隐藏用户中心导航
		toggleUserNav : function(){
			$(".btn-user-nav").toggleClass("active");
		},
		//更新用户数据
		updateUserData : function(){
			this.options.$eles.leftCoupon.text(this.options.user.coupon);
			return this;
		},
		//重置注数
		resetBets : function(balls){
			if(balls){
				this.options.balls.red = balls.red;
				this.options.balls.blue = balls.blue;
			}
			//去掉选中的红色球元素class
			$.each(this.options.balls.red,function(i,number){
				Marklbp.options.$eles.balls.red[number][(balls ? "add" : "remove") +"Class"]("active");
			});
			//去掉选中的蓝色球元素class
			$.each(this.options.balls.blue,function(i,number){
				Marklbp.options.$eles.balls.blue[number][(balls ? "add" : "remove") +"Class"]("active");
			})
			if(!balls){
				this.options.balls.red = [];
				this.options.balls.blue = [];
			}
			return this.calBets();
		},
		//计算注数
		calBets : function(){
			var bets = 0;
			var redLen = this.options.balls.red.length;
			var blueLen = this.options.balls.blue.length;
			if(redLen >= 6 && blueLen  > 0){
				bets = this.calCombination(redLen,6)*this.calCombination(blueLen,1)
			}
			this.options.balls.bet = bets;
			bets = (bets + '').split(".")[0];
			return this.options.$eles.totalBets.text(bets),this
		},
		//下一步存进购物车
		nextStep : function(){
			this.checkUserProtocol($.proxy(function(){
				this._nextStep();
			},this))
		},
		//下一步存进购物车
		_nextStep : function(){
			var currentIndex = Number(this.options.currentIndex);
			var isUndefined = isNaN(currentIndex);
			var newBet,oldBet;
			if(isUndefined){
				//追加押注
				newBet = $.extend(true,{},this.options.balls);
				newBet.status = true;
			}else{
				//更新已有的押注
				oldBet = this.options.carts[currentIndex];
				newBet = $.extend(true,{},oldBet);
				newBet.red = [].concat(this.options.balls.red);
				newBet.blue = [].concat(this.options.balls.blue);
				newBet.bet = this.options.balls.bet;
			}
			//更新购物车
			this.updateCart(newBet,oldBet)
			//清空缓存的注数
			.resetBets()
			//隐藏首页
			.options.$eles.indexPage.hide();
			//显示购物车页
			this.options.$eles.cartPage.show();
			this.updatePayCoupon();
			this.updateCartScroll(isUndefined);
		},
		//更新需要支付宝券数显示
		updatePayCoupon : function(){
			//更新需要支付的宝券
			var pricePerBet = this.options.pricePerBet;
			var howDate = this.options.$eles.allDate.val();
			var howTimes = this.options.$eles.mutiple.val();
			howDate = isNaN(Number(howDate))|| Number(howDate) < 1 ? 1 : parseInt(howDate);
			howTimes = isNaN(Number(howTimes))|| Number(howTimes) < 1 ? 1 : parseInt(howTimes);
			var bets = ($.proxy(function(){
				var s = 0;
				$.each(this.options.carts,function(i,balls){
					if(!balls.status)return;
					s += balls.bet
				})
				return s;
			},this))()
			var payCoupon = howTimes * howDate * bets * pricePerBet;
			this.options.payCoupon = payCoupon;
			payCoupon = (payCoupon+'').split(".")[0];
			this.options.$eles.payCoupon.text(payCoupon);
			return this;
		},
		//购物车滚动定位
		updateCartScroll : function(flag){
			var st = 0;
			var vH = document.documentElement.clientHeight;
			var listOuterH = this.options.$eles.cartPage.outerHeight();
			var listInnerH = this.options.$eles.cartPage.height();
			var minusH = listOuterH - listInnerH;
			var indexH = this.options.carts[this.options.currentIndex].item.offset().top + this.options.carts[this.options.currentIndex].item.outerHeight();
			st = indexH + minusH  - vH;
			if(flag)st = listOuterH - vH;
			$(document.body).scrollTop(st);
			delete this.options.currentIndex;
		},
		//回退到上一步选号
		prevStep : function(index){
			this.options.currentIndex = index;
			var balls = this.options.carts[index];
			this.resetBets(balls);
			//隐藏购物车页
			this.options.$eles.cartPage.hide();
			//显示首页
			this.options.$eles.indexPage.show();
		},
		//更新购物车操作
		updateCart : function(news,olds){
			//排序押注数
			var $item = this.sort(news.red)
						.sort(news.blue)
						.renderItem(news,olds);
			//追加押注
			if(!olds){
				this.options.carts.push(news);
				this.options.currentIndex = this.options.carts.length - 1;
				this.options.$eles.carts.append($item);
			}else{
				this.options.carts[this.options.currentIndex] = news;
			}
			this.options.carts[this.options.currentIndex].item = $item;
			return this;
		},
		//渲染购物车每一条押注
		renderItem : function(news,olds){
			var $item;
			var $tpl = $(this.template(this.options.$eles.itemTpl,news));
			if(olds){
				$item = news.item;
				$item.find(".balls").html($tpl.find(".balls").html());
				$tpl = null;
			}else{
				$item = $tpl;
			}
			return $item;
		},
		//支付预处理
		prePay : function(){
			var allDatesStr = this.options.$eles.allDate.val();
			var mutiple = this.options.$eles.mutiple.val();
			if(allDatesStr <= 0 || mutiple <= 0)return that.modal.tip("请输入追加期数或投注倍数哦",1200,true),this.options.$eles.prePay.removeClass("disabled").text("确认支付"),this;
			if(this.options.payCoupon > this.options.user.coupon)return this.modal.tip("您的宝券不足",1200,true),this.options.$eles.prePay.removeClass("disabled").text("确认支付"),this;
			if(this.options.payCoupon > this.options.user.maxCouponCost)return this.modal.tip("超出最大投注宝券数",1200,true),this.options.$eles.prePay.removeClass("disabled").text("确认支付"),this;
			this.checkUserProtocol($.proxy(function(){
				this.options.$eles.prePay.removeClass("disabled").text("确认支付");
				this.confirmPay();
			},this))
		},
		//确认支付
		pay : function(param,callback){
			var url = this.request.doBet[this.debug?'debug':'url'];
			var type = this.request.doBet.type;
			var _param = this.request.doBet.param;
			param.betList = [];
			var mutiple = this.options.$eles.mutiple.val();
			var allDatesStr = this.calDate(this.options.$eles.allDate.val());
			$.each(this.options.carts,function(i,balls){
				if(!balls.status)return;
				param.betList.push({
					mutiple : mutiple,
					allDatesStr : allDatesStr,
					blueStr : balls.blue.join(","),
					redStr : balls.red.join(",")
				})
			});
			param = JSON.stringify($.extend(true,{},_param,param));
			var orderIds = [];
			return this.ajax({
				url : url,
				type : type,
				param : param,
				contentType : 'application/json',
				timeout : 10000, 
				always : function(data){
					'function' == typeof callback && callback(data);
				},
				success:function(data,status,_data){
					_data.responseText.replace(/orderId":(\d+),?/g,function(a,b){
						orderIds.push(b+'');
						return a;
					})
				},
				done : function(data){
					this.getUserData();
					var cost = this.options.payCoupon+'宝券';
					$.each(data,function(i,o){
						o.orderId = orderIds[i]+'';
					})
					this.resetCart();
					this.modalAlign(this.modal.dialog({
						message : "<div class='has-success text-center'style='padding: 2rem;font-size: 1.5rem;'>\
									<span class='help-block'>\
										<i class='fa fa-check'></i>支付成功\
									</span>\
								</div>\
								<div class='row'>\
									<div class='col-xs-6'><button class='btn btn-block btn-order-detail'>查看详情</button></div>\
									<div class='col-xs-6'>\
										<button class='btn btn-block btn-pay-ok' onclick='$(this).parents(\".modal\").find(\".close\").trigger(\"click\")'>确定</button>\
									</div>\
								</div>"
					})
					//订单详情
					.on("touchend",".btn-order-detail",function(){
						$(this).parents(".modal").find(".close").trigger("click");
						Marklbp.goToDetailPage("order",{
							cost : cost,
							data : data
						})
					})
					.on("hidden.bs.modal",function(){
						Marklbp.prevStep();
					})
					.find(".modal-dialog").width("75%"));
				},
				fail : function(data){
					this.modal.tip(data.value,1200,true);
				}
			})
		},
		//重置购物车
		resetCart : function(){
			this.options.carts = [];
			this.options.$eles.carts.empty();
			this.options.$eles.allDate.val(1);
			this.options.$eles.mutiple.val(1);
			this.updatePayCoupon();
		}	 
	})[context.debug ? 'init' : 'checkLogin']();
}(this,Marklbp)