/* eslint-disable */
// for a 60Hz monitor, requestAnimationFrame will trigger the callback every 16.67ms (1000 / 60 == 16.66...)
// todo: for performance concern, add threshold, to control how many times fn will be called in one minute
import {REDIRECT_INTERVAL} from '@/constants'
var ticking = false
export function requestFrame (fn, giveup) {
  if (!giveup || !ticking) {
    window.requestAnimationFrame(() => {
      ticking = false
      fn()
    })
    ticking = true
  }
}

export function isEmpty (val) {
  return val === undefined || val === null || val === ''
}

export function isString (value) {
  return typeof value === 'string'
}

export function isNumber (value) {
  return typeof value === 'number'
}

export function isObject (value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object'
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isUndefined (value) {
  return typeof value === 'undefined'
}

export function isInvalidDate (value) {
  return value.toString() === 'Invalid Date'
}

export const isArray = Array.isArray

export function postponeRedirect (fn) {
  setTimeout(fn, REDIRECT_INTERVAL)
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}


export function param2Obj(url) {
    const search = url.split('?')[1];
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}


export function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;
    setTimeout(() => {
        console.log(new Date())
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += '' + className;
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}

export const pickerOptions = [
    {
        text: '今天',
        onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().toDateString());
            end.setTime(start.getTime());
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近一周',
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
    }]

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

// 对象深拷贝
export function deepCopy(source) {
    var result = {};

    if (typeof source !== 'object' || source === null) {
        return source;
    }

    if (Object.prototype.toString.apply(source) == '[object Array]') {
        result = [];
        for(let i = 0, len = source.length; i < len; i++) {
            let temp = typeof source[i] === 'object' ? deepCopy(source[i]) : source[i];
            result.push(temp);
        }
    } else {
        for(var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
            }
        }
    }
    return result;
}

export function formatTimeStamp(timestamp, Cformat) {
    let format =  Cformat || "yyyy年MM月dd日 hh:mm";
    if (!timestamp || !/^\d+$/.test(timestamp)) {
        timestamp = 0;
    }
    let addZero = function (val) {
        return /^\d{1}$/.test(val) ? '0' + val : val;
    };

    let year = '',
        month = '',
        day = '',
        hours = '',
        minutes = '',
        seconds = '',
        week = '',
        weekStr = '';
    let date = new Date(timestamp);

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    week = date.getDay();

    switch (week) {
        case 0:
            weekStr = '日';
            break;
        case 1:
            weekStr = '一';
            break;
        case 2:
            weekStr = '二';
            break;
        case 3:
            weekStr = '三';
            break;
        case 4:
            weekStr = '四';
            break;
        case 5:
            weekStr = '五';
            break;
        case 6:
            weekStr = '六';
            break;
    }

    month = addZero(month);
    day = addZero(day);
    hours = addZero(hours);
    minutes = addZero(minutes);
    seconds = addZero(seconds);

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds).replace('W', weekStr);
}

// get url params
export function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
        r = window.location.search.substr(1).match(reg);

    if(r!=null)return  decodeURIComponent(r[2]); return null;
}

export function supportPassive () {
  var passive = false

  function noop () {}

  const options = Object.defineProperty({}, 'passive', {
    get () { passive = true }
  })

  // https://github.com/rafrex/detect-passive-events
  window.addEventListener('testPassive', noop, options)
  window.removeEventListener('testPassive', noop, options)
  return passive
}
