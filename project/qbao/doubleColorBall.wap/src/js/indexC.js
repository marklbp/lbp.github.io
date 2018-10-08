+function(global,context) {
	return $.extend(true,context,{
		init : function(){
			this.initEvents().render();
		},
		initEvents : function(){
			if(this.initEvents.inited)return;
			this.initEvents.inited = true;
			var that = this;
			$(document)
			//继续购买
			.on("touchend",".btn-buy-again",function(){
				return that.addLoginCallback("goToIndexPage"),false
			})
			.on("touchend",".btn-get-reward",function(){
				return that.addLoginCallback("goToRewardPage"),false;
			})
			return this;	
		},
		formatTime : function(mill){
			var date = new Date(mill);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			var h = date.getHours();
			var min = date.getMinutes();
			var sec = date.getSeconds();
			m = m >= 10 ? m : "0" + m;
			d = d >= 10 ? d : "0" + d;
			h = h >= 10 ? h : "0" + h;
			min = min >= 10 ? min : "0" + min;
			sec = sec >= 10 ? sec : "0" + sec;

			return y+"-"+m+"-"+d+" "+h+":"+min+":"+sec;
		},
		render : function(){
			var orderDetail;
			var $loading = $(".ajax-loading").show();
			try{
				orderDetail = global.localStorage&&global.localStorage.getItem&&global.localStorage.getItem("doubleColorBallDetail");
				global.localStorage.removeItem("doubleColorBallDetail");
				
				this.options.orderDetail = JSON.parse(orderDetail);
				if('object' == typeof this.options.orderDetail &&undefined===this.options.orderDetail.page){
					return this.getOrderDetail(this.options.orderDetail);
				}
				if(!orderDetail)throw new Error();
			}catch(ex){
				return $(".ajax-loading span:first-child").hide().next().text("加载异常，请退出重试")
			}
			/*
			{
				page    //区别订单详情和领奖中心的跳转进入此页面
				success //中奖与否
				get     //领奖与否
			}
			*/
			$(document.body).append(this.template($("#tpl").html(),this.options.orderDetail));
			$loading.hide();
		},
		getStatusText : function (status){
			status = Number(status);
            switch(status)
            {
                case 10:
                    return '下单成功';
                    break;
                case 20:
                    return '支付成功';
                    break;
                case 25:
                    return '派奖中';
                    break;
                case 30:
                    return '未中奖';
                    break;
                case 40:
                    return  '已发奖';
                    break;
                case 45:
                    return  '已领取';
                    break;
                case 50:
                    return '已过期';
                    break;
                default:
                    return '状态未知'
            }
        },
  		getOrderDetail : function(orderId){
			var status = orderId.status;
			var statusText = this.getStatusText(status);
			orderId = orderId.id;
			var url = this.request.getOrderDetail[this.debug ? 'debug' : 'url'];
			var type = this.request.getOrderDetail.type;
			var param = {
				orderId : orderId
			}
			return this.ajax({
				url : url,
				type : type,
				param : param,
				done : function(data){
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
					data.orderId = orderId+'';
					data.page = status == 20 ? true:false;
					data.success = $.isArray(data.winLotteryData)&&data.winLotteryData.some(function(v,i){
						return i>0&&v > 0
					})||status == 20;
					data.get = status == 45 ? true : false;
					data.message = statusText;
					data = JSON.stringify(data);
					'object' == typeof global.localStorage && 'function' == typeof global.localStorage.setItem && global.localStorage.setItem("doubleColorBallDetail",data);
					return this.render();
				},
				fail : function(data){
					return $(".ajax-loading span:first-child").hide().next().text(data.value);
				}
			})
		}
	})[context.debug ? 'init' : 'checkLogin']();
}(this,Marklbp)