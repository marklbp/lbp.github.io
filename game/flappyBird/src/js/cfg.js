+function(global,context) {
	$.extend(true,context,{
		request : {
			isNeedPassSMS : {
				url : !context.debug ? "/fly/getFlyConfig" : "getFlyConfig",
				type : "get",
				param : false,
				_data : {
					"isNeedPass" : 0,
					"isNeedSMS"  : 0,
					"raffleCount" : 0
				}
			},
			play : { 
				url : !context.debug ? "/fly/play" : "play",
				type : context.debug ? "get" : "post",
				param : {
					password : null,
					smsCode : null,
					rememberPassword : 0
				},
				_data : {
					"result":"0",//
					"username":"windy111",//用户名
					"subId":"3", //游戏id
					"public":""//
				}
			},
			sendScore : {
				url : !context.debug ? "/fly/sendUserScore" : "sendScore",
				type : context.debug ? "get" : "post",
				param : {
					subId : null,
					encryScore : null
				}
			},
			getSMSCode : {
				url : !context.debug ? "/sms/sendVerifyCode2" : "getSMSCode",
				debug : "getSMSCode.json",
				type : "get",
				param : {
					smsMsg : "FLY_GAME_PAY" // 验证码类型
				},
				_data : ""
			},
			getRankByType:{
				url : !context.debug ? "/fly/listRewards" : "listRewards",
				type : context.debug ? "get" : "post",
				param : {
					orderType : 0,
					date : 0
				},
				_data : {}
			}
		},
		//登录控制回调
		addLoginCallback : function(cbName,callback){
			if(this.isLogin||this.debug)return "function" == typeof this[cbName] && this[cbName](callback);
			global.localStorage && 'function' == typeof global.localStorage.setItem && global.localStorage.setItem('loginCallback',cbName);
			if('function' == typeof callback && "function" == typeof this[cbName])this[cbName].callback = callback;
            global.loginCallback = function(){
				Marklbp.isLogin = true;
				var cbName = this.localStorage.loginCallback;
				this.localStorage && 'function' == typeof this.localStorage.removeItem && this.localStorage.removeItem('loginCallback');
				'function' == typeof Marklbp[cbName] && Marklbp[cbName](Marklbp[cbName].callback);
			}
			return this.nativeLogin();
		},
		//支付短信弹框
        _renderModalPay : function(options){
            var tpl = "<form>\
                        <%if(obj.text){%>\
                        <p class='text'><%=text%></p>\
                        <%}%>\
                        <%if(isNeedPass){%>\
                        <div class='form-group'>\
                            <input type='password' name='password' class='form-control' placeholder='交易密码'>\
                        </div>\
                        <%}if(isNeedSMS){%>\
                        <div class='form-group'>\
                            <div class='input-group'>\
                                <input type='text' name='smsCode' class='form-control' placeholder='短信码'>\
                                <div class='input-group-btn'>\
                                    <button onclick='Marklbp.getSMSCode(this,90,Marklbp.getSMSCodeAjax,false,\"FLY_GAME_PAY\")' class='btn btn-get-code'>获取验证码</button>\
                                </div>\
                            </div>\
                        </div>\
                        <%}if(isNeedPass){%>\
                        <label>\
                            <input type='checkbox' checked name='rememberPassword' value='1'>\
                            <span><i class='fa fa-check'></i></span>开启免密支付\
                        </label>\
                        <%}%>\
                        <button type='submit' class='btn btn-block btn-submit<%=isNeedPass||isNeedSMS?\" disabled\":\"\"%>'>确认</button>\
                    </form>"
            var $modalDialog = this.modal.dialog({
                message : this.template(tpl,options),
                className : 'modal-pay'
            })//输入框校验
            .on("input focusin focusout","input[name=password],input[name=smsCode]",function(e){
                var android = Marklbp.request.base.client.android&&!Marklbp.request.base.client.ios;
                if(e.type.toLowerCase().indexOf('focusin')>-1&&android){
                    $(this).parents(".modal-dialog").addClass("fixed-top")
                }
                if (e.type.toLowerCase().indexOf('focusout')>-1&&android) {
                    $(this).parents(".modal-dialog").removeClass("fixed-top");
                }
                var $formGroup,$help,
                    nextVal = (!options.isNeedPass&&"...")||$.trim(this.form.password.value),
                    val     = $.trim(this.value),
                    tip     = this.name == "password"?"请输入交易密码":"请输入验证码";

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
                if(this.name=="password"){
                    nextVal = (!options.isNeedSMS&&"...")||$.trim(this.form.smsCode.value);
                }
                if(nextVal.length>0)$(this.form).find("button[type=submit]").removeClass("disabled");
            })
            .on("touchend","[type=submit]",function(){
                $(this.form).submit();
                return false;
            })
            .on("submit","form",function(){
                var $submit = $(this).find("button[type=submit]");
                if($submit.hasClass('disabled'))return false;
                var $modal = $(this).parents(".modal");
                $submit.addClass('disabled').text('支付中...');
                var password = (!options.isNeedPass&&"...")||this.password.value;
                var smsCode = (!options.isNeedSMS&&"...")||this.smsCode.value;
                var rememberPassword = options.isNeedPass&&($(this.rememberPassword).prop("checked")?1:0)||options.rememberPassword;
                Marklbp.pay(function(data){
                    if(data.success&&rememberPassword)options.rememberPassword = rememberPassword;
                    $modal.modal('hide');
                },password,smsCode,rememberPassword);
                return false;               
            })
            .find(".modal-dialog").width("75%");
            this.modalAlign($modalDialog);
            return this;
        },
        //支付
        _pay : function(callback,password,code,rememberPassword){}
	}) 

	var subfix = context.debug ? ".json" : context.request.base.subfix;
	for(var att in context.request){
		if("url" in context.request[att]){
			if(context.request[att].url.indexOf(subfix)>-1)continue;
			context.request[att].url = context.request[att].url + subfix;
		}
	}
}(window,Marklbp)