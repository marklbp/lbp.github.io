+function ($) {
	var a=function(d, c, f){
        if (f) {
            f.stopPropagation();
            f.preventDefault()
        }
        this.$element = $(d);
        this.$parent  = this.$element.parent(); 
        this.options = $.extend({}, $.fn.switchpicker.defaults, this.$element.data(), typeof c == "object" && c);
        this.render = a.prototype.render;
        this.init()
	}
	a.prototype={
		constructor:a,
		init:function(){
			this.render();
		},
		change:function(){
			var c=this;
			this.$element.on("change.switch",function(){
				var checked=$(this).prop("checked");
				c.update(checked);
			})
		},
		update:function(a){
			this.$switchpicker.removeClass(a?this.options.unCheckedClass:this.options.checkedClass).addClass(a?this.options.checkedClass:this.options.unCheckedClass);
		},
		render:function(){
			var checked=this.$element.prop("checked");
			if(this.$parent.hasClass('switch')){
				this.$switchpicker=this.$parent;
				this.$parent=this.$parent.parent();
			}else{
				this.$switchpicker=$("<div class='switch'><span class='btn-switch'></span></div>");
				this.$parent.append(this.$switchpicker.append(this.$element));
			}
			this.update(checked);
			this.change();
		}
	}
	$.fn.switchpicker=function(e,f){
		var c=arguments,
			u,
			d=this.each(function() {
	            if ($(this).attr("type")=="checkbox") {
	                var m = $(this)
	                  , l = m.data("switchpicker")
	                  , h = typeof e == "object" && e;
	                if (!l) {
	                    m.data("switchpicker", (l = new a(this,h,f)))
	                } else {
	                    if (h) {
	                        for (var j in h) {
	                            l.options[j] = h[j]
	                        }
	                    }
	                }
	                if (typeof e == "string") {
	                    var k = e;
	                    if (l[k] instanceof Function) {
	                        [].shift.apply(c);
	                        g = l[k].apply(l, c)
	                    } else {
	                        g = l.options[k]
	                    }
	                }
	            }
	        });
		return u||d;
	}
	$.fn.switchpicker.defaults={
		checkedClass:"on",
		unCheckedClass:"off"
	}
}(jQuery)