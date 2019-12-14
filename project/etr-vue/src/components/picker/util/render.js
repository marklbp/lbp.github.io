export default (function (global) {
  var doc = typeof window !== 'undefined' && window.document || {
    documentElement: {
      style: {}
    },
    createElement() {
      return {
        style: {}
      }
    }
  }
  var docStyle = doc.documentElement.style;

  var engine = void 0;

  if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator.cpuClass === 'string') {
    engine = 'trident';
  }

  var vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];

  var helperElem = doc.createElement('div');
  var perspectiveProperty = vendorPrefix + 'Perspective';
  var transformProperty = vendorPrefix + 'Transform';

  if (helperElem.style[perspectiveProperty] !== undefined) {
    return function (content, left, top) {
      // console.log(top)
      content.style[transformProperty] = 'translate3d(' + -left + 'px,' + -top + 'px,0)';
    };
  } else if (helperElem.style[transformProperty] !== undefined) {
    return function (content, left, top) {
      content.style[transformProperty] = 'translate(' + -left + 'px,' + -top + 'px,0)';
    };
  } else {
    return function (content, left, top) {
      content.style.marginLeft = left ? -left + 'px' : '';
      content.style.marginTop = top ? -top + 'px' : '';
    };
  }
})(typeof window === 'object' ? window : typeof global === 'object' ? global : {})