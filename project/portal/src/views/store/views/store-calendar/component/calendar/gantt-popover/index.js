import Vue from 'vue'
import GanttPopover from './main.vue'
const GanttPopoverConstructor = Vue.extend(GanttPopover)
let instance
let timer

function getViewport() {
  // 已知宽度
  const TitleWidth = 315
  const sideWidth = 240
  const paddingWidth = 48
  // window.innerWidth 浏览器窗口可视区宽度（不包括浏览器控制台、菜单栏、工具栏）
  return window.innerWidth - (TitleWidth + sideWidth + paddingWidth)
}

function hasMainScroll() {
  const elMain = document.body.querySelector('.el-main')
  return elMain.scrollHeight > elMain.clientHeight
}

// 是否在可视区内
function hasInViewport(el) {
  // 判断是否有滚动条
  const windowWidth = window.innerWidth - (hasMainScroll() ? 16 : 0)
  const { x, width } = el.getBoundingClientRect()
  // 如果有滚动条则需要减去滚动条的宽度
  const viewportStart = 579
  const viewportEnd = windowWidth - 24
  const elementEnd = x + width
  // 判断元素是否在可视区
  const xCondition = x >= viewportStart && x <= viewportEnd
  const yCondition = elementEnd >= viewportStart && elementEnd <= viewportEnd
  return xCondition && yCondition
}

function createStyle(el) {
  let arrowLeft, currentX, ganttViewWidth
  const warpperX = 579
  const cardRect = instance.$el.getBoundingClientRect()
  const ganttRect = el.getBoundingClientRect()
  const windowWidth = window.innerWidth - (hasMainScroll() ? 16 : 0) - 24
  const top = ganttRect.y - cardRect.height - 15 + 'px'
  // 容器的宽度
  const warpperWidth = getViewport()
  // 是否在可视区内
  const isInViewport = hasInViewport(el)
  // 甘特图元素尾部的x坐标
  const ganttEndX = ganttRect.x + ganttRect.width
  const offsetWidth = ganttRect.x - warpperX
  // 视图内的甘特元素宽度
  ganttViewWidth = ganttRect.width
  currentX = ganttRect.x
  // ganttRect.x < warpperX || ganttEndX > windowWidth
  if (!isInViewport) {
    if (offsetWidth > 0) {
      // 右边
      ganttViewWidth = windowWidth - ganttRect.x
    } else {
      // 左边
      const lastWidth = offsetWidth + ganttRect.width
      // 当剩余宽度大于容器视图宽度时则视图内的甘特元素宽度为容器视图宽度
      ganttViewWidth = lastWidth > warpperWidth ? warpperWidth : lastWidth
      currentX = warpperX
    }
  }
  let left = currentX + ganttViewWidth / 2 - cardRect.width / 2 - 6
  if (ganttEndX > windowWidth && ganttViewWidth / 2 + 24 < cardRect.width / 2) {
    console.log('out')
    left = windowWidth - cardRect.width + 20
    arrowLeft = currentX + ganttViewWidth / 2 - left - 6 + 'px'
  }
  return {
    top,
    arrowLeft,
    left: left + 'px'
  }
}

function handleMouseleave() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    instance.visible = false
  }, 300)
}

function handleGanttMouseEnter(el, data) {
  clearTimeout(timer)
  instance.ganttData = data
  instance.visible = true
  instance.$nextTick(() => {
    instance.style = createStyle(el)
  })
}
function handleCardMouseEnter() {
  clearTimeout(timer)
  instance.visible = true
}

export default {
  inserted(el, binding, vNode) {
    if (!instance) {
      instance = new GanttPopoverConstructor()
      instance.$mount()
      document.body.appendChild(instance.$el)
    }
    const data = binding.value
    el.addEventListener(
      'mouseenter',
      handleGanttMouseEnter.bind(this, el, data)
    )
    el.addEventListener('mouseleave', handleMouseleave)
    instance.$el.addEventListener('mouseenter', handleCardMouseEnter)
    instance.$el.addEventListener('mouseleave', handleMouseleave)
  },
  unbind(el, binding, vNode) {
    instance.visible = false
    el.removeEventListener('mouseenter', handleGanttMouseEnter)
    el.removeEventListener('mouseleave', handleMouseleave)
    instance.$el.removeEventListener('mouseenter', handleCardMouseEnter)
    instance.$el.removeEventListener('mouseleave', handleMouseleave)
  }
}
