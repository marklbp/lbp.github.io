+function(global,context) {
	$.extend(true,context,{
		options : {
			//jq元素缓存
			$eles : {

			},
			//选号时的缓存
			balls : {
				red : [],
				blue : [],
				bet : 0
			},
			//购物车的缓存
			carts : [
				/*
				{
					red:[],//红球选项
					blue:[],//篮球选项
					bet : 0, //多少注
					item:$item,//购物车单个列表jq对象
					status:true //是否删除,false->已删除，true->有效
				}
				*/
			],
			user : {
				name : null,//username
				isNeedPass : null, //mustTransactionPassword
				isNeedSMS : null, //needVerifyCodeCounpCount 支付大于多少时需要短信码
				maxCouponCost : null, //maxExpendCounpCount单次支付最大宝券数
				coupon : 0, //userCounpCount
				winningRule : null, //赢得奖励奖项对应价钱[0,500000,100000,10000,1000,100,50] 代表 1等奖500000 2等奖:100000
			},
			//购物车中正在更新的索引
			currentIndex : undefined,
			currentDate : null,
			pricePerBet : 0,
			confirmUserProtocoled : undefined
		},
		request : {
			page : {
				//购彩记录|我的购彩记录
				buyRecords : "//"+context.request.base.hostname+"/coupon.htm",
				//往期开奖页面
				openedRewards : "/doubleColorBallRecords.htm",
				//详情页
				detail : "/doubleColorBallDetail.htm",
				//首页
				index : "/doubleColorBall.htm"
			},
			base : {
				subfix : ".html"
			},
			//短信码
			getSMSCode : {
				url : "/doubleBall/sendVerifyCode",
				debug : "getSMSCode.json",
				type : "get",
				param : false,
				_data : ""
			},
			setUserProtocolConfirm : {
				url : "/doubleBall/setUserProtocolConfirm",
				type : "get",
				debug : "setUserProtocolConfirm.json",
				param : false,
				_data : {}
			},
			//用户是否确定过协议
			confirmUserProtocol : {
				url : "/doubleBall/isUserProtocolConfirm",
				debug : "confirmUserProtocol.json",
				type : "get",
				param : false,
				_data : null//true or false
			},
			//投注
			doBet : {
				url : "/doubleBall/userBet",
				debug : "doBet.json",
				type : Marklbp.debug ? "get" : "post",
				param : {
					/*betList : [
						{
							redStr : "",
							blueStr : "",
							mutiple : 0, //倍数
							allDatesStr : "" //期数
						}
					]*/
					betList : null,
					tradePassword : null,
					verifyCode : null
				},
				_data : [
					/*
					orderId:订单号
					bettingDates:用户压得期号
					reds:用户压注的红球
					blues:用户压注的蓝球
					bettingMutiple:压注倍数
					expendCounp：花费的宝券
					paymentDate: 支付时间
					winLotteryData: 获奖数据 [2,4,3,0,0,0,0].为4注1等奖,3注2等奖,2注未中奖
					lotteryReds: 本期开奖的红色球"1,3,5,6,7,8,10"
					lotteryBlue:本期开奖的蓝色球"1,3"
					*/
				]
			},
			//获取用户数据
			getUserData : {
				url : "/doubleBall/getDoubleBallBaseData",
				debug : "getUserData.json",
				type : "get",
				param : false,
				_data : {}
			},
			//获取单价
			getPricePerBet : {
				url : "/doubleBall/getLotteryNeedExpenseCoupon",
				debug : "getPricePerBet.json",
				type : "get",
				param : {
					redStr : "1,2,3,4,5,6",
					blueStr : "7",
					mutiple : 1,
					allDatesStr : 20161230
				}
				//,_data : {}
			},
			//获取开奖历史记录
			getHistoryRecord : {
				url : "/doubleBall/getLotteryHistoryRecord",
				debug : "getHistoryRecord.json",
				type : "get",
				param : {
					count : 20,//每页显示条数
					start : 0//第几条
				},
				_data : {
					/*
					date:期号
					reds:开奖的红球
					blues:开奖的蓝球
					userInvolvement:用户是否参与了该期双色球
					*/
				}
			},
			//获取当前期数
			getCurrentDate : {
				url : "/doubleBall/getDoubleBallCurrentDate",
				debug : "getCurrentDate.json",
				type : "get",
				param : false,
				_data : {}
			},
			//获取订单详情
			getOrderDetail : {
				url : "/doubleBall/getUserBetResult",
				debug : "getOrderDetail.json",
				debug : "get",
				param : {
					orderId : null
				},
				_data : {
					/*
					orderId:订单号
					bettingDates:用户压得期号
					reds:用户压注的红球
					blues:用户压注的蓝球
					bettingMutiple:压注倍数
					expendCounp：花费的宝券
					paymentDate: 支付时间
					winLotteryData: 获奖数据 [2,4,3,0,0,0,0].为4注1等奖,3注2等奖,2注未中奖
					lotteryReds: 本期开奖的红色球"1,3,5,6,7,8,10"
					lotteryBlue:本期开奖的蓝色球"1,3"
					*/
				}
			}
		},
		//登录控制回调
		addLoginCallback : function(cbName){
			if(this.isLogin||this.debug)return "function" == typeof this[cbName] && this[cbName]();
			global.localStorage && 'function' == typeof global.localStorage.setItem && global.localStorage.setItem('loginCallback',cbName);
			global.loginCallback = function(){
				Marklbp.isLogin = true;
				var cbName = this.localStorage.loginCallback;
				this.localStorage && 'function' == typeof this.localStorage.removeItem && this.localStorage.removeItem('loginCallback');
				Marklbp.getUserData(Marklbp[cbName]);
			}
			return this.nativeLogin();
		},
		//from small to large sort
		sort : function(objArr){
			var temp;
			for(var i = 0; i < objArr.length; i++){
                for (var j = i+1; j < objArr.length; j++){
                    if(objArr[i] > objArr[j]){
                        temp = objArr[i];
                        objArr[i] = objArr[j];
                        objArr[j] = temp;
                    }
                }
            }   
            return this;
		},
		//跳转购彩记录页
		goToRecordsPage : function(){
			'object' == typeof global.localStorage && 'function' == typeof global.localStorage.setItem && global.localStorage.setItem('goToPage',0);
			this.goToPage(this.request.page.buyRecords)
		},
		//跳转往期
		goToOpenedRewards : function(){
			this.goToPage(this.request.page.openedRewards);
		},
		//跳转奖励中心
		goToRewardPage : function(){
			'object' == typeof global.localStorage && 'function' == typeof global.localStorage.setItem && global.localStorage.setItem('goToPage',1);
			this.goToPage(this.request.page.buyRecords)
		},
		//跳转到双色球首页
		goToIndexPage : function(){
			this.goToPage(this.request.page.index);
		},
		//跳转订单详情页
		goToDetailPage : function(page,data){
			switch(page){
				//订单页
				case "order":
				data.page = true;
				data.success = true;
				data.message = "下单成功";
				data.currentDate = this.options.currentDate;
				global.localStorage&&"function" == typeof global.localStorage.setItem&&global.localStorage.setItem("doubleColorBallDetail",JSON.stringify(data));
				break;
				//获奖页
				case "award":
				data.page = false;
				break;
			}
			this.goToPage(this.request.page.detail);
		},
		//获取当前期数
		getCurrentDate : function(){
			var url = this.request.getCurrentDate[this.debug ? 'debug' : 'url'];
			var type = this.request.getCurrentDate.type;
			var param = this.request.getCurrentDate.param;
			return this.ajax({
				url : url,
				type : type,
				param : param,
				done : function(data){
					this.options.currentDate = data;
					$(".current-date").text('第'+data+'期');
				}
			})
		},
		//获取单注的单价
		getPricePerBet : function(){
			var url = this.request.getPricePerBet[this.debug ? 'debug' : 'url'];
			var type = this.request.getPricePerBet.type;
			var param = this.request.getPricePerBet.param;
			return this.ajax({
				url : url,
				type : type,
				param : param,
				done : function(data){
					this.options.pricePerBet = data;
					data = (data + '').split(".")[0];
					this.options.$eles.payCoupon.text(data);
				}
			})
		},
		//计算组合数 从m中选出n个为一组的组合数
		calCombination : function(m,n){
			if(m < n || m <= 0 || n < 0) return 0;
			if(n==0)return 1;
			return this.calFactorial(m)/(this.calFactorial(n)*this.calFactorial(m-n))
		},
		//计算一个数的阶乘
		calFactorial : function(number){
			var f = 1; 
			if(number<=0)return f;
			for (var i = number; i >= 1; i--) {
				f *= i;
			}
			return f;
		},
		//随机选号
		getRandomNumber : function(callback){
			var red = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33"];
			var blue = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"];
			var redIndex = this.random(red.length,0,6);
			//this.sort(redIndex)
			var blueIndex = this.random(blue.length,0,1);
			var balls = {
				red : [],
				blue : []
			};
			for (var i = 0; i < redIndex.length; i++) {
				balls.red.push(red[redIndex[i]])
			}
			balls.blue.push(blue[blueIndex[0]]);
			return 'function' == typeof callback && callback(balls);
		},
		//产生number个随机不重复整数，范围在 >= min 和 < max
		random : function(max, min,number) {
            //随机个数
            var rndNum = parseInt(Math.random() * max);
            var arr = [];
            var rnd = 0;
            rndNum = rndNum > 0 ? rndNum : rndNum + 1;
            if(number)rndNum = number;
            for (var i = 0; i < rndNum; i++) {
                rnd = parseInt(Math.random() * (max - min));
                if (arr.indexOf(rnd) > -1) {
                    i -= 1;
                } else {
                    arr.push(rnd);
                }
            }
            return arr;
        },
		//更新用户数据
		getUserData : function(callback){
			var url = this.request.getUserData[this.debug ? 'debug' : 'url'];
			var type = this.request.getUserData.type;
			return this.ajax({
				url : url,
				type : type,
				done : function(data){
					$.extend(true,this.options.user,{
						name : data.username,
						coupon : data.userCounpCount,
						isNeedSMS : data.needVerifyCodeCounpCount,
						isNeedPass : data.mustTransactionPassword,
						maxCouponCost : data.maxExpendCounpCount
					});
					this.updateUserData();
					'function' == typeof callback && callback.apply(this);
				},
				fail : function(data){
					return this.modal.tip(data.value,1200,true)
				}
			})
		},
		//确认用户协议
		userProtocol : function(callback){
			if(this.options.confirmUserProtocoled)return 'function' == typeof callback && callback();
			var protocol = "<div class='protocol'>\
								<div class='inner'><%=protocol%></div>\
								<label><input type='checkbox' checked><span><i class='fa fa-check'></i></span>我已阅读并同意</label>\
								<button class='btn btn-block btn-confirm'>进入游戏</button>\
							</div>";
			var that = this;
			return this.modalAlign(this.modal.dialog({
				message : this.template(protocol,{protocol:$("#protocol_tpl").html()}),
				className : 'modal-protocol',
				closeButton : false
			})
			.on("change","input[type=checkbox]",function(){
				$(this.parentNode).next().toggleClass("disabled");
			})
			.on("touchend",".btn-confirm",function(){
				if($(this).hasClass('disabled'))return false;
				$(this).addClass('disabled').html("进入游戏中<span class='text-loading'></span>");
				that.confirmUserProtocol(callback);
				return false;
			})
			.find('.modal-dialog'))
		},
		confirmUserProtocol : function(callback){
			var url = this.request.setUserProtocolConfirm[this.debug ? 'debug' : 'url'];
			var type = this.request.setUserProtocolConfirm.type;
			return this.ajax({
				url : url,
				type : type,
				always : function(){
					$(".modal-protocol").modal('hide');
				},
				done : function(){
					this.options.confirmUserProtocoled = true;
					'function' == typeof callback && callback()
				},
				fail : function(data){
					this.modal.tip(data.value,1200,true)
				}
			})
		},
		checkUserProtocol : function(callback){
			if(this.options.confirmUserProtocoled)return 'function' == typeof callback && callback();
			if(this.options.confirmUserProtocoled!==undefined)return this.userProtocol(callback);
			var url = this.request.confirmUserProtocol[this.debug ? 'debug':'url'];
			var type = this.request.confirmUserProtocol.type;
			return this.ajax({
				url : url,
				type : type,
				done : function(data){
					this.options.confirmUserProtocoled = data;
					if(!data)return this.userProtocol(callback);
					return this.checkUserProtocol(callback);
				}
			})
		},
		calDate : function(n,datestr){
			var currentDate = (datestr||this.options.currentDate)+'';
			var _date = currentDate.replace(/(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3");
			var milSecs = new Date(_date).getTime();
			var arr = [currentDate];
			var per =  24 * 3600 * 1000;
			var date,y,m,d;
			for (var i = 0; i < n-1; i++) {
				milSecs += per;				
				date = new Date(milSecs);
				y = date.getFullYear();
				m = date.getMonth() + 1;
				d = date.getDate();
				m = m >= 10 ? m : "0"+m;
				d = d >= 10 ? d : "0"+d;
				arr.push(y+""+m+""+d);
			}
			return arr.join(",")
		},
		//支付弹框
		confirmPay : function(){
			var isNeedSMS = this.options.user.isNeedSMS < this.options.payCoupon && this.options.user.isNeedSMS != 0;
			var isNeedPass = this.options.user.isNeedPass;
			if(!isNeedPass&&!isNeedSMS){
				this.options.$eles.prePay.addClass("disabled").html("支付中<span class='text-loading'></span>");
				return this.pay({},$.proxy(function(){
					this.options.$eles.prePay.removeClass("disabled").text("确认支付");
				},this))
			}
			var isNeedPass = this.options.user.isNeedPass;
			var tpl = "<form class='form-pay' style='padding-top:1.25rem'>\
						<%if(isNeedPass){%>\
					   	<h3 class='text-center h4'>交易密码</h3>\
						<div class='form-group'>\
							<input class='form-control' name='tradePassword' data-name='code' type='password' placeholder='交易密码'>\
						</div>\
						<%}if(isNeedSMS){%>\
						<div class='form-group'>\
							<div class='input-group'>\
								<input class='form-control' name='code' data-name='tradePassword' type='text' placeholder='短信验证码'>\
								<span class='input-group-btn'>\
									<button class='btn btn-get-code' onclick='Marklbp.getSMSCode(this,90,Marklbp.getSMSCodeAjax,false,\"PAY_GUESS_TREASURE_BOX\")'>获取验证码</button>\
								</span>\
							</div>\
						</div>\
						<%}%>\
						<div class='row'>\
							<button class='col-xs-6 btn btn-lg btn-default btn-cancel' type='button'>取消</button>\
							<button class='col-xs-6 btn btn-lg btn-default disabled' type='submit'>确认</button>\
						</div>\
					  </form>";
			var that = this;
			this.modalAlign(this.modal.dialog({
				message : this.template(tpl,{isNeedPass:isNeedPass,isNeedSMS:isNeedSMS}),
				className : "modal-pay"
			})
			.on("input","input[name=tradePassword],input[name=code]",function(){
				var $formGroup,$help,
					val = $.trim(this.value),
					next = $("input[name="+$(this).attr("data-name")+"]")[0],
					nextVal = next ? $.trim(next.value) : true,
					tip=this.name=="tradePassword"?"请输入交易密码":"请输入验证码";
				
				$formGroup = $(this).parents(".form-group");
				$help = $formGroup.find(".help-block");
				if(val.length <= 0){
					$formGroup.addClass("has-error");
					if($help.length>0){
						$help.show();
					}else{
						$formGroup.append('<span class="help-block"><i class="fa fa-warning"></i>'+tip+'</span>')
					}
					return $(this.form).find("button[type=submit]").addClass("disabled")
				}
				$formGroup.removeClass("has-error");
				$help.hide();
				if('string' == typeof nextVal&&nextVal.length>0||nextVal)$(this.form).find("button[type=submit]").removeClass("disabled");
			})
			.on("touchend",".btn-cancel",function(){$(this).parents('.modal').find(".close").trigger("click")})
			//密码支付表单提交
			.on("submit","form",function(){
				var $submit = $(this).find("button[type=submit]");
				if($submit.hasClass('disabled'))return false;
				$submit.addClass('disabled').html("支付中<span class='text-loading'></span>");
				var tradePassword = this.tradePassword&&$.trim(this.tradePassword.value)||null;
				var code = this.code&&$.trim(this.code.value)||null;
				var $modal = $(this).parents('.modal');
				that.pay({
					tradePassword : tradePassword,
					verifyCode : code
				},function(){
					$modal.find(".close").trigger("click");
				});
				return false
			})
			.find(".modal-dialog"));
			return this;
		}
	});
	var subfix = context.request.base.subfix;
	for(var att in context.request){
		if("url" in context.request[att]){
			if(context.request[att].url.indexOf(subfix)>-1)continue;
			context.request[att].url = context.request[att].url + subfix;
		}
	}
}(this,Marklbp)