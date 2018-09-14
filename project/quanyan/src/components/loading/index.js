import Vue from 'vue'
import modal from './modal.vue'
import {addClass, removeClass} from '@/utils/dom'
import {supportPassive} from '@/utils'

const passiveSupported = supportPassive()
const prevent = e => e.preventDefault()

// TODO: refactored, need test
function Loading () {
  var loading = new (Vue.extend(modal))({
    el: document.createElement('div')
  })
  document.body.appendChild(loading.$el)
  // queueLoading.push(loading)
  loading.visible = false

  var hidden = true

  loading.show = function () {
    loading.visible = true
    if (!hidden) return
    addClass(document.body, 'overflowHidden')
    // on(document.body, 'touchmove', e => e.preventDefault())
    document.body.addEventListener('touchmove', prevent, passiveSupported ? { passive: false } : false)
    hidden = false
  }

  loading.hide = function () {
    loading.visible = false
    if (hidden) return
    removeClass(document.body, 'overflowHidden')
    // off(document.body, 'touchmove', e => e.preventDefault())
    document.body.removeEventListener('touchmove', prevent, passiveSupported ? { passive: false } : false)
    hidden = true
  }

  return loading
}

const loadingQueue = []
function toggle (visible) {
  if (!loadingQueue.length) loadingQueue.push(Loading())
  var loading = loadingQueue[0]
  if ((visible || typeof visible === 'undefined') && Object.prototype.toString.call(loading.show) === '[object Function]') loading.show()
  else if (Object.prototype.toString.call(loading.hide) === '[object Function]') loading.hide()
}

const ticks = []
function delay (visible, ms = 0) {
  if (visible) {
    ticks.push(setTimeout(() => toggle(), ms))
  } else {
    clearTimeout(ticks.splice(0, 1))
    ticks.length || toggle(false)
  }
}

export default delay
