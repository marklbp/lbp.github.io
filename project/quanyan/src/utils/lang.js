/* eslint-disable */
export const noop = function () {};
export const isArray = Array.isArray;

export function isString(val) {
    return typeof val === 'string';
}

export function isBoolean(val) {
    return val === true || val === false;
}

export function isFunction(val) {
    return typeof val === 'function';
}

export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

export function each(obj, iterator) {
    var i, key;

    if (obj && typeof obj.length === 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

export const assign = Object.assign || _assign;

function _assign(target) {
    var args = Array.prototype.slice.call(arguments, 1);

    args.forEach((source) => {
        _merge(target, source);
    });

    return target;
}

export function merge(target) {
    var args = Array.prototype.slice.call(arguments, 1);

    args.forEach((source) => {
        _merge(target, source, true);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}
