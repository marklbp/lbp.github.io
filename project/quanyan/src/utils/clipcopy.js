import { isApp } from '@/utils/common'

const isSupported = (action = ['copy', 'cut']) => {
  const actions = (typeof action === 'string') ? [action] : action
  let support = !!document.queryCommandSupported

  actions.forEach((action) => {
    support = support && !!document.queryCommandSupported(action)
  })

  return support
}

function select (element) {
  var selectedText

  if (element.nodeName === 'SELECT') {
    element.focus()

    selectedText = element.value
  } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
    var isReadOnly = element.hasAttribute('readonly')

    if (!isReadOnly) {
      element.setAttribute('readonly', '')
    }

    element.select()
    element.setSelectionRange(0, element.value.length)

    if (!isReadOnly) {
      element.removeAttribute('readonly')
    }

    selectedText = element.value
  } else {
    if (element.hasAttribute('contenteditable')) {
      element.focus()
    }

    var selection = window.getSelection()
    var range = document.createRange()

    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)

    selectedText = selection.toString()
  }

  return selectedText
}

const clipcopy = (target) => {
  // throw if no target node or no trigger node
  if (target.nodeType !== window.Node.ELEMENT_NODE) {
    throw new Error('clipcopy: target nodes are required.')
  }

  return new Promise((resolve, reject) => {
    var text = select(target)

    if (isApp()) {
      window.yhyBridge.ready().then((sdk) => {
        sdk.callHandler('copyText', { data: text }).then(data => {
          resolve()
        }).catch(() => {
          reject(new Error())
        })
      })
    } else {
      if (isSupported(['copy'])) {
        // execute the copy command
        const executed = document.execCommand('copy')

        // based on if the command executed
        // check if the appropriate callback exists, and if it does, call it
        if (executed) {
          resolve()
        } else {
          reject(new Error())
        }
      } else {
        reject(new Error())
      }
    }
  })
}

export default clipcopy
