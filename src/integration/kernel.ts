import { startKernel } from "../kernel-loader"
import { callOnce } from "../utils/callOnce"
import { StoreType } from "../state/redux"

function fadeoutElement(id: string) {
  const initial = document.getElementById(id)
  if (initial) {
    initial.style.opacity = '0'
    setTimeout(() => {
      initial.style.display = 'none'
    }, 300)
  }
}

export const initializeKernel = callOnce(() => {
  startKernel()
  fadeoutElement('root-loading')
})

let RENDER_INITIALIZED = false
export function initializeRender(state: StoreType) {
  if (RENDER_INITIALIZED) {
    return true
  }

  console.log('initializeRender:', state)
  if (!!state?.renderer?.visible) {
    RENDER_INITIALIZED = true
    fadeoutElement('root')
  }

  return false
}