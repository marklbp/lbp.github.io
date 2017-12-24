!function(){
	var Demo = function () {
	    // IE mode
	    var isRTL = false;
	    var isIE8 = false;
	    var isIE9 = false;
	    var isIE10 = false;

	    var handleInit = function () {

	        isIE8 = !! navigator.userAgent.match(/MSIE 8.0/);
	        isIE9 = !! navigator.userAgent.match(/MSIE 9.0/);
	        isIE10 = !! navigator.userAgent.match(/MSIE 10.0/);

	        if (isIE10) {
	            jQuery('html').addClass('ie10'); // detect IE10 version
	        }
	        
	        if (isIE10 || isIE9 || isIE8) {
	            jQuery('html').addClass('ie'); // detect IE10 version
	        }
	    }

	    var handleSelect = function () {
	    	if(!$.fn.selectpicker)return;
	    	$('select[data-select]').selectpicker();
	    } 

	    var handleSwitch = function(){
	    	if(!$.fn.switchpicker)return;
	    	$('input[type=checkbox][data-switch]').switchpicker();
	    }

	    var handleUniform = function () {
	        if (!jQuery().uniform) {
	            return;
	        }
	        var test = $("input[type=checkbox][data-uniform], input[type=radio][data-uniform]");
	        if (test.size() > 0) {
	            test.each(function () {
	                if ($(this).parents(".qb-checker").size() == 0) {
	                    $(this).show();
	                    $(this).uniform();
	                }else{
	                	$.uniform.update(this); 
	                }
	            });
	        }
	    }

	    var handleSpinner = function(){
	    	if(!$.fn.spinner)return;
	    	$(".qb-spinner").spinner();
	    }

	    var handleTooltip = function(){
	    	if(!$.fn.tooltip)return;
	    	$("[data-toggle=tooltip]").tooltip({
	    		container:"body"
	    	});
	    }

	    return {
	        init: function () {
	            handleInit();
	            handleSelect(); 
	            handleSwitch();
	            handleUniform(); 
	            handleTooltip();
	        },

	        initAjax: function () {
	            handleSelect(); 
	            handleUniform();     
	        },

	        initUniform: function (els) {
	            if (els) {
	                jQuery(els).each(function () {
	                    if ($(this).parents(".qb-checker").size() == 0) {
	                        $(this).show();
	                        $(this).uniform();
	                    }
	                });
	            } else {
	                handleUniform();
	            }
	        },

	        updateUniform: function (els) {
	            $.uniform.update(els); 
	        },

	        getUniqueID: function(prefix) {
	            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
	        }
	    };

	}();

	Demo.init();
}()