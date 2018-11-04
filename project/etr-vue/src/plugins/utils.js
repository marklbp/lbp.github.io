import { Toast } from 'mand-mobile'

export function tipOK (str) {
  return Toast.succeed(str)
}

export function tipErr (str) {
  return Toast.failed(str)
}

export function tipLoading (str) {
  return Toast.loading(str)
}

export function tipText (str) {
  return Toast.info(str)
}

export function tipX () {
  return Toast.hide()
}

export default {
  tipOK, tipErr, tipLoading, tipText, tipX
}