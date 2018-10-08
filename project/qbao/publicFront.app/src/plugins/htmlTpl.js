+function(global){
    var _ = function(n, t) {
            return function(r) {
                var e = arguments.length;
                if (2 > e || null  == r)
                    return r;
                for (var u = 1; e > u; u++)
                    for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) {
                        var f = o[c];
                        t && r[f] !== void 0 || (r[f] = i[f])
                    }
                return r
            }
        }
        ,m = function(n) {
            return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n)
        };
    m.defaults=_(function(n) {
                        var M=!{
                            toString: null 
                        }.propertyIsEnumerable("toString");
                        if (!m.isObject(n))
                            return [];
                        var t = [];
                        for (var r in n){
                            t.push(r);
                        }
                        return M && e(n, t),t
                },true);
    m.isObject = function(n) {
        var t = typeof n;
        return "function" === t || "object" === t && !!n
    }
    m.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    var K = /(.)^/
        , z = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        }
        , D = /\\|'|\r|\n|\u2028|\u2029/g
        , L = function(n) {
            return "\\" + z[n]
        };
    m.template = function(n, t, r) {
        !t && r && (t = r),
        t = m.defaults({}, t, m.templateSettings);
        var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g")
          , u = 0
          , i = "__p+='";
        n.replace(e, function(t, r, e, o, a) {
            return i += n.slice(u, a).replace(D, L),
            u = a + t.length,
            r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"),
            t
        });
        i += "';\n";
        t.variable || (i = "with(obj||{}){\n" + i + "}\n"),
        i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var o = new Function(t.variable || "obj","_",i);
        } catch (a) {
            throw a.source = i,
            a
        }
        var c = function(n) {
            return o.call(this, n, m)
        }
          , f = t.variable || "obj";
        return c.source = "function(" + f + "){\n" + i + "}",
        c
    }
    return global.template=m.template;
}(this);