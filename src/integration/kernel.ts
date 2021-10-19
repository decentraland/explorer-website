import { startKernel } from "../kernel-loader"
import { callOnce } from "../utils/callOnce"
import { StoreType } from "../state/redux"
import { Store } from "redux"
import { setKernelError, setRendererVisible } from "../state/actions"

function fadeinElement(id: string)  {
  const element = document.getElementById(id)
  if (element) {
    element.style.display = ''
    element.style.opacity = '1'
  }
}

function fadeoutElement(id: string, callback?: () => void) {
  const element = document.getElementById(id)
  if (element) {
    element.style.opacity = '0'
    setTimeout(() => {
      element.style.display = 'none'
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

let RENDER_ERROR = false
let RENDER_INITIALIZED = false
export function initializeRender(store: Store<StoreType>) {
  const state = store.getState()

  if (!RENDER_INITIALIZED && !!state?.renderer?.ready) {
    RENDER_INITIALIZED = true
    fadeoutElement('root', () => {
      store.dispatch(setRendererVisible(true))
    })
  }

  if (!RENDER_ERROR && !!state.error.error) {
    RENDER_ERROR = true
    fadeinElement('root')
  }

  return false
}