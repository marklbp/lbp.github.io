+function(global, factory) {
    //关闭严格的site_frame布局
    global.siteFrame && 'function' == typeof global.siteFrame.strict && global.siteFrame.strict(false);
    var Marklbp = factory.apply(global);
    Marklbp.debug = /^(?:(?:\bm\.\b|\bm-\b)*q|f)hb\.qbao\.com$/.test(global.location.hostname) ? false : true;
    //debug模式关闭统计
    Marklbp.debug && global.siteFrame && 'function' == typeof global.siteFrame.stats && global.siteFrame.stats(false);
    //抛出全局对象方式
    if ('function' == typeof global.define && (global.define.amd || global.define.cmd)) {
        global.define(function() {
            //模块式，供seaJs/requireJs加载依赖使用
            return Marklbp;
        })
    } else {
        //全局挂载方式，即挂载到当前环境下
        global.Marklbp = Marklbp;
    }
    global.loginCallback = function(data) {
        Marklbp.isLogin = true;
        return Marklbp.init();
    }
    Marklbp.initEvents();

}(this, function() {
    var global = this;
    var modal = function() {
        var obj = $.extend({
            tip : function(message,close,isCenter){
                var time     = 3000;
                var effect   = 'fadeOut';
                var callback = function(){};
                var modal = this.dialog({
                     message : message,
                     closeButton : false,
                     backdrop : false
                }).addClass("modal-tip");
                var modalDialog = modal.removeClass("fade").find(".modal-dialog");
                if(isCenter)Marklbp.modalAlign(modalDialog);
                if('number' == typeof close){
                    time = close;
                }else if('object' == typeof close){
                    time     = 'number' == typeof close.time ? close.time : 3000;
                    callback = 'function' == typeof close.callback ? close.callback : callback
                }else if('function' == typeof close){
                    callback = close;
                }
                setTimeout(function(){
                     callback();
                     modal[effect](800,function(){
                       $(document.body).removeClass("modal-open");
                       $(this).remove();
                     })
                },time);
                return modal;
            }
        }, 'object' == typeof global.alertbox && global.alertbox);
        try{delete global.alertbox}catch(ex){global.alertbox = undefined;}
        return obj;
    }();
    return {
        request: {
            base : {
                protocol : global.location.protocol,
                port:global.location.port,
                hostname : global.location.hostname,
                host : global.location.protocol + '//' + global.location.hostname + (global.location.port.length > 0 ? (':'+global.location.port):''),
                client : {
                    ios : global.ioswebview&&"function" == typeof global.ioswebview.showLoginViewAnd,
                    android : global.QBaoJSBridge&&"function" == typeof global.QBaoJSBridge.login
                },
                pc : "//qhb.qbao.com",
                _mobile : "//m.qhb.qbao.com",
                mobile : "//m-qhb.qbao.com",
                subfix : ".html"
            },
            //统计
            ads: {
                url: global.location.protocol+'//'+global.location.hostname+"/ad/log.html" ,
                webUrl: global.location.protocol+'//'+global.location.hostname+"/ad/log.html",
                type: "post",
                param: {
                    type: "",
                    adUrl: "",
                    pictureUrl: ""
                },
                data: {

                }
            },
            //快捷兑换接口
            exchangeExpress: {
                //快捷兑换权限
                load: {
                    url: "/fast/easybuy/load.html",
                    debug: "exchangeLoad.json",
                    type: "get",
                    param: false,
                    data: {
                        useEasyBuy: true, //是否可以快捷兑换标识，true -> 快捷
                        isOpenEasyBuy: false, //是否开通快捷兑换, true -> 是 
                        couponBalance: 0, //宝券剩余数
                        useCoupon: 0, //兑换消耗的宝券数
                        raffleCont: 0 //兑换的红包机会数
                    }
                },
                //快捷兑换
                buy: {
                    url: "/fast/easybuy/buy.html",
                    debug: 'exchangeBuy.json',
                    type: "get",
                    param: false,
                    data: 0
                },
                //开通快捷兑换功能
                open: {
                    url: "/fast/easybuy/open.html",
                    debug: 'exchangeOpen.json',
                    type: "get",
                    param: {
                        tradePassword: "",
                        smsCode : ""  //非必填,短信验证开关打开时才需要传入
                    },
                    data: ""
                },
                //关闭快捷兑换功能
                close: {
                    url: "/fast/easybuy/close.html",
                    debug: 'exchangeClose.json',
                    type: "get",
                    data: ""
                },          
                sms:{
                    url: "/sms/sendVerifyCode.html",
                    debug: 'exchangeClose.json',
                    type: "get",
                    param: {
                        smsMsg: ""  //发送短信的消息类型
                    },
                    data: ""
                }
            },
            isLogin: {
                url : "/" + (global.location.hostname.indexOf("qhb") > -1 ? "ajax" : "fhb") + "/isUserLogin.html",
                //只限wap端的抢红包域名下提供了jsonp方式
                jsonp : "/ajax/jsonp/isUserLogin.html",
                type : "get",
                _data : {
                    isUserLogin : false
                }
            }
        },
        exchangeTemplate: {

            loading: "<div class='loading'>请稍后...</div>",

            express: "<div class='modal-exchange-dialog'>\
                            <p class='text'>剩余红包机会不足！</p>\
                            <% if (status) { %>\
                            <div class='access'>\
                            <p>您已开通快捷兑换服务，立即使用<span class='coupon red'><%=coupon%></span>宝券兑换<span class='red'><%=count%></span>个红包机会</p>\
                                <%if(balance){%>\
                                <p>账户余额：<%=balance%>宝券</p>\
                                <%}%>\
                            </div>\
                            <% } %>\
                            <div class='btns'>\
                                <% if (status){ %>\
                                <button class='btn btn-express'>确定</button>\
                                <%}%>\
                                <a class='btn btn-manual<%=status?\" btn-ax\":\"\"%>' href='<%=manualUrl%>'>\
                                    <%=status ? '手动兑换' : '去兑换' %>\
                                </a>\
                            </div>\
                        </div>",

            alert: "<div class='icon'></div>\
                       <p class='text'><%=message%></p>\
                       <div class='btns'>\
                           <button class='btn btn-ok'>确定</button>\
                       </div>"
        },
        //初始化
        init: function(callback) {
            this.initEvents();
            'function' == typeof callback && callback.apply(this);
            return this;
        },
        //初始化公用头尾等
        initSiteFrame : function(arrMod){
            var that = this;
            var arrHtml = [
                {
                    name : 'top',
                    param : false,
                    context : global.siteCmtop,
                    fn : global.siteCmtop&&global.siteCmtop.init
                },
                {
                    name : 'head',
                    param : false,
                    context : global.siteBizhd,
                    fn : global.siteBizhd&&global.siteBizhd.init
                }, 
                {
                    name : 'menus',
                    param : false,
                    context : global.siteMenus,
                    fn : global.siteMenus&&global.siteMenus.init
                }, 
                {
                    name : 'foot',
                    param : false,
                    context : global.siteFoot,
                    fn : global.siteFoot&&global.siteFoot.init
                }
            ];
            arrMod = $.isArray(arrMod)?arrMod:false;
            if(!arrMod)return;
            $.each(arrMod,function(i,k){
                var obj = arrHtml[k];
                var $selector = $(".site_frame_"+ obj.name);
                try{
                    'function' == typeof obj.fn && (!obj.param ? obj.fn.call(obj.context):obj.fn.call(obj.context,obj.param))
                }catch(e){
                    $selector.html("<p class='text-center'>加载失败，<a>点击重试</a></p>")
                    .find("a").click(function(){
                        'function' == obj.fn &&  (!obj.param ? obj.fn.call(obj.context):obj.fn.call(obj.context,obj.param));
                        return false;
                    })
                }
            });
            return this;
        },
        //校验登录
        checkLogin: function(flag,callback) {
            return this.ajax({
                url: this.request.isLogin.url,
                always: function(data){
                    if(data&&data.success&&data.data&&data.data.isUserLogin){
                        this.isLogin = true;
                        'function' == typeof this.init && this.init();
                    }else{
                        if(flag){
                            this.nativeLogin();
                        }else{
                            this.isLogin = false;
                            'function' == typeof this.init && this.init();
                        }
                    }
                    'function' == typeof callback && callback(data);
                }
            })
        },
        //实际跳转
        goToPage : function(url){
            var protocol            = this.request.base.protocol;
            var hostname            = this.request.base.hostname;
            var port                = this.request.base.port;
            var targetpage          = hostname.indexOf("fhb")>-1?"fhb":"qhb";
            var hasQbaoClientPrefix = false;
            port = (port+"").length > 0 ? (":"+port) : "";
            if(url.indexOf(protocol) === 0 && url.indexOf(protocol) > -1){
                // http://www.dddd.com
                //url = url;
            }else if(url.indexOf("//") === 0 ){
                // //m.qhb.com...
                url = protocol + url; 
            }else if(url.indexOf("qianbao://") === 0){
                // qianbao://qianbaoclient.com?targetpage=qhb&url=http://www.baidu.com
                //url = url.replace(/(targetpage=[q|f]hb\&url=)(\w+)(:)/,"$1"+protocol+"$3");
                hasQbaoClientPrefix = true;
            }else if(url[0]=="/"&&url[1]!="/"){
                // /url.html
                url = protocol+"//"+hostname+port+url
            }

            if(this.request.base.client.ios||this.request.base.client.android){
                if(!hasQbaoClientPrefix)url = "qianbao://qianbaoclient.com?targetpage="+targetpage+"&url="+url;
            }else{
                if(hasQbaoClientPrefix)url = url.replace(/^qianbao:\/\/qianbaoclient.com\?targetpage=[q|f]hb&url=(.+)$/g,"$1")
            }
            if(this.request.base.client.ios||this.request.base.client.android){
                global.location.href = url;
                return; 
            }
            global.open(url);
        },
        goToQHBNativeIndex : function(){
            if(this.request.base.client.ios||this.request.base.client.android){
                global.location.href = "qbao://app/hongbaoHome";
            }
        },
        //native登录框
        nativeLogin : function(){
            //未登录 
            try {
                //弹native的登录框
                coreSetup.clientLoginCallback(loginCallback,this.request.base.hostname);
            } catch (ex) {
                //调native框异常后报错提示
                this.modal.tip("登录异常，请在钱宝app打开",1200,true)
            }
        },
        //统计点击
        initEvents: function(callback) {
            var that = this;
            if(this.initEvents.inited){
               'function' == typeof callback && callback.apply(this);
               return this; 
            }
            this.initEvents.inited = true;
            var isApp = this.request.base.client.ios || this.request.base.client.android;
            $(document)
            //广告点击统计和跳转,即埋点
            .on(isApp?"touchend":"click", "a[data-ad]", function() {
                var type = this.dataset && this.dataset.adType || $(this).data("ad-type");
                var adUrl = this.dataset && this.dataset.adUrl || $(this).data("ad-url");
                var pictureUrl = this.dataset && this.dataset.adPicture || $(this).data("ad-picture");
                var url = that.request.ads.url;
                var queryStr = "?type=" + type + "&adUrl=" + adUrl + "&pictureUrl=" + pictureUrl;

                if (!type || type.length <= 0)return false;
                that.ajax({
                    type: that.request.ads.type,
                    url: url + queryStr,
                    param: false,
                    name: "ads"
                })
                if(adUrl.length <= 0 || adUrl.indexOf('false') > -1)return false;
                that.goToPage(adUrl);
                return false;
            });
            'function' == typeof callback && callback.apply(this);
            return this;
        },
        modalAlign : function(dialog){
            var h  = dialog.height();
            var vh = $(global).height();  
            dialog.css({
                "marginTop" :(vh - h) /2,
                "marginBottom" : 0,
                "marginLeft" : "auto",
                "marginRight" : "auto"
            });
            return this;
        },
        //快捷兑换loading框
        exchangeExpressLoad: function(callback, container, modalClass,closeFn) {
            container = container || $(document.body);
            var modalTpl = this.template(this.exchangeTemplate.loading);
            var isApp    = modalClass == "modal-wap-express" ? true : false;
            var $modal   = this.modal.dialog({
                message: modalTpl,
                onEscape: function() {
                    'function' == typeof closeFn && closeFn();
                    if ('boolean' == typeof $modal[0].isClose) {
                        return $modal[0].isClose
                    } else if ('function' == typeof $modal[0].isClose) {
                        return $modal[0].isClose()
                    } else {
                        return true;
                    }
                }
            }).addClass(modalClass || '');
            var $modalDialog = $modal.find(".modal-dialog");
            this.modalAlign($modalDialog);
            //注册关闭标识，用于控制是否可以关闭弹框
            $modal[0].isClose = true;
            //获取快捷兑换权限

            var url  = this.request.exchangeExpress.load[this.debug ? "debug" : "url"];
            var type = this.request.exchangeExpress.load.type;
            return this.ajax({
                url: url,
                type: type,
                done: function(data, fail) {
                    if (!data) return fail({ value: "加载失败，请稍后再试" })
                    this.exchangeExpress($modal, data, callback)
                },
                fail: function(data) {
                    $modal.find(".loading").hide().after("<p class='message'>" + data.value + "</p>")
                },
            })
        },
        //快捷兑换框
        exchangeExpress: function($modal, data, callback) {
            var that = this;
            var isApp = $modal.hasClass("modal-wap-express");
            var status = data.useEasyBuy;
            var coupon = data.useCoupon || 0;
            var count = data.raffleCount || 0;
            var balance = data.couponBalance || 0;
            var manualUrl = "/usercenter/raffleTask.html";
            var host = this.request.base.host;

            if (isApp) {
                manualUrl = "qianbao://qianbaoclient.com?targetpage=qhb&url="+host+"/second/raffleTask.html";
                balance = false;
            }
            //初始化快捷兑换框模板
            var modalTpl = this.template(this.exchangeTemplate.express, {
                    status: status,
                    coupon: coupon,
                    count: count,
                    balance: balance,
                    manualUrl: manualUrl
                })
                //隐藏loading，渲染对应的兑换框内容
            $modal.find(".loading").hide()
                .parents(".modal-body").append(modalTpl)
                //注册快捷兑换点击事件
                .on("click", ".btn-express", function() {
                    if ($(this).hasClass("btn-grey")) return;
                    var $manualBtn = $(this).addClass("btn-grey").text("兑换中...")
                        //手动兑换不可点击
                        .siblings(".btn");
                    var href  = $manualBtn.attr("href");
                    var isApp = $modal.hasClass("modal-wap-express");
                    $manualBtn.data("href", href).attr("href", "javascript:void(0)");
                    //屏蔽关闭按钮功能
                    $modal[0].isClose = false;
                    //快捷兑换请求...
                    var url  = that.request.exchangeExpress.buy[that.debug ? "debug" : "url"];
                    var type = that.request.exchangeExpress.buy.type;
                    that.ajax({
                        url: url,
                        type: type,
                        always: function(data) {
                            //开启关闭功能
                            $manualBtn.parents(".modal")[0].isClose = function() {
                                'function' == typeof callback && callback(data);
                                return true;
                            };
                        },
                        done: function(data, fail) {
                            //快捷兑换成功
                            var $modal = $manualBtn.parents(".modal");
                            //快捷兑换提示语模板
                            var tip = this.template(this.exchangeTemplate.alert, {
                                message: "快捷兑换成功"
                            });

                            $modal.find(".modal-exchange-dialog").addClass("success").html(tip);
                        },
                        fail: function(data) {
                            //快捷兑换失败
                            var $modal = $manualBtn.parents(".modal");
                            //快捷兑换提示语模板
                            var tip = this.template(this.exchangeTemplate.alert, {
                                message: data.value || "快捷兑换失败"
                            });
                            $modal.find(".modal-exchange-dialog").html(tip).find(".icon").addClass("icon-err");
                        }
                    })
                })
                //注册兑换后确定按钮点击事件
                .on("click", ".btn-ok", function() {
                    $(this).parents(".modal").find(".close").trigger("click");
                });
            this.modalAlign($modal.find(".modal-dialog"));
        },
        //获取短信码的倒计时效果
        getSMSCode : function(btn,times,ajaxFn,callback,smsMsg){
            if("object" != typeof btn||btn.nodeType!=1)return;
            var $btn = $(btn);
            if($btn.hasClass("disabled"))return;
            ajaxFn = ajaxFn || "function" == typeof times && times; 
            times = isNaN(Number(times)) ? 60 : Number(times);
            $btn.addClass("disabled").text(times+'s后重试');
            var $doc = $(document);
            $btn.interval = setInterval(function(){
                if($btn.parent().length <= 0 || $doc.find($btn).length <= 0)return clearInterval($btn.interval);
                if(times<=0){
                    clearInterval($btn.interval);
                    return $btn.removeClass("disabled").text("点击获取");
                }
                times -= 1;
                $btn.text(times+"s后重试")
            },1000);
            return "function"==typeof ajaxFn&&ajaxFn.call(this,callback,smsMsg);
        },
        //获取短信码的请求
        getSMSCodeAjax : function(callback,smsMsg){
            var url = this.request.getSMSCode[this.debug?'debug':'url'];
            var type = this.request.getSMSCode.type;
            var ajaxParam = {
                url : url,
                type : type,
                always : function(data){
                    "function" == typeof callback && callback(data);
                },
                done : function(){
                    this.modal.tip("短信发送成功",1200,true);
                },
                fail : function(data){
                    this.modal.tip(data.value,1200,true)
                }
            };
            if(this.request.getSMSCode.param&&smsMsg){
                ajaxParam.param = {};
                ajaxParam.param.smsMsg = smsMsg
            }
            return this.ajax(ajaxParam)
        },
        //请求总入口
        ajax: function(option) {
            if('object' != typeof option || 'string' != typeof option.url)return this;
            var url    = option.url;
            var type   = option.type;
            var time   = option.timeout  || 5000;
            var param  = option.param    || "";
            var before = option.before   || function() {
                return true
            };
            var always = option.always;
            var done   = option.done;
            var fail   = option.fail;
            var that   = this;
            option = $.extend(true,option,{
                url: url,
                type: type,
                timeout: time,
                data: param,
                beforeSend: function() {
                    var returnVal = true;
                    returnVal = 'function' == typeof before && before.apply(that);
                    return returnVal;
                }
            })
            $.ajax(option)
            .always(function(data) {
                var response = $.extend(true, {}, data || {});
                if (option.name && that.request[option.name]) that.request[option.name].response = response;
                return 'function' == typeof always && always.apply(that, [data])
            })
            .done(function(data) {
                if (data && data.success) {
                    data = data.data;
                    if (option.name && that.request[option.name]) that.request[option.name].data = data;
                    return 'function' == typeof done && done.apply(that, [data, fail])
                } else {
                    return 'function' == typeof fail && fail.apply(that, [{
                        key: 'unknown',
                        code: data.code || 0,
                        value: data.message || "请求失败，请稍后再试"
                    }])
                }
            })
            .fail(function(data) {
                var text = data && data.statusText || "unknown";
                text = text.toLowerCase();
                var message = "请求失败，请稍后再试";
                switch (text) {
                    case "timeout":
                        message = "请求超时，请重新再试";
                        break;
                    case "not found":
                        message = "请求未找不到，请确认地址有效性";
                        break;
                    case "server error":
                        message = "服务不可用，请稍后再试";
                        break;
                    case "bad gateway":
                        message = "网关错误，请稍后再试";
                    case "unknown":
                    default:
                        break
                }
                return 'function' == typeof fail && fail.apply(that, [{ key: text, value: message }]);
            });
            return this;
        },
        //模态框
        modal: modal,
        //模板引擎
        _template: function() {
            var _template;
            if ("function" == typeof global.template) {
                _template = global.template;
                try{delete global.template}catch(ex){global.template = undefined;}
            }
            return _template;
        }(),
        //模板引擎
        template: function(html, data) {
            return this._template(html || '')(data || {})
        }
    }
});
