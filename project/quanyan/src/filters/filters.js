
import imgRatio from '@/constants/codeImg.js'
import { IMAGE_ROOT } from '@/constants/index.js'

export let makeImg = (arg = '', { width = '', height = '', code = '', m = 'fill' } = {}) => {
  //  默认图
  if (arg === '') {
    return ''
  }
  // 判断是否是个完整的地址
  if (arg.startsWith('http')) {
    //  如果图片链接的协议是http的，但是页面的链接的协议是https的，直接换成https
    if (window.location.href.startsWith('https') && !arg.startsWith('https')) {
      return arg.replace('http', 'https')
    }
    return arg
  }
  //  最终的url
  let url = IMAGE_ROOT + '/' + arg
  //  根据code查找配置
  if (code !== '' && imgRatio[code]) {
    let model = imgRatio[code]
    url = `${IMAGE_ROOT}/${arg}?x-oss-process=image/resize,w_${model.width},h_${model.height},m_${m}`
  }
  // 根据传递的分辨率来处理图片
  if (width !== '' && height !== '') {
    url = `${IMAGE_ROOT}/${arg}?x-oss-process=image/resize,w_${width},h_${height},m_${m}`
  }
  // 不处理图片
  return url
}

export default {
  /* 裁剪图片以及加前缀 */
  makeImg
}
