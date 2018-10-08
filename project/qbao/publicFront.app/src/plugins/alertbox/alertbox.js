//bootstrap modal.js
+function(global,a){
    a(global.jQuery);
}(this,function(a) {
    "use strict";
    var b = function(b, c) {
        this.options = c,
        this.$element = a(b),
        this.$backdrop = this.isShown = null ,
        this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    b.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }

    b.prototype={
        constructor:b
        ,toggle : function(a) {
            return this[this.isShown ? "hide" : "show"](a)
        }
        
        ,show : function(b) {
            var c = this
              , d = a.Event("show.bs.modal", {
                relatedTarget: b
            });
            this.$element.trigger(d),
            this.isShown || d.isDefaultPrevented() || (this.isShown = !0,
            this.escape(),
            this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)),
            this.backdrop(function() {
                var d = a.support.transition && c.$element.hasClass("fade");
                c.$element.parent().length || c.$element.appendTo(document.body),
                c.$element.show().scrollTop(0),
                d && c.$element[0].offsetWidth,
                c.$element.addClass("in").attr("aria-hidden", !1),
                c.enforceFocus();
                var e = a.Event("shown.bs.modal", {
                    relatedTarget: b
                });
                d ? c.$element.find(".modal-dialog").one(a.support.transition.end, function() {
                    c.$element.focus().trigger(e)
                }).emulateTransitionEnd(300) : c.$element.focus().trigger(e)
            }))
        }
        ,hide : function(b) {
            b && b.preventDefault(),
            b = a.Event("hide.bs.modal"),
            this.$element.trigger(b),
            this.isShown && !b.isDefaultPrevented() && (this.isShown = !1,
            this.escape(),
            a(document).off("focusin.bs.modal"),
            this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"),
            a.support.transition && this.$element.hasClass("fade") ? this.$element.one(a.support.transition.end, a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
        }
        ,enforceFocus : function() {
            a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
                this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.focus()
            }, this))
        }
        ,escape : function() {
            this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function(a) {
                27 == a.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
        }
        ,hideModal : function() {
            var a = this;
            this.$element.hide(),
            this.backdrop(function() {
                a.removeBackdrop(),
                a.$element.trigger("hidden.bs.modal")
            })
        }
        ,removeBackdrop : function() {
            this.$backdrop && this.$backdrop.remove(),
            this.$backdrop = null 
        }
        ,backdrop : function(b) {
            var c = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var d = a.support.transition && c;
                if (this.$backdrop = a('<div class="modal-backdrop ' + c + '" />').appendTo(document.body),
                this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                    a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
                }, this)),
                d && this.$backdrop[0].offsetWidth,
                this.$backdrop.addClass("in"),
                !b)
                    return;
                d ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()
            } else
                !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"),
                a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()) : b && b()
        }
    };

    var c = a.fn.modal;
    a.fn.modal = function(c, d) {
        return this.each(function() {
            var e = a(this)
              , f = e.data("bs.modal")
              , g = a.extend({}, b.DEFAULTS, e.data(), "object" == typeof c && c);
            f || e.data("bs.modal", f = new b(this,g)),
            "string" == typeof c ? f[c](d) : g.show && f.show(d)
        })
    }
    ,a.fn.modal.Constructor = b
    ,a.fn.modal.noConflict = function() {
        return a.fn.modal = c,this
    }
    ,a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(b) {
        var a = globals.jQuery
          , c = a(this)
          , d = c.attr("href")
          , e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, ""))
          , f = e.data("bs.modal") ? "toggle" : a.extend({
            remote: !/#/.test(d) && d
        }, e.data(), c.data());
        c.is("a") && b.preventDefault(),
        e.modal(f, this).one("hide", function() {
            c.is(":visible") && c.focus()
        })
    }).on("show.bs.modal", ".modal", function() {
        a(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal", function() {
        a(document.body).removeClass("modal-open")
    })
})
//extend modal.js {alert|confirm|prompt|dialog}
,function(global,a){
    if("function"== typeof define&&define.cmd){
        define(function(){
            arguments[0]('modal');
            return a.call(arguments[2],global.jQuery,undefined,'alertbox')
        })
    }else{
        if(global.alertbox)global._alertbox=global.alertbox;
        global.alertbox=a.call(global,global.jQuery,undefined,'alertbox')
    }
}(this,function a(b, c,componentName) {
    function d(a) {
        var b = r[p.locale];
        return b ? b[a] : r.en[a]
    }
    function e(a, c, d) {
        a.preventDefault();
        var e = b.isFunction(d) && d(a) === !1;
        e || c.modal("hide")
    }
    function f(a) {
        var b, c = 0;
        for (b in a)
            c++;
        return c
    }
    function g(a, c) {
        var d = 0;
        b.each(a, function(a, b) {
            c(a, b, d++)
        })
    }
    function h(a) {
        var c, d;
        if ("object" != typeof a)
            throw new Error("Please supply an object of options");
        if (!a.message)
            throw new Error("Please specify a message");
        return a = b.extend({}, p, a),
        a.buttons || (a.buttons = {}),
        a.backdrop = a.backdrop ? a.backdrop : !1,
        c = a.buttons,
        d = f(c),
        g(c, function(a, e, f) {
            if (b.isFunction(e) && (e = c[a] = {
                callback: e
            }),
            "object" !== b.type(e))
                throw new Error("button with key " + a + " must be an object");
            e.label || (e.label = a),
            e.className || (e.className = 2 >= d && f === d - 1 ? "btn-primary" : "btn-default")
        }),
        a
    }
    function i(a, b) {
        var c = a.length
          , d = {};
        if (1 > c || c > 2)
            throw new Error("Invalid argument length");
        return 2 === c || "string" == typeof a[0] ? (d[b[0]] = a[0],
        d[b[1]] = a[1]) : d = a[0],
        d
    }
    function j(a, c, d) {
        return b.extend(!0, {}, a, i(c, d))
    }
    function k(a, b, c, d) {
        var e = {
            className: p.prefixClass+"-" + a,
            buttons: l.apply(null , b)
        };
        return m(j(e, d, c), b)
    }
    function l() {
        for (var a = {}, b = 0, c = arguments.length; c > b; b++) {
            var e = arguments[b]
              , f = e.toLowerCase()
              , g = e.toUpperCase();
            a[f] = {
                label: d(g)
            }
        }
        return a
    }
    function m(a, b) {
        var d = {};
        return g(b, function(a, b) {
            d[b] = !0
        }),
        g(a.buttons, function(a) {
            if (d[a] === c)
                throw new Error("button key " + a + " is not allowed (options are " + b.join("\n") + ")")
        }),
        a
    }
    var n = {
        dialog: "<div class='modal' tabindex='-1' role='dialog'>"
                +   "<div class='modal-dialog'>"
                +      "<div class='modal-content'>"
                +         "<div class='modal-body'></div>"
                +      "</div>"
                +   "</div>"
               +"</div>"

        ,header: "<div class='modal-header'><h4 class='modal-title'></h4></div>"

        ,footer: "<div class='modal-footer'></div>"

        ,closeButton: "<button type='button' class='close-button close'>&times;</button>"

        ,form: "<form class='form'></form>"

        ,inputs: {
            text: "<input class='input input-text form-control' autocomplete=off type=text />"

            ,email: "<input class='input input-email form-control' autocomplete='off' type='email' />"

            ,select: "<select class='input input-select form-control'></select>"

            ,checkbox: "<div class='checkbox'><label><input class='input input-checkbox' type='checkbox' /></label></div>"
        }
    }
      , o = b("body")
      , p = {
        locale: "zh_CN",
        backdrop: !0,
        animate: !0,
        className: null ,
        closeButton: !0,
        show: !0,
        prefixClass:'modal'
    }
      , dialogs = []
      , q = {};

    q.alert = function() {
        var a;
        if (a = k("alert", ["ok"], ["message", "callback"], arguments),
        a.callback && !b.isFunction(a.callback))
            throw new Error("alert requires callback property to be a function when provided");
        return a.buttons.ok.callback = a.onEscape = function() {
            return b.isFunction(a.callback) ? a.callback() : !0
        }
        ,
        q.dialog(a)
    }

    ,q.confirm = function() {
        var a;
        if (a = k("confirm", ["cancel", "confirm"], ["message", "callback"], arguments),
        a.buttons.cancel.callback = a.onEscape = function() {
            return a.callback(!1)
        }
        ,
        a.buttons.confirm.callback = function() {
            return a.callback(!0)
        }
        ,
        !b.isFunction(a.callback))
            throw new Error("confirm requires a callback");
        return q.dialog(a)
    }

    ,q.prompt = function() {
        var a, d, e, f, h, i, k;
        if (f = b(n.form),
        d = {
            className: "prompt",
            buttons: l("cancel", "confirm"),
            value: "",
            inputType: "text"
        },
        a = m(j(d, arguments, ["title", "callback"]), ["cancel", "confirm"]),
        i = a.show === c ? !0 : a.show,
        a.message = f,
        a.buttons.cancel.callback = a.onEscape = function() {
            return a.callback(null )
        }
        ,
        a.buttons.confirm.callback = function() {
            var c;
            switch (a.inputType) {
            case "text":
            case "email":
            case "select":
                c = h.val();
                break;
            case "checkbox":
                var d = h.find("input:checked");
                c = [],
                g(d, function(a, d) {
                    c.push(b(d).val())
                })
            }
            return a.callback(c)
        }
        ,
        a.show = !1,
        !a.title)
            throw new Error("prompt requires a title");
        if (!b.isFunction(a.callback))
            throw new Error("prompt requires a callback");
        if (!n.inputs[a.inputType])
            throw new Error("invalid prompt type");
        switch (h = b(n.inputs[a.inputType]),
        a.inputType) {
        case "text":
        case "email":
            h.val(a.value);
            break;
        case "select":
            var o = {};
            if (k = a.inputOptions || [],
            !k.length)
                throw new Error("prompt with select requires options");
            g(k, function(a, d) {
                var e = h;
                if (d.value === c || d.text === c)
                    throw new Error("given options in wrong format");
                d.group && (o[d.group] || (o[d.group] = b("<optgroup/>").attr("label", d.group)),
                e = o[d.group]),
                e.append("<option value='" + d.value + "'>" + d.text + "</option>")
            }),
            g(o, function(a, b) {
                h.append(b)
            }),
            h.val(a.value);
            break;
        case "checkbox":
            var p = b.isArray(a.value) ? a.value : [a.value];
            if (k = a.inputOptions || [],
            !k.length)
                throw new Error("prompt with checkbox requires options");
            if (!k[0].value || !k[0].text)
                throw new Error("given options in wrong format");
            h = b("<div/>"),
            g(k, function(c, d) {
                var e = b(n.inputs[a.inputType]);
                e.find("input").attr("value", d.value),
                e.find("label").append(d.text),
                g(p, function(a, b) {
                    b === d.value && e.find("input").prop("checked", !0)
                }),
                h.append(e)
            })
        }
        return a.placeholder && h.attr("placeholder", a.placeholder),
        f.append(h),
        f.on("submit", function(a) {
            a.preventDefault(),
            e.find(".btn-primary").click()
        }),
        e = q.dialog(a),
        e.off("shown.bs.modal"),
        e.on("shown.bs.modal", function() {
            h.focus()
        }),
        i === !0 && e.modal("show"),
        e
    }
    
    ,q.dialog = function(a) {
        a = h(a);
        var c = b(n.dialog)
          , d = c.find(".modal-body")
          , f = a.buttons
          , i = ""
          , j = {
            onEscape: a.onEscape
        };
        dialogs.push(c),
        g(f, function(a, b) {
            i += "<button data-bb-handler='" + a + "' type='button' class='btn " + b.className + "'>" + b.label + "</button>",
            j[a] = b.callback
        }),
        d.html(a.message),
        a.animate === !0 && c.addClass("fade"),
        a.className && c.addClass(a.className),
        a.title && d.before(n.header);
        if(a.closeButton) {
            var k = b(n.closeButton);
            a.title ? c.find(".modal-header").prepend(k) : k.css("margin-top", "-10px").prependTo(d)
        }
        return a.title && c.find(".modal-title").html(a.title),
        i.length && (d.after(n.footer),
        c.find(".modal-footer").html(i)),
        c.on("hidden.bs.modal", function(a) {
            a.target === this && c.remove()
        }),
        c.on("shown.bs.modal", function() {
            c.find(".btn-primary:first").focus()
        }),
        c.on("escape.close.bb", function(a) {
            j.onEscape && e(a, c, j.onEscape)
        }),
        c.on("click", ".modal-footer button", function(a) {
            var d = b(this).data("bb-handler");
            e(a, c, j[d])
        }),
        c.on("click", ".close-button", function(a) {
            e(a, c, j.onEscape)
        }),
        c.on("keyup", function(a) {
            27 === a.which && c.trigger("escape.close.bb")
        }),
        o.append(c),
        c.modal({
            backdrop: a.backdrop,
            keyboard: !1,
            show: !1
        }),
        a.show && c.modal("show"),
        c
    }
    
    ,q.setDefaults = function() {
        var a = {};
        2 === arguments.length ? a[arguments[0]] = arguments[1] : a = arguments[0],
        b.extend(p, a)
    }
    
    ,q.hideAll = function() {
        b.each(dialogs,function(i,v){
            b(v).modal("hide")
        })
    };

    var r = {
        br: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Sim"
        },
        da: {
            OK: "OK",
            CANCEL: "Annuller",
            CONFIRM: "Accepter"
        },
        de: {
            OK: "OK",
            CANCEL: "Abbrechen",
            CONFIRM: "Akzeptieren"
        },
        en: {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        es: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Aceptar"
        },
        fi: {
            OK: "OK",
            CANCEL: "Peruuta",
            CONFIRM: "OK"
        },
        fr: {
            OK: "OK",
            CANCEL: "Annuler",
            CONFIRM: "D'accord"
        },
        it: {
            OK: "OK",
            CANCEL: "Annulla",
            CONFIRM: "Conferma"
        },
        nl: {
            OK: "OK",
            CANCEL: "Annuleren",
            CONFIRM: "Accepteren"
        },
        no: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        pl: {
            OK: "OK",
            CANCEL: "Anuluj",
            CONFIRM: "Potwierdź"
        },
        ru: {
            OK: "OK",
            CANCEL: "Отмена",
            CONFIRM: "Применить"
        },
        zh_CN: {
            OK: "确认",
            CANCEL: "取消",
            CONFIRM: "确认"
        },
        zh_TW: {
            OK: "確認",
            CANCEL: "取消",
            CONFIRM: "確認"
        }
    }
        ,that = this
        ,args = arguments
        ,callee = arguments.callee 

    return q.init = function(c) {
        that[args[2]] = callee.call(that,c || b,args[1],args[2])
    }
    ,q
});
