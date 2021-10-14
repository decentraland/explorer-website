import { startKernel } from "../kernel-loader"
import { callOnce } from "../utils/callOnce"
import { StoreType } from "../state/redux"
import { Store } from "redux"
import { setRendererVisible } from "../state/actions"

function fadeoutElement(id: string, callback?: () => void) {
  const initial = document.getElementById(id)
  if (initial) {
    initial.style.opacity = '0'
    setTimeout(() => {
      initial.style.display = 'none'
      if (callback) {
        callback()
      }
    }, 300)
  }
}

export const initializeKernel = callOnce(() => {
  startKernel()
  fadeoutElement('root-loading')
})

let RENDER_INITIALIZED = false
export function initializeRender(store: Store<StoreType>) {
  if (RENDER_INITIALIZED) {
    return true
  }

  const state = store.getState()
  if (!!state?.renderer?.complete) {
    RENDER_INITIALIZED = true
    fadeoutElement('root', () => {
      store.dispatch(setRendererVisible(true))
    })
  }

  return false
}