+function(global,context){
	return $.extend(true,context,{
		options : {
			date : 0,
			orderType : 0
		},
		init : function(){
			$(".row-access>div").eq(1).html(this.getDate());
			this.initEvents();
			return this.getRankByType();
		},
		getDate : function(date){
			date = ((date||this.options.date) * 24 * 3600 * 1000) || 0;
			var time = +new Date();
			time += date;
			var date = new Date(time);
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			m = m > 9 ? m : '0' + m;
			d = d > 9 ? d : '0' + d;
			return y + '-' + m + '-' + d;
		},
		initEvents : function(){
			if(this.initEvents.init)return this
			this.initEvents.init = true;
			var type = "ontouchend" in document ? "touchend" : "click";
			$(document)
			.on(type,".row-tab>div",function(){
				if($(this).hasClass("active"))return;
				$(this).addClass("active").siblings().removeClass("active");
				var index = $(this).index();
				if(index){
					$(".run-box>.inner>p>span").eq(0).show().next().hide().parent().show().parents(".box").show().siblings().hide();
				}else{
					$(".score-box>.inner>p>span").eq(0).show().next().hide().parent().show().parents(".box").show().siblings().hide();
				}
				Marklbp.options.orderType = index;
				$(".row-access>div").eq(1).removeClass("disabled").trigger(type);
			})
			.on(type,".row-access>div",function(){
				if($(this).hasClass("disabled"))return;
				var index = $(this).index();
				Marklbp.options.date += index == 0 ? -1 : index == 1 ? -Marklbp.options.date : 1
				if(Marklbp.options.date == -6){
					$(this).parent().find("div:first-child").addClass("disabled").siblings().removeClass("disabled");
				}else if(Marklbp.options.date == 0){
					$(this).parent().find("div:first-child").removeClass("disabled").siblings().addClass("disabled")
				}else{
					$(this).parent().find("div").removeClass("disabled")
				}
				$(this).parent().find("div").eq(1).html(Marklbp.getDate());			
				Marklbp.getRankByType()
			})
		},
		getRankByType : function(type,date){
			return this.ajax($.extend(true,{},this.request.getRankByType,{
				param : this.options,
				done : function(data){
					if(this.options.orderType){
						$(".run-box>.inner>p").hide();
						this.renderRunRank(data);
					}else{
						$(".score-box>.inner>p").hide();
						this.renderScoreRank(data);
					}
				},
				fail : function(data){
					$(".inner-box").empty()
					if(this.options.orderType){
						$(".run-box>.inner>p>span").eq(-1).html(data.value).show().prev().hide().parent().show();
					}else{
						$(".score-box>.inner>p>span").eq(-1).html(data.value).show().prev().hide().parent().show();
					}
				}
			}))
		},
		renderRunRank : function(data){
			var html = "";
			var type = 0;
			var reward = "";
			var isToday = this.options.date == 0 ? true : false;
			$.each(data,function(i,obj){
				type = obj.rewardType;
				reward = type == 0 ? "无" : ((type == 1 ? "宝券*" : type == 2 ? "红包机会*" : "砸金蛋次数*")+obj.rewardCount);
				html += '<div class="row'+(obj.isShow?' isshow':'')+'">\
							<div class="col-xs-2">'+( i > 9 ? '10+' : i+1)+'</div>\
							<div class="col-xs-3">'+obj.userName+'</div>\
							<div class="col-xs-3">'+obj.totalNum+'</div>\
							<div class="col-xs-4">'+(isToday ? "---" : reward)+'</div>\
						</div>'
			})
			$(".run-box>.inner>.inner-box").html(html)
		},
		renderScoreRank : function(data){
			var html = "";
			var type = 0;
			var reward = "";
			var isToday = this.options.date == 0 ? true : false;
			$.each(data,function(i,obj){
				type = obj.rewardType;
				reward = type == 0 ? "无" : ((type == 1 ? "宝券*" : type == 2 ? "红包机会*" : "砸金蛋次数*")+obj.rewardCount);
				html += '<div class="row'+(obj.isShow?' isshow':'')+'">\
							<div class="col-xs-2">'+( i > 9 ? '10+' : i+1)+'</div>\
							<div class="col-xs-3">'+obj.userName+'</div>\
							<div class="col-xs-3">'+obj.maxScore+'</div>\
							<div class="col-xs-4">'+(isToday ? "---" : reward)+'</div>\
						</div>'
			})
			$(".score-box>.inner>.inner-box").html(html)
		}
	})[context.debug ? "init" : "checkLogin"]()
}(window,Marklbp)