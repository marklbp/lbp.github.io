function isFunction(it) {
    return ostring.call(it) === '[object Function]';
}

function isArray(it) {
    return ostring.call(it) === '[object Array]';
}

function each(ary, func) {
    if (ary) {
        var i;
        for (i = 0; i < ary.length; i += 1) {
            if (ary[i] && func(ary[i], i, ary)) {
                break;
            }
        }
    }
}

function eachReverse(ary, func) {
    if (ary) {
        var i;
        for (i = ary.length - 1; i > -1; i -= 1) {
            if (ary[i] && func(ary[i], i, ary)) {
                break;
            }
        }
    }
}

function hasProp(obj, prop) {
    return hasOwn.call(obj, prop);
}

function getOwn(obj, prop) {
    return hasProp(obj, prop) && obj[prop];
}

function eachProp(obj, func) {
    var prop;
    for (prop in obj) {
        if (hasProp(obj, prop)) {
            if (func(obj[prop], prop)) {
                break;
            }
        }
    }
}

function mixin(target, source, force, deepStringMixin) {
    if (source) {
        eachProp(source, function (value, prop) {
            if (force || !hasProp(target, prop)) {
                if (deepStringMixin && typeof value === 'object' && value &&
                    !isArray(value) && !isFunction(value) &&
                    !(value instanceof RegExp)) {

                    if (!target[prop]) {
                        target[prop] = {};
                    }
                    mixin(target[prop], value, force, deepStringMixin);
                } else {
                    target[prop] = value;
                }
            }
        });
    }
    return target;
}

function bind(obj, fn) {
    return function () {
        return fn.apply(obj, arguments);
    };
}

function scripts() {
    return document.getElementsByTagName('script');
}

function defaultOnError(err) {
    throw err;
}

function getGlobal(value) {
    if (!value) {
        return value;
    }
    var g = global;
    each(value.split('.'), function (part) {
        g = g[part];
    });
    return g;
}

function makeError(id, msg, err, requireModules) {
    var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
    e.requireType = id;
    e.requireModules = requireModules;
    if (err) {
        e.originalError = err;
    }
    return e;
}

function getInteractiveScript() {
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
        return interactiveScript;
    }

    eachReverse(scripts(), function (script) {
        if (script.readyState === 'interactive') {
            return (interactiveScript = script);
        }
    });
    return interactiveScript;
}