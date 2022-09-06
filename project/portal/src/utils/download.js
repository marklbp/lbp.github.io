export default function download(data, strFileName, strMimeType) {
  var self = window // this script is only for browsers anyway...
  var defaultMime = "application/octet-stream" // this default mime also triggers iframe downloads
  var mimeType = strMimeType || defaultMime
  var payload = data
  var url = typeof payload === 'string' && payload.indexOf('http') === 0 && payload
  var anchor = document.createElement("a")
  var toString = function(a) { return String(a); }
  var myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString)
  var fileName = strFileName || "download"
  var blob
  var reader
  myBlob = myBlob.call ? myBlob.bind(self) : Blob

  if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
    payload = [payload, mimeType];
    mimeType = payload[0];
    payload = payload[1];
  }

  if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
    anchor.href = url; // assign href prop to temp anchor
    if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
      /*var ajax = new XMLHttpRequest();
      ajax.open("GET", url, true);
      ajax.responseType = 'blob';
      ajax.onload = function(e) {
        download(e.target.response, strFileName, defaultMime);
      };
      setTimeout(function() { ajax.send(); }, 0); // allows setting custom ajax headers using the return:
      return new Promise(function (resolve, reject) {
        resolve(ajax)
      })*/
      return Vue.prototype.$http
        .request({
          url,
          method: 'get',
          responseType: 'blob',
          withCredentials: false
        })
        .then(({ data }) => {
          download(data, strFileName, defaultMime)
          return data
        })
    } // end if valid url?
  } // end if url?

  //go ahead and download dataURLs right away
  if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
    if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
      payload = dataUrlToBlob(payload);
      mimeType = payload.type || defaultMime;
    } else {
      if (navigator.msSaveBlob) {
        // IE10 can't do a[download], only Blobs:
        return navigator.msSaveBlob(dataUrlToBlob(payload) , fileName)
      } else {
        // everyone else can save dataURLs un-processed
        return saver(payload)
      }
    }
  } else { 
    //not data url, is it a string with special needs?
    if (/([\x80-\xff])/.test(payload)) {
      var tempUiArr = new Uint8Array(payload.length)
      var mx = tempUiArr.length
      for (var i = 0; i < mx; ++i) {
        tempUiArr[i] = payload.charCodeAt(i)
      }
      payload = new myBlob([tempUiArr], { type: mimeType })
    }
  }
  blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });

  function dataUrlToBlob(strUrl) {
    var parts = strUrl.split(/[:;,]/)
    var type = parts[1]
    var decoder = parts[2] == "base64" ? atob : decodeURIComponent
    var binData = decoder(parts.pop())
    var mx = binData.length
    var uiArr = new Uint8Array(mx)

    for (var i = 0; i < mx; ++i) {
      uiArr[i] = binData.charCodeAt(i)
    }
    return new myBlob([uiArr], { type: type })
  }

  function saver(url, winMode) {
    if ('download' in anchor) {
      //html5 A[download]
      anchor.href = url
      anchor.setAttribute("download", fileName)
      anchor.className = "download-js-link"
      anchor.innerHTML = "downloading..."
      anchor.style.display = "none"
      document.body.appendChild(anchor)
      setTimeout(function() {
        anchor.click()
        document.body.removeChild(anchor)
        if (winMode === true) {
          setTimeout(function() {
            self.URL.revokeObjectURL(anchor.href)
          }, 250) 
        }
      }, 66)
      return true
    }

    // handle non-a[download] safari as best we can:
    if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      if (/^data:/.test(url)) {
        url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime)
      }
      if (!window.open(url)) { 
        // popup blocked, offer direct download:
        if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) {
          location.href = url
        }
      }
      return true
    }

    //do iframe dataURL download (old ch+FF):
    var f = document.createElement("iframe")
    document.body.appendChild(f)

    if (!winMode && /^data:/.test(url)) {
      // force a mime that will download:
      url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime)
    }
    f.src = url
    setTimeout(function() { document.body.removeChild(f); }, 333)
  } //end saver

  if (navigator.msSaveBlob) {
    // IE10+ : (has Blob, but not a[download] or URL)
    return navigator.msSaveBlob(blob, fileName)
  }

  if (self.URL) {
    // simple fast and modern way using Blob and URL:
    saver(self.URL.createObjectURL(blob), true)
  } else {
    // handle non-Blob()+non-URL browsers:
    if (typeof blob === "string" || blob.constructor === toString) {
      try {
        return saver("data:" + mimeType + ";base64," + self.btoa(blob));
      } catch (y) {
        return saver("data:" + mimeType + "," + encodeURIComponent(blob));
      }
    }

    // Blob but not URL support:
    reader = new FileReader();
    reader.onload = function(e) {
      saver(this.result);
    };
    reader.readAsDataURL(blob);
  }
  return true;
}