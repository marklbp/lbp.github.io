
//? 序列化svg
//! 加载过的svg
var svgModel = {}
export function loadSvg (promise) {
  if (!promise) return false
  try {
    promise.then(renderSvg)
  } catch (err) {
    throw new Error(err)
  }
}

//? 融合
const svgSprite = contents => `
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  style="position:absolute;width:0;height:0"
>
  <defs>
    ${contents}
  </defs>
</svg>
`

//? 渲染svg
function renderSvg (iconModel = {}) {
  let icons = iconModel.default || iconModel
  let symbols = []
  if (Object.prototype.toString.call(iconModel) !== '[object Object]') return false
  for (let iconName in icons) {
    if (svgModel[iconName] && svgModel[iconName] !== icons[name]) {
      console.warn(`${iconName}的svg图标id命名重复，有可能导致图片渲染失败`)
    }
    //? 避免相同的svg重复渲染
    if (!svgModel[iconName]) {
      const svgContent = icons[iconName].split('svg')
      if (svgContent && svgContent.length === 3) {
        symbols.push(`<symbol id=${iconName}${svgContent[1]}symbol>`)
      }
    }
  }
  if (symbols.length > 0) {
    document.body.insertAdjacentHTML('afterbegin', svgSprite(symbols.join('')))
  }
}

export default {
  loadSvg
}
