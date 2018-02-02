function Browser(window, document, body, XHR, $log) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {},
      lastLocationUrl,
      idCounter = 0,
      outstandingRequestCount = 0,
      outstandingRequestCallbacks = [],
      pollFns = [],
      pollTimeout,
      lastCookies = {},
      lastCookieString = '',
      hoverListener = noop;

  

  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn){ pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

  self.isMock = false;

  self.xhr = function(method, url, post, callback, headers) {
    outstandingRequestCount ++;
    if (lowercase(method) == 'json') {
      var callbackId = ("angular_" + Math.random() + '_' + (idCounter++)).replace(/\d\./, '');
      window[callbackId] = function(data) {
        window[callbackId].data = data;
      };

      var script = self.addJs(url.replace('JSON_CALLBACK', callbackId), null, function() {
        if (window[callbackId].data) {
          completeOutstandingRequest(callback, 200, window[callbackId].data);
        } else {
          completeOutstandingRequest(callback);
        }
        delete window[callbackId];
        body[0].removeChild(script);
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
          if (value) xhr.setRequestHeader(key, value);
      });
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // normalize IE bug (http://bugs.jquery.com/ticket/1450)
          var status = xhr.status == 1223 ? 204 : xhr.status || 200;
          completeOutstandingRequest(callback, status, xhr.responseText);
        }
      };
      xhr.send(post || '');
    }
  };

  self.notifyWhenNoOutstandingRequests = function(callback) {
    forEach(pollFns, function(pollFn){ pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  self.addPollFn = function(fn) {
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  self.setUrl = function(url) {

    var existingURL = lastLocationUrl;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    if (existingURL != url) {
      location.href = url;
    }
   };

  self.getUrl = function() {
    return lastLocationUrl = location.href;
  };

  self.onHashChange = function(listener) {
    // IE8 comp mode returns true, but doesn't support hashchange event
    var dm = window.document.documentMode;
    if ('onhashchange' in window && (isUndefined(dm) || dm >= 8)) {
      jqLite(window).bind('hashchange', listener);
    } else {
      var lastBrowserUrl = self.getUrl();

      self.addPollFn(function() {
        if (lastBrowserUrl != self.getUrl()) {
          listener();
          lastBrowserUrl = self.getUrl();
        }
      });
    }
    return listener;
  };

  self.cookies = function (name, value) {
    var cookieLength, cookieArray, cookie, i, keyValue, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = escape(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          rawDocument.cookie = escape(name) + '=' + escape(value);

          cookieLength = name.length + value.length + 1;
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
          if (lastCookies.length > 20) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because too many cookies " +
              "were already set (" + lastCookies.length + " > 20 )");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            lastCookies[unescape(cookie.substring(0, index))] = unescape(cookie.substring(index + 1));
          }
        }
      }
      return lastCookies;
    }
  };

  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };

  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
  };

  self.hover = function(listener) { hoverListener = listener; };

  self.bind = function() {
    document.bind("mouseover", function(event){
      hoverListener(jqLite(msie ? event.srcElement : event.target), true);
      return true;
    });
    document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      hoverListener(jqLite(event.target), false);
      return true;
    });
  };

  self.addCss = function(url) {
    var link = jqLite(rawDocument.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    body.append(link);
  };

  self.addJs = function(url, domId, done) {
    var script = rawDocument.createElement('script');

    script.type = 'text/javascript';
    script.src = url;
    if (domId) script.id = domId;

    if (msie) {
      script.onreadystatechange = function() {
        /loaded|complete/.test(script.readyState) && done && done();
      };
    } else {
      if (done) script.onload = script.onerror = done;
    }

    body[0].appendChild(script);

    return script;
  };
}