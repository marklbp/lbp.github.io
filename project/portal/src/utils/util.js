function messageOrder() {
  let instance
  return function(config) {
    if (!instance) {
      let duration = config.duration || 3000
      instance = this.$message(config)

      setTimeout(() => {
        instance = ''
      }, duration)
    }
  }
}

function getPath(routeObj) {
  return routeObj.path
}

function getGroupId(pathStr) {
  return pathStr.split('/', 2)
}

function composeFn(...args) {
  return args.reverse().reduce((result, fn) => {
    return (...relayArgs) => {
      return fn.call(null, result.apply(null, relayArgs))
    }
  }, args.shift())
}

// 生成UUID
function uuid() {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

function createXhr(imgSrc, cb) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', imgSrc, true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = function() {
    if (xhr.status == 200) {
      cb(xhr)
    }
  }
  xhr.send()
}

function createBse64(xhr) {
  let uInt8Array = new Uint8Array(xhr.response)
  let i = uInt8Array.length
  let binaryString = new Array(i)
  while (i--) {
    binaryString[i] = String.fromCharCode(uInt8Array[i])
  }
  let data = binaryString.join('')
  return window.btoa(data)
}

function getDataURL(canvas) {
  return canvas.toDataURL()
}

function getBase64(base64, outputFormat) {
  let dataUrl = `data: ${outputFormat || 'image/png'};base64,${base64}`
  return dataUrl
}

function dataURLtoBlob(dataurl) {
  let [type, content] = dataurl.split(',')
  let mime = type.match(/:(.*?);/)[1]

  let bstr = atob(content)
  let length = bstr.length
  let u8arr = new Uint8Array(length)
  while (length--) {
    u8arr[length] = bstr.charCodeAt(length)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

function getBlob(blob) {
  return window.URL.createObjectURL(blob)
}

function getDownImg(url, name = '图片.jpeg') {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function throttle(fn, interval = 100) {
  let timer
  return function() {
    let args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn && fn.apply(this, args)
    }, interval)
  }
}

export {
  messageOrder,
  getPath,
  getGroupId,
  composeFn,
  uuid,
  createXhr,
  createBse64,
  getBase64,
  dataURLtoBlob,
  getBlob,
  getDownImg,
  getDataURL,
  throttle
}
