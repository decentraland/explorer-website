import { Store } from "redux"
import { StoreType } from "../state/redux"
import { startKernel } from "../kernel-loader"
import { callOnce } from "../utils/callOnce"

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

export function configureKernel(store: Store<StoreType>) {
  store.subscribe(() => hideRoot(store.getState()))
}

let ROOT_HIDDEN = false
function hideRoot (state: StoreType) {
  const sessionReady = !!state.session?.ready
  const rendererReady = !!state.renderer?.ready
  const error = !!state.error?.error

  if (!ROOT_HIDDEN && !error && !!rendererReady && !!sessionReady) {
    ROOT_HIDDEN = true
    document.getElementById('root')!.style.display = 'none'
  } else if (ROOT_HIDDEN && (!!error || !rendererReady || !sessionReady)) {
    ROOT_HIDDEN = false
    document.getElementById('root')!.style.display = 'block'
  }
}