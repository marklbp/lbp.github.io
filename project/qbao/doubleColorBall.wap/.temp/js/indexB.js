+function(global,context) {
return $.extend(true,context,{
		init : function(){
			this.initEvents().getHistoryRecord();
		},
		initEvents : function(){
			if(this.initEvents.inited)return;
			this.initEvents.inited = true;
			$(document)
			//滚动加载
			.on("scroll",function(){
				var scrollTop = $(this).scrollTop();
				var maxScrollTop = $(".list").outerHeight() - $(global).height();
				var b = !Marklbp.options.isLoaded && Marklbp.options.isScroll;
				if(scrollTop >= maxScrollTop && b){
					//滑倒最底部，同时存在翻页，最后允许开启新一轮滑动
					Marklbp.request.getHistoryRecord.param.start += Marklbp.request.getHistoryRecord.param.count;
					Marklbp.getHistoryRecord();
				}
			});
			return this;	
		},
		getHistoryRecord : function(){
			var url = this.request.getHistoryRecord[this.debug ? 'debug' : 'url'];
			var type = this.request.getHistoryRecord.type;
			var param = this.request.getHistoryRecord.param;
			return this.ajax({
				url : url,
				type : type,
				param : param,
				before:function(){
					this.options.isScroll = false;
					$(".ajax-loading").find("span:first-child").show().siblings().hide().parent().show();
				},
				always : function(){
					this.options.isScroll = true;
				},
				done : function(data,fail){
					if(data && data.length > 0){
						return this.renderHistoryRecord(data);
					}
					this.options.isLoaded = true;
					return fail.call(this,{value : "已经到底啦！"})
				},
				fail : function(data){
					return this.renderHistoryRecord(false,data.value)
				}
			})
		},
		renderHistoryRecord : function(data,value){
			if(data){
				//请求到数据
				$(".ajax-loading").before(this.template($("#item-tpl").html(),{data:data}));
				if(data.length < this.request.getHistoryRecord.param.count){
					//当请求条数 < 传参设定条数，说明到底了
					this.options.isLoaded = true;
					$(".ajax-loading span:last-child").text("已经到底啦！").show().siblings().hide().parent().show();
				}else{
					$(".ajax-loading").hide();
				}
			}else{
				$(".ajax-loading").find("span:last-child").text(value).show().siblings().hide().parent().show();
			}
		}	 
	})[context.debug ? 'init' : 'checkLogin']();
}(this,Marklbp)