const isIOS = () => /(iPad|iPhone|iPod)/i.test(navigator.userAgent)

var scrollContainerId = 0
function nextId () {
  return 'ios-bounce-fix-id-' + scrollContainerId++
}
var callbacks = {}

export default {
  bind: function (el, binding) {
    if (!isIOS()) return
    if (!documentBinded) {
      document.addEventListener('touchmove', onPreventDefault, false)
      documentBinded = true
    }

    if (binding.modifiers.freeze) return

    var makeStopPropagations = makeStopPropagation(el)
    el.addEventListener('touchstart', makeStopPropagations.getStartY, false)
    el.addEventListener('touchmove', makeStopPropagations.getMoveY, false)
  },
  unbind: function (el, binding) {
    if (!isIOS()) return
    document.removeEventListener('touchmove', onPreventDefault, false)
    documentBinded = false

    if (binding.modifiers.freeze) return
    el.removeEventListener('touchmove', callbacks[el.dataset.bounceId], false)
    delete callbacks[el.dataset.bounceId]
  },

  install (vue) {
    vue.directive('ios-bounce', {bind: this.bind, unbind: this.unbind})
  }
}

var documentBinded = false

function onPreventDefault (evt) {
  evt.preventDefault()
}

function makeStopPropagation (el) {
  var startY = 0
  var moveY = 0
  function onStopPropagation (evt) {
    moveY = evt.touches[0].clientY
    if (el.getBoundingClientRect().height < el.scrollHeight && (el.scrollTop > 0 || moveY < startY) && (moveY > startY || el.scrollTop + el.clientHeight < el.scrollHeight)) {
      evt.stopPropagation()
    }
  }
  function getStartY (e) {
    startY = e.touches[0].clientY
  }
  var id = el.dataset.bounceId = nextId()
  callbacks[id] = onStopPropagation
  return { getMoveY: onStopPropagation, getStartY: getStartY }
}
